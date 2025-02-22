document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = localStorage.getItem("accessToken");

  // Redirect to login page if no access token
  if (!accessToken) {
    window.location.href = "/login.html";
    return;
  }

  document
    .getElementById("edit-post-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form values
      const newPostData = {
        title: document.getElementById("title").value,
        body: document.getElementById("body").innerHTML.trim(), // Save full HTML from editable div
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
          `https://v2.api.noroff.dev/blog/posts/BtheBEST`,
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
            errorData.message || "Failed to create the post.";
          return;
        }

        alert("Post created successfully!");
        window.location.href = "/account/profile.html";
      } catch (error) {
        console.error("Error creating post:", error);
        document.getElementById("error-message").textContent =
          "An error occurred while creating the post.";
      }
    });
});
