// this is the user auchentication part
// $("#login").on("submit", function (e) {
//   e.preventDefault();
//   $.ajax({
//     url: "{{ url_for('login') }}", //flask url
//     method: "POST",
//     data: {
//       username: $("#username").val(),
//       password: $("#password").val(),
//     },
//     success: function (response) {
//       $(".status").text("✅ Login successful! Redirecting...");
//       window.location.href = "{{ url_for('dashboard') }}"; //success redirect to dashboard
//     },
//     error: function () {
//       $(".status").text("❌ Login failed. Please check your credentials.");
//     },
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.getElementById("nav-menu");
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("dropdown");

  // close all menus
  function closeAllMenus() {
    navMenu.classList.remove("show");
    if (dropdown) {
      dropdown.classList.add("hidden");
    }
  }

  menuBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // stop event bubbling
    navMenu.classList.toggle("show");
    if (dropdown) {
      dropdown.classList.add("hidden");
    }
  });

  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeAllMenus();
    });
  });

  // only for user menu
  if (userMenu) {
    userMenu.addEventListener("click", function (e) {
      e.stopPropagation();
      navMenu.classList.remove("show");
    });
  }

  // press other area, close all menus
  document.addEventListener("click", function (e) {
    if (!navMenu.contains(e.target) && (!userMenu || !userMenu.contains(e.target))) {
      closeAllMenus();
    }
  });

  // scroll event to close all menus
  window.addEventListener("scroll", function () {
    closeAllMenus();
  });
});

function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.classList.toggle("hidden");
}
window.toggleDropdown = toggleDropdown;

document.addEventListener("click", function (event) {
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("dropdown");

  if (!userMenu.contains(event.target)) {
    dropdown.classList.add("hidden");
  }
});
