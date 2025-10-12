//jquery-click-scroll
//by syamsul'isul' Arifin

var sectionArray = [1, 3, 4]; // Only sections that actually exist on the page

// Check if we're on a page that has the required sections
var hasRequiredSections = sectionArray.some(function(value) {
  return $("#" + "section_" + value).length > 0;
});

// Only run if we have the required sections
if (hasRequiredSections) {
  $.each(sectionArray, function (index, value) {
    $(document).scroll(function () {
      var $section = $("#" + "section_" + value);
      if ($section.length === 0) {
        return; // Skip if section doesn't exist
      }
    
    var offsetSection = $section.offset().top - 90;
    var docScroll = $(document).scrollTop();
    var docScroll1 = docScroll + 1;

    if (docScroll1 >= offsetSection) {
      $(".navbar-nav .nav-item .nav-link").removeClass("active");
      $(".navbar-nav .nav-item .nav-link:link").addClass("inactive");
      $(".navbar-nav .nav-item .nav-link").eq(index).addClass("active");
      $(".navbar-nav .nav-item .nav-link").eq(index).removeClass("inactive");
    }
  });

  $(".click-scroll")
    .eq(index)
    .click(function (e) {
      var $section = $("#" + "section_" + value);
      if ($section.length === 0) {
        return; // Skip if section doesn't exist
      }
      
      var offsetClick = $section.offset().top - 90;
      e.preventDefault();
      $("html, body").animate(
        {
          scrollTop: offsetClick,
        },
        300
      );
    });
  });
}

$(document).ready(function () {
  $(".navbar-nav .nav-item .nav-link:link").addClass("inactive");
  $(".navbar-nav .nav-item .nav-link").eq(0).addClass("active");
  $(".navbar-nav .nav-item .nav-link:link").eq(0).removeClass("inactive");
});
