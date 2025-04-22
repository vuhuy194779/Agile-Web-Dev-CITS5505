document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login-btn");
  const loginPopup = document.getElementById("sign");
  const closeBtn = document.querySelector(".sign .close");
  const overlay = document.getElementById("modalOverlay");

  // small login page
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    loginPopup.style.display = "block";
    overlay.style.display = "block";
  });

  // press overlay, close login page
  overlay.addEventListener("click", function () {
    loginPopup.style.display = "none";
    overlay.style.display = "none";
  });
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
  document.getElementById("login").addEventListener("submit", function () {
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("rememberedUsername", usernameInput.value.trim());
      localStorage.setItem("rememberedPassword", passwordInput.value.trim()); // can be removed for security
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
    }
  });
});
