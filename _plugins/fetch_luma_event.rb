# frozen_string_literal: true

# _plugins/fetch_luma_event.rb
#
# Fetches the next upcoming CivicTech WR hacknight from the Luma calendar page
# at Jekyll build time, then stores the result in site.data['next_meeting'].
#
# Used by _includes/meeting-section.html to show live event details.
# If the fetch fails for any reason, static fallback values are used instead.

require 'net/http'
require 'json'
require 'uri'
require 'time'

module CivicTechWR
  class LumaEventGenerator < Jekyll::Generator
    safe true
    priority :low

    LUMA_CALENDAR_URL = 'https://luma.com/civictechwr'.freeze

    FALLBACK = {
      'date_formatted' => 'Wednesdays',
      'time_formatted' => '6:00 PM',
      'datetime_iso'   => nil,
      'location_short' => 'Downtown Kitchener',
      'location_full'  => '',
      'event_url'      => 'https://luma.com/civictechwr',
      'found'          => false
    }.freeze

    def generate(site)
      site.data['next_meeting'] = fetch_next_event
    rescue => e
      Jekyll.logger.warn 'LumaEvents:', "Failed to fetch event data: #{e.message}. Using fallback."
      site.data['next_meeting'] = FALLBACK
    end

    private

    def fetch_next_event
      html   = fetch_page(LUMA_CALENDAR_URL)
      events = extract_events(html)
      now    = Time.now.utc

      next_event = events
        .select { |item| item['start_at'] && Time.parse(item['start_at']).utc > now }
        .min_by { |item| item['start_at'] }

      unless next_event
        Jekyll.logger.warn 'LumaEvents:', 'No upcoming events found in Luma response. Using fallback.'
        return FALLBACK
      end

      format_event(next_event)
    end

    def fetch_page(url)
      uri = URI.parse(url)
      req = Net::HTTP::Get.new(uri)
      req['User-Agent'] = 'Mozilla/5.0 (compatible; Jekyll/4.0; +https://civictechwr.org)'
      req['Accept']     = 'text/html,application/xhtml+xml'

      res = Net::HTTP.start(uri.hostname, uri.port,
                            use_ssl: true,
                            open_timeout: 15,
                            read_timeout: 15) do |http|
        http.request(req)
      end

      raise "HTTP #{res.code} received from #{url}" unless res.is_a?(Net::HTTPSuccess)

      res.body
    end

    def extract_events(html)
      match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/m)
      raise 'Could not find __NEXT_DATA__ JSON in Luma page' unless match

      data = JSON.parse(match[1])
      data.dig('props', 'pageProps', 'initialData', 'data', 'featured_items') || []
    end

    def format_event(item)
      event     = item['event']
      start_utc = Time.parse(item['start_at']).utc
      local     = to_eastern(start_utc)
      geo       = event['geo_address_info'] || {}

      # Format time without leading zero, cross-platform
      hour   = local.hour % 12
      hour   = 12 if hour.zero?
      ampm   = local.hour < 12 ? 'AM' : 'PM'
      minute = format('%02d', local.min)

      result = {
        'date_formatted' => "#{local.strftime('%A, %B')} #{local.day}",
        'time_formatted' => "#{hour}:#{minute} #{ampm}",
        'datetime_iso'   => local.iso8601,
        'location_short' => geo['short_address'] || geo['city_state'] || 'Downtown Kitchener',
        'location_full'  => geo['full_address'] || '',
        'event_url'      => "https://lu.ma/#{event['url']}",
        'found'          => true
      }

      Jekyll.logger.info 'LumaEvents:',
        "Next event: #{result['date_formatted']} at #{result['time_formatted']} — #{result['location_short']}"
      result
    end

    # Convert a UTC Time to Eastern Time (America/Toronto) using TZInfo if available,
    # otherwise fall back to a manual DST calculation.
    # Returns a Time object whose iso8601 output includes the correct UTC offset
    # (e.g. "2026-03-11T17:30:00-04:00") so the <time datetime> attribute is accurate.
    def to_eastern(utc_time)
      require 'tzinfo'
      TZInfo::Timezone.get('America/Toronto').to_local(utc_time)
    rescue LoadError
      # Build a Time with the correct fixed offset rather than shifting UTC seconds,
      # so that iso8601 emits "-05:00" or "-04:00" rather than "Z".
      offset_hours = dst_offset(utc_time)
      offset_str   = format('%+03d:00', offset_hours)
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
