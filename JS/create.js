document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = localStorage.getItem("accessToken");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userName = userData?.name || "BtheBEST"; // Use logged-in user or default to BtheBEST

  // Redirect to login page access token is missing from localStorage
  if (!accessToken) {
    window.location.href = "/login.html";
    return;
  }

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

        alert("Post created successfully!");
        window.location.href = "/account/profile.html";
      } catch (error) {
        document.getElementById("error-message").textContent =
          "An error occurred while creating the post.";
      }
    });
});

// Creating a function so that a new line creates a new paragraph
function formatBodyText(text) {
  return text
    .split(/\n+/) // This splits it at each line
    .map((line) => `<p>${line.trim()}</p>`) // Trim and wrap each line in a <p>
    .join(""); // Join them together without the extra space
}
