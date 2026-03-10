require "pathname"
require "jekyll"
require_relative "../../_plugins/fetch_luma_event"

FIXTURES_DIR = Pathname(__dir__).join("..", "fixtures", "luma").expand_path.freeze

def assert_equal(expected, actual, message)
  return if expected == actual

  raise "#{message}\nExpected: #{expected.inspect}\nActual: #{actual.inspect}"
end

def fixture_html(name)
  FIXTURES_DIR.join(name).read
end

generator = CivicTechWR::LumaEventGenerator.new

events = generator.send(:extract_events, fixture_html("next_data_calendar.html"))
assert_equal 2, events.length, "Should extract both events from __NEXT_DATA__"
assert_equal "m9qpiym3", events.first.dig("event", "url"), "Should preserve the first event URL"
assert_equal "2099-03-11T21:30:00.000Z", events.first["start_at"], "Should preserve the first event start time"

generator.define_singleton_method(:fetch_page) do |_url, _redirects_remaining = CivicTechWR::LumaEventGenerator::MAX_REDIRECTS|
  fixture_html("next_data_calendar.html")
end

next_event = generator.send(:fetch_next_event)
assert_equal true, next_event["found"], "Should keep live event data when the main payload parses"
assert_equal "165 King St W, Kitchener", next_event["location_short"], "Should format the expected location"
assert_equal "https://lu.ma/m9qpiym3", next_event["event_url"], "Should format the RSVP URL from the extracted event"

fallback_events = generator.send(:extract_events, fixture_html("broken_next_data_calendar.html"))
assert_equal 2, fallback_events.length, "Should extract both events from the fallback featured_items blob"
assert_equal "m9qpiym3", fallback_events.first.dig("event", "url"), "Fallback extractor should preserve the first event URL"
assert_equal "165 King St W, Kitchener",
             fallback_events.first.dig("event", "geo_address_info", "short_address"),
             "Fallback extractor should preserve the short address"

fallback_generator = CivicTechWR::LumaEventGenerator.new
fallback_generator.define_singleton_method(:fetch_page) do |_url, _redirects_remaining = CivicTechWR::LumaEventGenerator::MAX_REDIRECTS|
  fixture_html("broken_next_data_calendar.html")
end

fallback_next_event = fallback_generator.send(:fetch_next_event)
assert_equal true, fallback_next_event["found"], "Should keep live event data when the fallback extractor is needed"
assert_equal "https://lu.ma/m9qpiym3", fallback_next_event["event_url"], "Fallback extraction should still format the RSVP URL"

puts "Luma event generator regression tests passed."