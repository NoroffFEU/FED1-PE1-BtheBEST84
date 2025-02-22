document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  // Toggle menu on click
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !menuToggle.contains(event.target) &&
      !mobileMenu.contains(event.target)
    ) {
      menuToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Check if there is user data in localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Get the login/logout and register/profile links for both desktop and mobile menus
  const loginLogoutLinks = document.querySelectorAll(".login-logout");
  const registerProfileLinks = document.querySelectorAll(".register-profile");

  if (userData) {
    // Extract username
    const username = userData.name;

    // Update all login/logout links to "Log Out"
    loginLogoutLinks.forEach((link) => {
      link.textContent = "Log Out";
      link.href = "#"; // Don't navigate away
      link.addEventListener("click", () => {
        // Clear userData from localStorage
        localStorage.removeItem("userData");
        localStorage.removeItem("accessToken");

        // Redirect to home screen
        window.location.href = "/index.html";
      });
    });

    // Update all register/profile links to show username with an icon
    registerProfileLinks.forEach((link) => {
      link.innerHTML = `<span class="material-icons">account_circle</span> ${username}`;
      link.href = "/account/profile.html"; // Link to profile page
    });
  } else {
    // If no user data, set login/logout to "Log In" and link to login page
    loginLogoutLinks.forEach((link) => {
      link.textContent = "Log In";
      link.href = "/account/login.html";
    });

    // Set register/profile to "Sign Up" and link to register page
    registerProfileLinks.forEach((link) => {
      link.textContent = "Sign Up";
      link.href = "/account/register.html";
    });
  }
});
