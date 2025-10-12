/**
 * Meeting Event Management
 * Handles display of upcoming CivicTechWR events with fallback to sample data
 * @author CivicTechWR
 * @version 1.0.0
 */

$(document).ready(function () {
  /**
   * Sample data for upcoming hacknight events
   * Used as fallback when Meetup API is unavailable
   * @type {Array<Object>}
   */
  const upcomingEvents = [
    {
      name: "CTWR Weekly Hacknight",
      local_date: "2025-10-16",
      local_time: "18:00",
      venue: { name: "Downtown Kitchener" },
      link: "https://www.meetup.com/civictechwr/events/",
    },
    {
      name: "CivicTech Waterloo Region Speaker Night",
      local_date: "2025-10-23",
      local_time: "18:00",
      venue: { name: "Virtual Meeting" },
      link: "https://www.meetup.com/civictechwr/events/",
    },
  ];

  /**
   * Parses date and time strings into a JavaScript Date object
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @param {string} timeString - Time in HH:MM format
   * @returns {Date} Parsed date object
   */
  function parseDateTime(dateString, timeString) {
    var year, month, day, hours, minutes;
    [year, month, day] = dateString.split("-");
    [hours, minutes] = timeString.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  }

  /**
   * Displays event information in the meeting section
   * @param {Object} event - Event object with name, date, time, venue, and link
   */
  function displayEvent(event) {
    var date = parseDateTime(event.local_date, event.local_time);
    var dateString = date.toLocaleString("en-US", {
      weekday: "long",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
    var venue = event.venue ? event.venue.name : "Venue TBD";

    $("#meeting-name").text(event.name);
    $("#meeting-date-time").text(dateString);
    $("#meeting-location").text(venue);
    $("#meeting-btn").attr("href", event.link);
  }

  // Use sample data directly (Meetup API requires authentication)
  // This ensures the site works reliably without external dependencies
  displayEvent(upcomingEvents[0]);
});
