document.addEventListener("DOMContentLoaded", function () {
  const usernameInput = document.querySelector(".username-input");
  const passwordInput = document.querySelector(".password-input");
  const loginButton = document.querySelector(".login-button");

  function validateField(field, value) {
      if (field === "username" && value.trim().length < 3) {
          return "Username must be at least 3 characters.";
      }
      if (field === "password" && value.trim().length < 6) {
          return "Password must be at least 6 characters.";
      }
      return "";
  }

  function handleValidation(event) {
      const field = event.target.name;
      const value = event.target.value;
      const errorElement = document.querySelector(`.${field}-error`);

      if (errorElement) {
          errorElement.textContent = validateField(field, value);
      }
  }

  function manualLogin() {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      const usernameError = validateField("username", username);
      const passwordError = validateField("password", password);
      const loginError = document.querySelector(".login-error");

      document.querySelector(".username-error").textContent = usernameError;
      document.querySelector(".password-error").textContent = passwordError;

      if (usernameError || passwordError) return;

      console.log("Logging in with:", username, password);

      // Simulate backend authentication (replace with real API call)
      if (username === "admin" && password === "password123") {
          alert("Login successful!");
          window.location.href = "dashboard.html"; // Redirect
      } else {
          loginError.textContent = "Invalid username or password.";
      }
  }

  usernameInput.addEventListener("input", handleValidation);
  passwordInput.addEventListener("input", handleValidation);
  loginButton.addEventListener("click", manualLogin);
});
