document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const accessToken = localStorage.getItem("accessToken");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userName = userData?.name || "BtheBEST"; // Use logged-in user or default to BtheBEST

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
      `https://v2.api.noroff.dev/blog/posts/${userName}/${postId}`,
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
    document.getElementById("body").innerHTML = formatBodyText(post.body || ""); // Ensure correct paragraph formatting
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
            `https://v2.api.noroff.dev/blog/posts/${userName}/${postId}`,
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

    // Ensure Enter creates new <p> elements in the editable div
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
          body: formatBodyText(document.getElementById("body").innerText), // Converts text with line breaks into paragraphs
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
            `https://v2.api.noroff.dev/blog/posts/${userName}/${postId}`,
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
  } catch (error) {
    console.error("Error fetching post:", error);
    alert("An error occurred while fetching the post data.");
  }
});

// Function to ensure every line break creates a new paragraph <p>
function formatBodyText(text) {
  return text
    .split(/\n+/) // Split at every new line
    .map((line) => `<p>${line.trim()}</p>`) // Wrap each line in a <p> tag
    .join(""); // Join them together without extra spaces
}
