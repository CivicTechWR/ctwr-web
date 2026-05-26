# frozen_string_literal: true

require "pathname"
require "jekyll"
require_relative "../../_plugins/fetch_luma_event"

FIXTURES_DIR = Pathname(__dir__).join("..", "fixtures", "luma").expand_path.freeze

def assert_equal(expected, actual, message)
  return if expected == actual

  raise "#{message}\nExpected: #{expected.inspect}\nActual: #{actual.inspect}"
end

def assert_match(pattern, actual, message)
  return if actual.to_s.match?(pattern)

  raise "#{message}\nPattern: #{pattern.inspect}\nActual: #{actual.inspect}"
end

def fixture_ical(name)
  FIXTURES_DIR.join(name).read
end

generator = CivicTechWR::LumaEventGenerator.new

# --- parse_ical_events: two future events ---
events = generator.send(:parse_ical_events, fixture_ical("civictechwr.ics"))
assert_equal 2, events.length, "Should parse both events from fixture iCal"
assert_equal "CivicTechWR Hacknight", events.first[:summary], "Should preserve event summary"
assert_equal "evt-fixture-01@events.lu.ma", events.first[:uid], "Should preserve event UID"
assert_equal "165 King St W, Kitchener, ON N2G 1A7, Canada", events.first[:location],
  "Should preserve full location"

# --- parse_ical_dt: UTC datetime format ---
first_start = events.first[:start_at]
assert_equal true, first_start.is_a?(Time), "start_at should be a Time object"
assert_equal 2099, first_start.utc.year, "Should parse year correctly"
assert_equal 3, first_start.utc.month, "Should parse month correctly"
assert_equal 12, first_start.utc.day, "Should parse day correctly"
assert_equal 21, first_start.utc.hour, "Should parse hour correctly"

# --- extract_event_url: URL in description ---
url = generator.send(:extract_event_url, events.first[:description])
assert_equal "https://luma.com/m9qpiym3", url, "Should extract event URL from description"

# --- short_location ---
short = generator.send(:short_location, "165 King St W, Kitchener, ON N2G 1A7, Canada")
assert_equal "165 King St W, Kitchener", short, "Should extract short address from full location"

short_fallback = generator.send(:short_location, "")
assert_equal "Downtown Kitchener", short_fallback, "Should return fallback when location is empty"

# --- unescape_ical: backslash-escape sequences ---
unescaped = generator.send(:unescape_ical, "Kitchener\\, Ontario\\nCanada")
assert_equal "Kitchener, Ontario\nCanada", unescaped, "Should unescape iCal text escapes"

# --- fetch_next_event: stub with future events ---
stub_generator = CivicTechWR::LumaEventGenerator.new
stub_generator.define_singleton_method(:fetch_ical) do |_url|
  fixture_ical("civictechwr.ics")
end

result = stub_generator.send(:fetch_next_event)
assert_equal true, result["found"], "Should return found=true for future events"
assert_equal "165 King St W, Kitchener", result["location_short"],
  "Should format the expected short location"
assert_equal "https://luma.com/m9qpiym3", result["event_url"],
  "Should extract and format the RSVP URL from event description"
assert_match(/\A\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\z/, result["datetime_iso"],
  "datetime_iso should be an ISO8601 string with UTC offset")

# --- fetch_next_event: stub with all past events → FALLBACK ---
past_generator = CivicTechWR::LumaEventGenerator.new
past_generator.define_singleton_method(:fetch_ical) do |_url|
  fixture_ical("past_events.ics")
end

past_result = past_generator.send(:fetch_next_event)
assert_equal false, past_result["found"],
  "fetch_next_event should return FALLBACK when all events are in the past"
assert_equal "https://luma.com/civictechwr", past_result["event_url"],
  "FALLBACK event_url should be the generic calendar URL"

# --- parse_ical_events: RFC 5545 line unfolding ---
folded_ical = <<~ICAL
  BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  DTSTART:20990401T180000Z
  UID:evt-fold-test@events.lu.ma
  SUMMARY:Folded Line
   Test Event
  DESCRIPTION:Get up-to-date information at: https://luma.com/foldtest\\n\\
   nAddress:\\n123 Main St
  LOCATION:123 Main St, City
  END:VEVENT
  END:VCALENDAR
ICAL
folded_events = generator.send(:parse_ical_events, folded_ical)
assert_equal 1, folded_events.length, "Should parse folded iCal correctly"
assert_equal "Folded LineTest Event", folded_events.first[:summary],
  "Should unfold continuation lines per RFC 5545 (fold indicator whitespace is removed)"

puts "Luma event generator regression tests passed."
