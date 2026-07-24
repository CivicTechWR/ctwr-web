# frozen_string_literal: true

# _plugins/fetch_luma_event.rb
#
# Fetches the next upcoming CivicTech WR hacknight from the Luma iCal feed
# at Jekyll build time, then stores the result in site.data['next_meeting'].
#
# Used by _includes/meeting-section.html to show live event details.
# If the fetch fails for any reason, static fallback values are used instead.

require "net/http"
require "uri"
require "time"

module CivicTechWR
  class LumaEventGenerator < Jekyll::Generator
    safe true
    priority :low

    LUMA_ICAL_URL = "https://api2.luma.com/ics/get?entity=calendar&id=cal-BVpgpDCgYaCqcPx".freeze
    FETCH_RETRY_LIMIT = 3
    MAX_REDIRECTS = 10
    RETRYABLE_HTTP_CODES = %w[408 425 429 500 502 503 504].freeze

    # Raised only for retryable HTTP status codes so the rescue clause can
    # distinguish transient server errors from permanent failures (e.g. 404).
    class TransientFetchError < StandardError; end

    FALLBACK = {
      "name"             => "CivicTechWR Hacknight",
      "date_formatted"   => "Wednesdays",
      "time_formatted"   => "5:30 PM",
      "datetime_iso"     => nil,
      "datetime_iso_end" => nil,
      "location_short"   => "165 King St W, Kitchener",
      "location_full"    => "165 King St W, Kitchener, ON",
      "event_url"        => "https://luma.com/civictechwr",
      "found"            => false
    }.freeze

    def generate(site)
      site.data["next_meeting"] = fetch_next_event
    rescue => e
      Jekyll.logger.warn "LumaEvents:", "Failed to fetch event data (#{e.class}): #{e.message}. Using fallback."
      site.data["next_meeting"] = FALLBACK
    end

    private

    def fetch_next_event
      ical   = fetch_ical(LUMA_ICAL_URL)
      events = parse_ical_events(ical)
      now    = Time.now.utc

      next_event = events
        .select { |e| e[:start_at] && e[:start_at].utc > now }
        .min_by { |e| e[:start_at] }

      unless next_event
        Jekyll.logger.warn "LumaEvents:", "No upcoming events found in Luma iCal feed. Using fallback."
        return FALLBACK
      end

      format_event(next_event)
    end

    def fetch_ical(url)
      attempts   = 0
      redirects  = 0

      loop do
        attempts += 1

        begin
          uri = URI.parse(url)
          req = Net::HTTP::Get.new(uri)
          req["User-Agent"] = "Mozilla/5.0 (compatible; Jekyll/4.0; +https://civictechwr.org)"
          req["Accept"] = "text/calendar, */*;q=0.8"
          req["Cache-Control"] = "no-cache"

          res = Net::HTTP.start(uri.hostname, uri.port,
                                use_ssl: (uri.scheme == "https"),
                                open_timeout: 15,
                                read_timeout: 15) do |http|
            http.request(req)
          end

          case res
          when Net::HTTPSuccess
            body = res.body.to_s
            raise "Empty response body from #{url}" if body.strip.empty?

            return body
          when Net::HTTPRedirection
            location = res["location"]
            raise "Redirect from #{url} missing location header" if location.to_s.empty?

            redirects += 1
            raise "Too many redirects fetching #{url}" if redirects > MAX_REDIRECTS

            url      = URI.parse(url).merge(location).to_s
            attempts = 0
          else
            raise "HTTP #{res.code} received from #{url}" unless RETRYABLE_HTTP_CODES.include?(res.code)

            raise TransientFetchError, "Retryable HTTP #{res.code} received from #{url}"
          end
        rescue TransientFetchError, Net::OpenTimeout, Net::ReadTimeout,
               Errno::ECONNREFUSED, Errno::EHOSTUNREACH, SocketError,
               OpenSSL::SSL::SSLError => e
          raise if attempts >= FETCH_RETRY_LIMIT

          Jekyll.logger.warn "LumaEvents:",
            "Fetch attempt #{attempts} failed (#{e.class}): #{e.message}. Retrying."
          sleep attempts
        end
      end
    end

    # Parse VEVENT blocks from iCal text, returning an array of hashes with
    # symbolised keys: :summary, :start_at, :end_at, :location, :description, :uid
    def parse_ical_events(ical_text)
      # RFC 5545 line unfolding: lines starting with SPACE or TAB continue the previous line
      unfolded = ical_text.gsub(/\r?\n[ \t]/, "")

      events = []
      in_event = false
      current = {}

      unfolded.each_line do |line|
        line = line.chomp
        case line
        when "BEGIN:VEVENT"
          in_event = true
          current = {}
        when "END:VEVENT"
          events << build_event(current) if current["DTSTART"]
          in_event = false
          current = {}
        else
          next unless in_event

          # Split property name (with optional params) from value on first colon
          if (m = line.match(/\A([^:;]+)(?:;[^:]*)?:(.*)\z/))
            current[m[1].upcase] = m[2]
          end
        end
      end

      events
    end

    def build_event(props)
      {
        summary:     props["SUMMARY"].to_s,
        start_at:    parse_ical_dt(props["DTSTART"]),
        end_at:      parse_ical_dt(props["DTEND"]),
        location:    unescape_ical(props["LOCATION"].to_s),
        description: unescape_ical(props["DESCRIPTION"].to_s),
        uid:         props["UID"].to_s
      }
    end

    # Parse iCal datetime strings: YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS or YYYYMMDD
    # Always returns UTC to avoid dependence on the build machine's local timezone.
    # Returns nil (rather than raising, or silently normalizing) for out-of-range
    # components (e.g. month 13, or day 30 in February) so one malformed
    # DTSTART/DTEND in the feed just drops that field/event instead of aborting
    # the whole fetch to FALLBACK or displaying a silently-shifted wrong date.
    def parse_ical_dt(dt_str)
      return nil if dt_str.to_s.strip.empty?

      s = dt_str.strip
      if (m = s.match(/\A(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z\z/))
        build_validated_utc(m[1], m[2], m[3], m[4], m[5], m[6])
      elsif (m = s.match(/\A(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\z/))
        build_validated_utc(m[1], m[2], m[3], m[4], m[5], m[6])
      elsif (m = s.match(/\A(\d{4})(\d{2})(\d{2})\z/))
        build_validated_utc(m[1], m[2], m[3], "0", "0", "0")
      end
    rescue ArgumentError
      nil
    end

    # Time.utc silently normalizes an out-of-range day (e.g. Feb 30 -> Mar 2)
    # instead of raising, unlike month/hour/minute which do raise ArgumentError.
    # Compare the constructed Time's components back against the parsed input
    # so a corrupted day is rejected (nil) rather than silently becoming a
    # different, valid-looking date.
    def build_validated_utc(year_s, month_s, day_s, hour_s, min_s, sec_s)
      year, month, day, hour, min, sec = [year_s, month_s, day_s, hour_s, min_s, sec_s].map(&:to_i)
      # RFC 5545 allows :60 to represent a leap second, but Time.utc(..., 60)
      # rolls over to the next minute rather than preserving it -- clamp to :59
      # (the RFC's own fallback for systems without leap-second support) before
      # validating, so a legitimate leap-second timestamp isn't rejected as nil.
      validated_sec = sec == 60 ? 59 : sec
      t = Time.utc(year, month, day, hour, min, validated_sec)
      return nil unless t.year == year && t.month == month && t.day == day &&
                        t.hour == hour && t.min == min && t.sec == validated_sec

      t
    end

    # Unescape iCal text-value escapes per RFC 5545:
    # \n or \N → newline, \, → comma, \; → semicolon, \\ → backslash
    def unescape_ical(str)
      str.gsub(/\\[nN]/, "\n").gsub("\\,", ",").gsub("\\;", ";").gsub("\\\\", "\\")
    end

    # Extract the first https://luma.com/... URL from the event description
    def extract_event_url(description)
      description.to_s[%r{https://luma\.com/[a-z0-9]+}i]
    end

    # Derive a short location: "165 King St W, Kitchener" from
    # "165 King St W, Kitchener, ON N2G 1A7, Canada"
    def short_location(location)
      # Luma substitutes the event URL in LOCATION when the address is hidden
      # until RSVP — treat any URL as "no physical address provided"
      return "165 King St W, Kitchener" if location.to_s.start_with?("https://", "http://")

      parts = location.split(",").map(&:strip)
      # Take street + city (first two non-empty comma-delimited parts)
      short = parts.first(2).join(", ")
      short.empty? ? "165 King St W, Kitchener" : short
    end

    # Full-length counterpart to short_location — same URL-substitution guard,
    # since Luma hides the address behind an RSVP link the same way here too.
    def full_location(location)
      return "165 King St W, Kitchener, ON" if location.to_s.start_with?("https://", "http://")

      location.to_s.empty? ? "165 King St W, Kitchener, ON" : location
    end

    def format_event(event)
      start_utc = event[:start_at].utc
      local     = to_eastern(start_utc)
      # RFC 5545 requires DTEND to be strictly after DTSTART; omit an end time
      # that isn't (rather than publishing an illogical endDate <= startDate
      # in the site's Event JSON-LD) instead of trusting the feed blindly.
      local_end = (event[:end_at] && event[:end_at] > event[:start_at]) ? to_eastern(event[:end_at].utc) : nil

      # Format time without leading zero, cross-platform
      hour   = local.hour % 12
      hour   = 12 if hour.zero?
      ampm   = local.hour < 12 ? "AM" : "PM"
      minute = format("%02d", local.min)

      location_full  = full_location(event[:location])
      location_short = short_location(event[:location])
      event_url      = extract_event_url(event[:description]) || "https://luma.com/civictechwr"
      name           = event[:summary].empty? ? FALLBACK["name"] : event[:summary]

      result = {
        "name"             => name,
        "date_formatted"   => "#{local.strftime('%A, %B')} #{local.day}",
        "time_formatted"   => "#{hour}:#{minute} #{ampm}",
        "datetime_iso"     => local.iso8601,
        "datetime_iso_end" => local_end&.iso8601,
        "location_short"   => location_short,
        "location_full"    => location_full,
        "event_url"        => event_url,
        "found"            => true
      }

      Jekyll.logger.info "LumaEvents:",
        "Next event: #{result['date_formatted']} at #{result['time_formatted']} — #{result['location_short']}"
      result
    end

    # Convert a UTC Time to Eastern Time (America/Toronto) using TZInfo if available,
    # otherwise fall back to a manual DST calculation.
    # Returns a Time object whose iso8601 output includes the correct UTC offset
    # (e.g. "2026-04-15T17:30:00-04:00") so the <time datetime> attribute is accurate.
    def to_eastern(utc_time)
      require "tzinfo"
      TZInfo::Timezone.get("America/Toronto").to_local(utc_time)
    rescue LoadError
      offset_hours = dst_offset(utc_time)
      offset_str   = format("%+03d:00", offset_hours)
      shifted      = Time.at(utc_time.to_i + offset_hours * 3600).utc
      Time.new(shifted.year, shifted.month, shifted.day,
               shifted.hour, shifted.min, shifted.sec, offset_str)
    end

    # Manual EST/EDT offset calculation when tzinfo is not available.
    # EDT (UTC-4): second Sunday of March through first Sunday of November
    # EST (UTC-5): remainder of year
    def dst_offset(utc_time)
      year = utc_time.year

      # Second Sunday of March at 2:00 AM EST (= 7:00 AM UTC)
      mar1      = Time.utc(year, 3, 1)
      first_sun = 1 + (7 - mar1.wday) % 7
      dst_start = Time.utc(year, 3, first_sun + 7, 7)

      # First Sunday of November at 2:00 AM EDT (= 6:00 AM UTC)
      nov1         = Time.utc(year, 11, 1)
      dst_end_day  = 1 + (7 - nov1.wday) % 7
      dst_end      = Time.utc(year, 11, dst_end_day, 6)

      (utc_time >= dst_start && utc_time < dst_end) ? -4 : -5
    end
  end
end
