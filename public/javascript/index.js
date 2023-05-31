$(function () {
  const textNameEl = $(".task-name");
  const allCheckboxInputEl = $(".checkbox-input");
  const navBtnEl = $(".nav-btn");
  const navBoxEl = $(".nav-box");
  const mainAppEl = $(".main-app");

  // checkbox
  $(allCheckboxInputEl).each(function (index, eachInputEl) {
    $(eachInputEl).on("change", function () {
      if ($(this).is(":checked")) {
        $(textNameEl[index]).addClass("task-completed");
      } else {
        $(textNameEl[index]).removeClass("task-completed");
      }
    });
  });

  // nav
  $(navBtnEl).on("click", function () {
    if (!$(navBoxEl).hasClass("navbar-visible")) {
      // opening nav bar
      $(navBoxEl).removeClass("navbar-not-visible-transition");
      $(navBoxEl).addClass("navbar-visible");
      $(navBoxEl).addClass("backdrop-blur-lg");
      $(".nav-content").removeClass("hidden-nav-content");
      $(mainAppEl).removeClass("z-50");
      $(".nav-icon").attr("name", "close-outline");
    } else {
      // closing nav bar
      $(navBoxEl).addClass("navbar-not-visible-transition");
      $(navBoxEl).removeClass("navbar-visible");
      $(navBoxEl).removeClass("backdrop-blur-lg");
      $(".nav-content").addClass("hidden-nav-content");
      $(mainAppEl).addClass("z-50");
      $(".nav-icon").attr("name", "menu-outline");
    }
  });
});
