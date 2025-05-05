document.addEventListener("DOMContentLoaded", function () {
  const loginBtns = document.querySelectorAll("#login-btn");
  const loginPopup = document.getElementById("loginModal");
  const closeBtn = document.querySelector(".login-modal .close");

  const signupBtn = document.getElementById("signup-btn");
  const signUpPopup = document.getElementById("signUpModal");
  const closeSignupBtn = document.querySelector(".signup-modal .close");

  const overlay = document.getElementById("modalOverlay");

  // Show login modal when login button is clicked
  loginBtns.forEach(function (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loginPopup.style.display = "block";
      overlay.style.display = "block";
    });
  });

// Close login modal when clicking the close button
closeBtn?.addEventListener("click", function () {
  loginPopup.style.display = "none";
  overlay.style.display = "none";
});

//remember me
window.addEventListener("DOMContentLoaded", function () {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const rememberMeCheckbox = document.getElementById("rememberme");

  // get saved username and password from localStorage
  const savedUsername = localStorage.getItem("rememberedUsername");
  const savedPassword = localStorage.getItem("rememberedPassword");

  if (savedUsername) {
    usernameInput.value = savedUsername;
    rememberMeCheckbox.checked = true;
  }

  if (savedPassword) {
    passwordInput.value = savedPassword;
  }

  // remember me login
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("rememberedUsername", usernameInput.value.trim());
      localStorage.setItem("rememberedPassword", passwordInput.value.trim()); // can be removed for security
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
    }
  });
});

//Signup modal

const signupForm = document.getElementById("signUpForm");

signupForm.addEventListener("submit", function (e) {
  const passwordInput = document.getElementById("newPassword");
  const password = passwordInput.value;

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    e.preventDefault(); // Stop form submission
  }
});

// Password match validation for signup form
document.getElementById("signUpForm")?.addEventListener("submit", function (e) {
  const password = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    e.preventDefault();
    alert("Passwords do not match! Please check again.");
  }
});

// Show Sign Up Modal
signupBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  signUpPopup.style.display = "block";
  overlay.style.display = "block";
});

// Close Sign Up Modal
closeSignupBtn?.addEventListener("click", function () {
  signUpPopup.style.display = "none";
  overlay.style.display = "none";
});

// Close sign up modal when clicking outside (on overlay)
overlay.addEventListener("click", function () {
  loginPopup.style.display = "none";
  signUpPopup.style.display = "none";
  overlay.style.display = "none";
});
});