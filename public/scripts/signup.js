function validateSignupField(field, value, passwordValue = "") {
  if (field === "username" && value.length < 3) {
    return "Username must be at least 3 characters.";
  }
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address.";
  }
  if (field === "password" && value.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if (field === "passwordAgain" && value !== passwordValue) {
    return "Passwords do not match.";
  }
  return "";
}

function handleValidation(event) {
  const field = event.target.name;
  const value = event.target.value;
  const passwordValue = document.querySelector(".password-input").value;

  let errorClass = field === "passwordAgain" ? "password-again-error" : `${field}-error`;
  const errorElement = document.querySelector(`.${errorClass}`);

  if (errorElement) {
    errorElement.textContent = validateSignupField(field, value, passwordValue);
  }
}

async function handleSignup() {
  const username = document.querySelector(".username-input").value.trim();
  const email = document.querySelector(".email-input").value.trim();
  const password = document.querySelector(".password-input").value.trim();
  const passwordAgain = document.querySelector(".password-again-input").value.trim();

  const errors = {
    username: validateSignupField("username", username),
    email: validateSignupField("email", email),
    password: validateSignupField("password", password),
    passwordAgain: validateSignupField("passwordAgain", passwordAgain, password),
  };

  Object.keys(errors).forEach(field => {
    let errorClass = field === "passwordAgain" ? "password-again-error" : `${field}-error`;
    const errorElement = document.querySelector(`.${errorClass}`);
    if (errorElement) {
      errorElement.textContent = errors[field];
    }
  });

  if (Object.values(errors).some(msg => msg)) return; // Stop if there are errors

  try {
    const response = await fetch("http://localhost:8080/api/v1/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "username": username,
        "password": password,
        "email": email
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed. Please try again.");
    }

    alert("Signup successful! Redirecting to login...");
    window.location.href = "index.html"; // Redirect to login page
  } catch (error) {
    alert(error.message);
  }
}

document.querySelectorAll(".signup-form input").forEach(input => {
  input.addEventListener("blur", handleValidation);
  input.addEventListener("input", handleValidation);
});

document.querySelector(".signup-button").addEventListener("click", handleSignup);

document.querySelectorAll('.signup-form input').forEach((input, index, inputs) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const nextInput = inputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      } else {
        document.querySelector('.signup-button').focus();
      }
    }
  });
});
