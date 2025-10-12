$(document).ready(function () {
  // Sample data for upcoming hacknight (since Meetup API might be restricted)
  const upcomingEvents = [
    {
      name: "CTWR Weekly Hacknight",
      local_date: "2025-06-04",
      local_time: "18:00",
      venue: { name: "Downtown Kitchener" },
      link: "https://www.meetup.com/civictechwr/events/",
    },
    {
      name: "CivicTech Waterloo Region Speaker Night",
      local_date: "2025-06-12",
      local_time: "18:00",
      venue: { name: "Virtual Meeting" },
      link: "https://www.meetup.com/civictechwr/events/",
    },
  ];

  function parseDateTime(dateString, timeString) {
    var year, month, day, hours, minutes;
    [year, month, day] = dateString.split("-");
    [hours, minutes] = timeString.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  }

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

  // Try fetching from Meetup API first
  try {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://api.meetup.com/civictechwr/events?photo-host=public&page=1&status=upcoming"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          displayEvent(data[0]);
        } else {
          // If no events from API, use the first sample event
          displayEvent(upcomingEvents[0]);
        }
      })
      .catch((error) => {
        console.warn("Falling back to sample data:", error);
        // Use sample data as fallback
        displayEvent(upcomingEvents[0]);
      });
  } catch (error) {
    console.warn("Error in fetch operation, using sample data:", error);
    // Use sample data if fetch fails completely
    displayEvent(upcomingEvents[0]);
  }
});
