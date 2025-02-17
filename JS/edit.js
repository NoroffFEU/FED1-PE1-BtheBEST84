document.addEventListener("DOMContentLoaded", async () => {
  // Get the post ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id"); // Fetch the post ID from the URL query params
  const accessToken = localStorage.getItem("accessToken");

  // Redirect to login if no access token is found
  if (!accessToken) {
    window.location.href = "/login.html"; // Redirect to login page if no access token
    return;
  }

  // Check if the post ID is valid
  if (!postId) {
    alert("Post ID is missing in the URL.");
    return;
  }

  // Fetch the post data using the post ID
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/BtheBEST/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass the access token for authentication
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    const postData = await response.json();
    const post = postData.data;

    // Ensure post data exists
    if (!post) {
      alert("Post not found.");
      return;
    }

    // Populate the form with the current post data
    document.getElementById("title").value = post.title || "";
    document.getElementById("body").value = post.body || "";
    document.getElementById("tags").value = post.tags
      ? post.tags.join(", ")
      : "";
    document.getElementById("image-url").value = post.media?.url || "";
    document.getElementById("image-alt").value = post.media?.alt || "";
  } catch (error) {
    console.error("Error fetching post:", error);
    alert("An error occurred while fetching the post data.");
  }

  // Handle form submission for updating the post
  const form = document.getElementById("edit-post-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Gather form data
    const updatedPostData = {
      title: document.getElementById("title").value,
      body: document.getElementById("body").value,
      tags: document
        .getElementById("tags")
        .value.split(",")
        .map((tag) => tag.trim()), // Split and trim tags
      media: {
        url: document.getElementById("image-url").value,
        alt: document.getElementById("image-alt").value,
      },
    };

    // Send PUT request to update the post
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/BtheBEST/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Authorization header with access token
          },
          body: JSON.stringify(updatedPostData), // Send updated post data
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update the post.");
        return;
      }

      // Post updated successfully, redirect to the profile page or other page
      alert("Post updated successfully!");
      window.location.href = "/account/profile.html"; // Redirect back to the profile page
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post.");
    }
  });
});
