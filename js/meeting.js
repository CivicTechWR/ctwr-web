$(document).ready(function() {
  function parseDateTime(dateString, timeString) {
    var year, month, day, hours, minutes;
    [year, month, day] = dateString.split("-");
    [hours, minutes] = timeString.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  }

  var meetupNextEvent = "https://api.meetup.com/civictechwr/events?photo-host=public&page=1&status=upcoming";

  $.ajax({
    url: meetupNextEvent,
    dataType: 'jsonp', // Use JSONP for cross-origin requests
    type: 'GET',
    success: function(res) {
      if (res.data.length > 0) {
        var nextEvent = res.data[0];
        var date = parseDateTime(nextEvent.local_date, nextEvent.local_time);
        var dateString = date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric' });
        var venue = nextEvent.venue ? nextEvent.venue.name : "Venue TBD";
        


        var eventImageUrl = "images/hacknight6.png"; // Default image
    if (nextEvent.images && nextEvent.images.length > 0) {
      var image = nextEvent.images[0];
      if (image.baseUrl && image.id) {
        eventImageUrl = `${image.baseUrl}${image.id}.jpg`; // Construct URL with image ID
      }
    }


        // Debugging: Log the images data to verify its structure
  
// console.log('Event images:', nextEvent.image);


        $('#meeting-name').text(nextEvent.name);
        $('#meeting-date-time').text(dateString);
        $('#meeting-location').text(venue);
        $('#more-details').attr("href", nextEvent.link);
        $('#event-image').attr("src", eventImageUrl); // Set the image source
      } else {
        $('#meeting-name').text("No upcoming events.");
        $('#meeting-date-time').text("");
        $('#meeting-location').text("");
        $('#more-details').hide();
        $('#event-image').attr("src", "images/default-image.png"); // Default image
      }
    },
    error: function(err) {
      console.error('Error fetching data:', err);
      $('#meeting-name').text("Error loading event.");
      $('#meeting-date-time').text("");
      $('#meeting-location').text("");
      $('#more-details').hide();
      $('#event-image').attr("src", "assets/images/default-image.jpg"); // Default image
    }
  });
});