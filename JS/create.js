document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userName = userData?.name || "BtheBEST"; // Use logged-in user or default to BtheBEST
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    window.location.href = "/login.html"; // Redirect if not logged in
    return;
  }

  // Get modal elements
  const successModal = document.getElementById("success-modal");
  const successMessage = document.getElementById("success-message");
  const closeModal = document.getElementById("close-modal");

  document
    .getElementById("edit-post-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form values and format body text
      const newPostData = {
        title: document.getElementById("title").value,
        body: formatBodyText(document.getElementById("body").innerText),
        tags: document
          .getElementById("tags")
          .value.split(",")
          .map((tag) => tag.trim()),
        media: {
          url: document.getElementById("image-url").value,
          alt: document.getElementById("image-alt").value,
        },
      };

      try {
        // Send POST request to create the new post
        const response = await fetch(
          `https://v2.api.noroff.dev/blog/posts/${userName}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(newPostData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          document.getElementById("error-message").textContent =
            errorData.message || "Error creating the post";
          return;
        }

        // Show modal only when post creation is successful
        successMessage.textContent = "Post created successfully!";
        successModal.style.display = "flex";
      } catch (error) {
        document.getElementById("error-message").textContent =
          "An error occurred while creating the post.";
      }
    });

  // Close modal when clicking the close button
  closeModal.addEventListener("click", () => {
    successModal.style.display = "none";
    window.location.href = "/account/profile.html"; // Redirect to profile after closing modal
  });

  // Close modal if user clicks outside of it
  window.addEventListener("click", (event) => {
    if (event.target === successModal) {
      successModal.style.display = "none";
      window.location.href = "/account/profile.html";
    }
  });
});

// Function to format body text so that each line break creates a new paragraph <p>
function formatBodyText(text) {
  return text
    .split(/\n+/) // Split at each new line
    .map((line) => `<p>${line.trim()}</p>`) // Wrap each line in <p>
    .join(""); // Join them together without extra spaces
}
