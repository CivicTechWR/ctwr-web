# frozen_string_literal: true

# _plugins/fetch_luma_event.rb
#
# Fetches the next upcoming CivicTech WR hacknight from the Luma calendar page
# at Jekyll build time, then stores the result in site.data['next_meeting'].
#
# Used by _includes/meeting-section.html to show live event details.
# If the fetch fails for any reason, static fallback values are used instead.

require "net/http"
require "json"
require "uri"
require "time"
require "cgi"

module CivicTechWR
  class LumaEventGenerator < Jekyll::Generator
    safe true
    priority :low

    LUMA_CALENDAR_URL = "https://luma.com/civictechwr".freeze
    FETCH_RETRY_LIMIT = 3
    MAX_REDIRECTS = 5
    RETRYABLE_HTTP_CODES = %w[408 425 429 500 502 503 504].freeze

    FALLBACK = {
      "date_formatted" => "Wednesdays",
      "time_formatted" => "6:00 PM",
      "datetime_iso"   => nil,
      "location_short" => "Downtown Kitchener",
      "location_full"  => "",
      "event_url"      => "https://luma.com/civictechwr",
      "found"          => false
    }.freeze

    def generate(site)
      site.data["next_meeting"] = fetch_next_event
    rescue => e
      Jekyll.logger.warn "LumaEvents:", "Failed to fetch event data: #{e.message}. Using fallback."
      site.data["next_meeting"] = FALLBACK
    end

    private

    def fetch_next_event
      html   = fetch_page(LUMA_CALENDAR_URL)
      events = extract_events(html)
      now    = Time.now.utc

      next_event = events
        .map { |item| normalize_event(item) }
        .select { |item| item["start_at"] && Time.parse(item["start_at"]).utc > now }
        .min_by { |item| item["start_at"] }

      unless next_event
        Jekyll.logger.warn "LumaEvents:", "No upcoming events found in Luma response. Using fallback."
        return FALLBACK
      end

      format_event(next_event)
    end

    def fetch_page(url, redirects_remaining = MAX_REDIRECTS)
      attempts = 0

      begin
        attempts += 1

        uri = URI.parse(url)
        req = Net::HTTP::Get.new(uri)
        req["User-Agent"] = "Mozilla/5.0 (compatible; Jekyll/4.0; +https://civictechwr.org)"
        req["Accept"] = "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8"
        req["Accept-Language"] = "en-CA,en;q=0.9"
        req["Cache-Control"] = "no-cache"

        res = Net::HTTP.start(uri.hostname, uri.port,
                              use_ssl: true,
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
          raise "Too many redirects fetching #{url}" if redirects_remaining <= 0

          location = res["location"]
          raise "Redirect from #{url} missing location header" if location.to_s.empty?

          return fetch_page(URI.join(url, location).to_s, redirects_remaining - 1)
        else
          raise "HTTP #{res.code} received from #{url}" unless RETRYABLE_HTTP_CODES.include?(res.code)

          raise "Retryable HTTP #{res.code} received from #{url}"
        end
      rescue => e
        raise if attempts >= FETCH_RETRY_LIMIT

        Jekyll.logger.warn "LumaEvents:",
          "Fetch attempt #{attempts} failed: #{e.message}. Retrying."
        sleep attempts
        retry
      end
    end

    def extract_events(html)
      events = extract_events_from_page_data(html)
      return events unless events.empty?

      events = extract_featured_items_blob(html)
      return events unless events.empty?

      raise "Could not find event data in Luma page"
    end

    def extract_events_from_page_data(html)
      data = extract_page_data(html)
      return [] unless data

      find_event_candidates(data)
    rescue JSON::ParserError => e
      Jekyll.logger.warn "LumaEvents:",
        "Primary JSON extraction failed: #{e.message}. Trying fallback extractor."
      []
    end

    def extract_page_data(html)
      json_payload = extract_next_data_json(html) || extract_embedded_json(html)
      return nil unless json_payload

      JSON.parse(json_payload)
    end

    def extract_next_data_json(html)
      html[/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/m, 1]
    end

    def extract_embedded_json(html)
      html.scan(/<script[^>]*type=["']application\/json["'][^>]*>(.*?)<\/script>/m)
        .flatten
        .find { |payload| payload.include?("featured_items") && payload.include?("start_at") }
    end

    def extract_featured_items_blob(html)
      key_index = html.index('"featured_items"')
      return [] unless key_index

      array_start = html.index("[", key_index)
      return [] unless array_start

      array_json = extract_json_array(html, array_start)
      return [] unless array_json

      JSON.parse(CGI.unescapeHTML(array_json))
    rescue JSON::ParserError
      []
    end

    def extract_json_array(text, start_index)
      depth = 0
      in_string = false
      escaped = false

      text.chars.each_with_index.drop(start_index).each do |char, index|
        if in_string
          if escaped
            escaped = false
          elsif char == "\\"
            escaped = true
          elsif char == '"'
            in_string = false
          end

          next
        end

        case char
        when '"'
          in_string = true
        when "["
          depth += 1
        when "]"
          depth -= 1
          return text[start_index..index] if depth.zero?
        end
      end

      nil
    end

    def find_event_candidates(node, matches = [])
      case node
      when Array
        if node.all? { |item| event_candidate?(item) }
          matches.concat(node)
        else
          node.each { |item| find_event_candidates(item, matches) }
        end
      when Hash
        node.each_value { |value| find_event_candidates(value, matches) }
      end

      deduplicate_events(matches)
    end

    def event_candidate?(item)
      item.is_a?(Hash) && item["event"].is_a?(Hash) && (item["start_at"] || item.dig("event", "start_at"))
    end

    def deduplicate_events(items)
      items.uniq do |item|
        item["api_id"] || item.dig("event", "api_id") || item.dig("event", "url") || item["start_at"]
      end
    end

    def normalize_event(item)
      return item if item["start_at"]

      item.merge("start_at" => item.dig("event", "start_at"))
    end

    def format_event(item)
      event     = item["event"]
      start_utc = Time.parse(item["start_at"]).utc
      local     = to_eastern(start_utc)
      geo       = event["geo_address_info"] || {}

      # Format time without leading zero, cross-platform
      hour   = local.hour % 12
      hour   = 12 if hour.zero?
      ampm   = local.hour < 12 ? "AM" : "PM"
      minute = format("%02d", local.min)

      result = {
        "date_formatted" => "#{local.strftime('%A, %B')} #{local.day}",
        "time_formatted" => "#{hour}:#{minute} #{ampm}",
        "datetime_iso"   => local.iso8601,
        "location_short" => geo["short_address"] || geo["city_state"] || "Downtown Kitchener",
        "location_full"  => geo["full_address"] || "",
        "event_url"      => "https://lu.ma/#{event['url']}",
        "found"          => true
      }

      Jekyll.logger.info "LumaEvents:",
        "Next event: #{result['date_formatted']} at #{result['time_formatted']} — #{result['location_short']}"
      result
    end

    # Convert a UTC Time to Eastern Time (America/Toronto) using TZInfo if available,
    # otherwise fall back to a manual DST calculation.
    # Returns a Time object whose iso8601 output includes the correct UTC offset
    # (e.g. "2026-03-11T17:30:00-04:00") so the <time datetime> attribute is accurate.
    def to_eastern(utc_time)
      require "tzinfo"
      TZInfo::Timezone.get("America/Toronto").to_local(utc_time)
    rescue LoadError
      # Build a Time with the correct fixed offset rather than shifting UTC seconds,
      # so that iso8601 emits "-05:00" or "-04:00" rather than "Z".
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
      mar1         = Time.utc(year, 3, 1)
      first_sun    = 1 + (7 - mar1.wday) % 7
      dst_start    = Time.utc(year, 3, first_sun + 7, 7)

      # First Sunday of November at 2:00 AM EDT (= 6:00 AM UTC)
      nov1         = Time.utc(year, 11, 1)
      dst_end_day  = 1 + (7 - nov1.wday) % 7
      dst_end      = Time.utc(year, 11, dst_end_day, 6)

      (utc_time >= dst_start && utc_time < dst_end) ? -4 : -5
    end
  end
end
