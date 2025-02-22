document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    window.location.href = "/login.html";
    return;
  }

  if (!postId) {
    alert("Post ID is missing in the URL.");
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/BtheBEST/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    const postData = await response.json();
    const post = postData.data;

    if (!post) {
      alert("Post not found.");
      return;
    }

    document.getElementById("title").value = post.title || "";

    // Convert plain text into proper <p> wrapped paragraphs
    const bodyContent = post.body || "";
    document.getElementById("body").innerHTML = formatBodyText(bodyContent);

    document.getElementById("tags").value = post.tags
      ? post.tags.join(", ")
      : "";
    document.getElementById("image-url").value = post.media?.url || "";
    document.getElementById("image-alt").value = post.media?.alt || "";

    // Handle "Delete Post" button click
    document
      .getElementById("delete-post-button")
      .addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Are you sure you want to delete this post?"
        );
        if (!confirmDelete) return;

        try {
          const deleteResponse = await fetch(
            `https://v2.api.noroff.dev/blog/posts/BtheBEST/${postId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!deleteResponse.ok) {
            throw new Error("Failed to delete the post");
          }

          alert("Post deleted successfully!");
          window.location.href = "/account/profile.html"; // Redirect to the profile page
        } catch (error) {
          console.error("Error deleting post:", error);
          alert("An error occurred while deleting the post.");
        }
      });
  } catch (error) {
    console.error("Error fetching post:", error);
    alert("An error occurred while fetching the post data.");
  }

  // Ensure Enter creates new <p> elements
  document.getElementById("body").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      const p = document.createElement("p");
      p.innerHTML = "<br>"; // Empty paragraph for new text input

      range.insertNode(p);
      range.setStartAfter(p);
      range.setEndAfter(p);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  // Update post form submission (PUT request)
  document
    .getElementById("edit-post-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const updatedPostData = {
        title: document.getElementById("title").value,
        body: document.getElementById("body").innerHTML.trim(), // Save full HTML
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
        const response = await fetch(
          `https://v2.api.noroff.dev/blog/posts/BtheBEST/${postId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updatedPostData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Failed to update the post.");
          return;
        }

        alert("Post updated successfully!");
        window.location.href = "/account/profile.html";
      } catch (error) {
        console.error("Error updating post:", error);
        alert("An error occurred while updating the post.");
      }
    });
});

// Function to wrap plain text in <p> elements
function formatBodyText(text) {
  // If already contains <p>, assume it's formatted correctly
  if (text.includes("<p>")) return text;

  // Otherwise, split text by double line breaks and wrap each in <p>
  return text
    .split(/\n\s*\n/) // Splits at empty lines
    .map((para) => `<p>${para.trim()}</p>`) // Wrap each section in <p>
    .join(""); // Join without extra spaces
}
