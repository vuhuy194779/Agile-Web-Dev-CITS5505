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

  menuBtn.addEventListener("click", function () {
    navMenu.classList.toggle("show");
  });
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("show");
    });
  });
});

// function toggleDropdown() {
//   const dropdown = document.getElementById("dropdown");
//   dropdown.classList.toggle("hidden");
// }
// window.toggleDropdown = toggleDropdown;

// document.addEventListener("click", function (event) {
//   const userMenu = document.querySelector(".user-menu");
//   const dropdown = document.getElementById("dropdown");

//   if (!userMenu.contains(event.target)) {
//     dropdown.classList.add("hidden");
//   }
// });
