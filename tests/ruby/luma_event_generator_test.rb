# frozen_string_literal: true

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

# --- extract_embedded_json path ---
# Fixture has no __NEXT_DATA__ script; events are in a <script type="application/json"> tag.
embedded_generator = CivicTechWR::LumaEventGenerator.new
embedded_events = embedded_generator.send(:extract_events, fixture_html("embedded_json_calendar.html"))
assert_equal 2, embedded_events.length,
  "Should extract both events from embedded <script type='application/json'>"
assert_equal "m9qpiym3", embedded_events.first.dig("event", "url"),
  "Embedded JSON extractor should preserve the first event URL"

# --- normalize_event: item with no top-level start_at, only event.start_at ---
norm_generator = CivicTechWR::LumaEventGenerator.new
item_without_top_level_start = {
  "event" => { "api_id" => "evt-x", "start_at" => "2099-06-01T18:00:00.000Z", "url" => "abc" }
}
normalized = norm_generator.send(:normalize_event, item_without_top_level_start)
assert_equal "2099-06-01T18:00:00.000Z", normalized["start_at"],
  "normalize_event should lift event.start_at when top-level start_at is absent"

# --- extract_events raises when page contains no event data ---
no_data_generator = CivicTechWR::LumaEventGenerator.new
no_data_raised = false
begin
  no_data_generator.send(:extract_events, "<html><body>no event data here</body></html>")
rescue RuntimeError => e
  no_data_raised = e.message.include?("Could not find event data")
end
assert_equal true, no_data_raised,
  "extract_events should raise when no event data is found in the page"

# --- fetch_next_event returns FALLBACK when all events are in the past ---
past_generator = CivicTechWR::LumaEventGenerator.new
past_generator.define_singleton_method(:fetch_page) do |_url, _redirects_remaining = CivicTechWR::LumaEventGenerator::MAX_REDIRECTS|
  fixture_html("past_events_calendar.html")
end
past_result = past_generator.send(:fetch_next_event)
assert_equal false, past_result["found"],
  "fetch_next_event should return FALLBACK when all events are in the past"

puts "Luma event generator regression tests passed."
