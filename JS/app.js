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

  // Get login/logout and register/profile links
  const loginLogoutLinks = document.querySelectorAll(".login-logout");
  const registerProfileLinks = document.querySelectorAll(".register-profile");

  // Get logout modal elements
  const logoutModal = document.getElementById("logout-modal");
  const logoutMessage = document.getElementById("logout-message");
  const confirmLogoutButton = document.getElementById("confirm");
  const cancelLogoutButton = document.getElementById("cancel");

  if (userData) {
    const username = userData.name;

    // Update login/logout links to "Log Out"
    loginLogoutLinks.forEach((link) => {
      link.textContent = "Log Out";
      link.href = "#"; // Prevent navigation

      link.addEventListener("click", () => {
        logoutMessage.textContent = "Are you sure you want to log out?";
        logoutModal.style.display = "flex";
      });
    });

    // Update register/profile links to show username with profile icon
    registerProfileLinks.forEach((link) => {
      link.innerHTML = `<span class="material-icons">account_circle</span> ${username}`;
      link.href = "/account/profile.html";
    });
  } else {
    // If no user is logged in, reset links
    loginLogoutLinks.forEach((link) => {
      link.textContent = "Log In";
      link.href = "/account/login.html";
    });

    registerProfileLinks.forEach((link) => {
      link.textContent = "Sign Up";
      link.href = "/account/register.html";
    });
  }

  // Handle logout confirmation
  confirmLogoutButton.addEventListener("click", () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");

    logoutModal.style.display = "none";

    // Show confirmation before redirecting
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1000);
  });

  // Cancel logout
  cancelLogoutButton.addEventListener("click", () => {
    logoutModal.style.display = "none";
  });

  // Close modal if clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === logoutModal) {
      logoutModal.style.display = "none";
    }
  });
});
