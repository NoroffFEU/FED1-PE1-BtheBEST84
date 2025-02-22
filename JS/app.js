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
