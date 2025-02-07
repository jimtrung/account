document.addEventListener("DOMContentLoaded", async function () {
    const userIdDisplay = document.querySelector(".profile-user-id");
    const usernameDisplay = document.querySelector(".profile-username");
    const emailDisplay = document.querySelector(".profile-email");
    const phoneDisplay = document.querySelector(".profile-phone");
    const countryDisplay = document.querySelector(".profile-country");
    const logoutButton = document.querySelector(".logout-button");

    try {
        const response = await fetch("http://127.0.0.1:8080/api/v1/users/validate", {
            method: "GET",
            credentials: "include",  // ✅ Ensure cookies are sent
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch profile (Status: ${response.status})`);
        }

        const data = await response.json();

        userIdDisplay.textContent = data.user_id || "Unknown";
        usernameDisplay.textContent = data.username || "Unknown";
        emailDisplay.textContent = data.email || "Unknown";
        phoneDisplay.textContent = data.phone_number || "Unknown";
        countryDisplay.textContent = data.country || "Unknown";
    } catch (error) {
        console.error("Profile error:", error);
    }

    logoutButton.addEventListener("click", function () {
        document.cookie = "Authorization=; Max-Age=0"; // Clear cookie
        window.location.href = "index.html";
    });
});
