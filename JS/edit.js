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

  // Get modal elements
  const successModal = document.getElementById("success-modal");
  const successMessage = document.getElementById("success-message");
  const closeSuccessModal = document.getElementById("close-success-modal");

  const deleteModal = document.getElementById("delete-modal");
  const deleteMessage = document.getElementById("delete-message");
  const cancelDelete = document.getElementById("cancel-delete");
  const confirmDelete = document.getElementById("confirm-delete");

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
    document.getElementById("body").innerHTML = formatBodyText(post.body || "");
    document.getElementById("tags").value = post.tags
      ? post.tags.join(", ")
      : "";
    document.getElementById("image-url").value = post.media?.url || "";
    document.getElementById("image-alt").value = post.media?.alt || "";

    // Handle "Delete Post" button click
    document
      .getElementById("delete-post-button")
      .addEventListener("click", () => {
        deleteMessage.textContent =
          "Are you sure you want to delete this post?";
        deleteModal.style.display = "flex";
      });

    // Cancel delete action
    cancelDelete.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });

    // Confirm delete action
    confirmDelete.addEventListener("click", async () => {
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

        deleteModal.style.display = "none";
        successMessage.textContent = "Post deleted successfully!";
        successModal.style.display = "flex";

        // Redirect after showing modal
        setTimeout(() => {
          window.location.href = "/account/profile.html";
        }, 1500);
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

          successMessage.textContent = "Post updated successfully!";
          successModal.style.display = "flex";

          // Redirect after showing modal
          setTimeout(() => {
            window.location.href = "/account/profile.html";
          }, 1500);
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
    .split(/\n+/)
    .map((line) => `<p>${line.trim()}</p>`)
    .join("");
}

// Close modals on click
closeSuccessModal.addEventListener("click", () => {
  successModal.style.display = "none";
  window.location.href = "/account/profile.html";
});

window.addEventListener("click", (event) => {
  if (event.target === successModal) {
    successModal.style.display = "none";
    window.location.href = "/account/profile.html";
  }
  if (event.target === deleteModal) {
    deleteModal.style.display = "none";
  }
});
