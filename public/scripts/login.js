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

    async function manualLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const usernameError = validateField("username", username);
        const passwordError = validateField("password", password);
        const loginError = document.querySelector(".login-error");

        document.querySelector(".username-error").textContent = usernameError;
        document.querySelector(".password-error").textContent = passwordError;

        if (usernameError || passwordError) return;

        try {
            const response = await fetch("http://127.0.0.1:8080/api/v1/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token); // Save token
                localStorage.setItem("username", username); // Save username
                window.location.href = "profile.html"; // Redirect
            } else {
                loginError.textContent = data.message || "Invalid username or password.";
            }
        } catch (error) {
            console.error("Login error:", error);
            loginError.textContent = "An error occurred. Try again later.";
        }
    }

    usernameInput.addEventListener("input", handleValidation);
    passwordInput.addEventListener("input", handleValidation);
    loginButton.addEventListener("click", manualLogin);
});
