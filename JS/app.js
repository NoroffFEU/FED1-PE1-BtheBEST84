// Get form and elements
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

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

      // Store accessToken in localStorage
      const accessToken = data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);

      console.log("Logged in successfully:", data);
      alert("Login successful!");

      // Redirect to /post/index.html
      window.location.href = "/post/index.html"; // Redirects to the specified page
    }
  } catch (error) {
    errorMessage.textContent = "An error occurred. Please try again later.";
    console.error("Error during login:", error);
  }
});
