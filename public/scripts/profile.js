document.addEventListener("DOMContentLoaded", async function () {
  const userIdDisplay = document.querySelector(".profile-user-id");
  const usernameDisplay = document.querySelector(".profile-username");
  const emailDisplay = document.querySelector(".profile-email");
  const phoneDisplay = document.querySelector(".profile-phone");
  const countryDisplay = document.querySelector(".profile-country");
  const logoutButton = document.querySelector(".logout-button");

  try {
      const response = await fetch("http://localhost:8080/api/v1/users/validate", {
          method: "GET",
          credentials: "include", // ✅ Send cookies
      });

      if (!response.ok) {
          throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      userIdDisplay.textContent = data.user_id || "Unknown";
      usernameDisplay.textContent = data.username || "Unknown";
      emailDisplay.textContent = data.email || "Unknown";
      phoneDisplay.textContent = data.phone_number || "Unknown";
      countryDisplay.textContent = data.country || "Unknown";
  } catch (error) {
      console.error("Profile error:", error);

      // Show "Unknown" instead of redirecting
      userIdDisplay.textContent = "Unknown";
      usernameDisplay.textContent = "Unknown";
      emailDisplay.textContent = "Unknown";
      phoneDisplay.textContent = "Unknown";
      countryDisplay.textContent = "Unknown";
  }

  logoutButton.addEventListener("click", function () {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "index.html";
  });
});
