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

function handleSignup() {
  const username = document.querySelector(".username-input").value;
  const email = document.querySelector(".email-input").value;
  const password = document.querySelector(".password-input").value;
  const passwordAgain = document.querySelector(".password-again-input").value;

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

  if (Object.values(errors).some(msg => msg)) return;

  document.querySelector(".signup-form").reset();
  console.log("Signup successful:", username, email, password);
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