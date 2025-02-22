// Get form and elements
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

// Get modal elements
const loginModal = document.getElementById("login-modal");
const closeModalButton = document.getElementById("close-modal");

// Add submit event listener to the form
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get values from inputs
  const email = emailInput.value;
  const password = passwordInput.value;

  // Validate inputs
  if (!email || !password) {
    errorMessage.textContent = "Please enter both email and password.";
    return;
  }

  // Prepare the request body
  const requestBody = {
    email: email,
    password: password,
  };

  // Send POST request
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      errorMessage.textContent =
        errorData.message || "Login failed. Please try again.";
    } else {
      // Successful login
      const data = await response.json();

      // Store the accessToken separately
      const accessToken = data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);

      // Store the user profile data (without accessToken)
      const userData = {
        name: data.data.name,
        email: data.data.email,
        avatar: data.data.avatar,
        banner: data.data.banner,
      };

      // Store user profile data in localStorage
      localStorage.setItem("userData", JSON.stringify(userData));

      // Show login success modal
      loginModal.style.display = "flex";

      // Redirect to profile after clicking "OK"
      closeModalButton.addEventListener("click", () => {
        loginModal.style.display = "none";
        window.location.href = "/account/profile.html"; // Redirect to profile page
      });
    }
  } catch (error) {
    errorMessage.textContent = "An error occurred. Please try again later.";
    console.error("Error during login:", error);
  }
});
