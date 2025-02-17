document.addEventListener("DOMContentLoaded", async () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const accessToken = localStorage.getItem("accessToken");

  if (!userData || !accessToken) {
    window.location.href = "/login.html"; // Redirect if no user data or token is found
    return;
  }

  const userName = userData.name;

  document.getElementById("username").textContent = userData.name;
  document.getElementById("email").textContent = userData.email;

  const avatarImg = document.getElementById("avatar-img");
  if (userData.avatar?.url) {
    avatarImg.src = userData.avatar.url;
    avatarImg.alt = userData.avatar.alt || "User avatar";
  } else {
    avatarImg.style.display = "none";
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${userName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const postsData = await response.json();

    if (postsData.data.length > 0) {
      const blogContainer = document.getElementById("blog-container");

      postsData.data.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("blog-post");

        // Create post title
        const postTitle = document.createElement("h2");
        postTitle.textContent = post.title;

        // Create post image if available
        if (post.media?.url) {
          const postImage = document.createElement("img");
          postImage.src = post.media.url;
          postImage.alt = post.media.alt || "Post Image";
          postImage.onerror = () => {
            postImage.style.display = "none";
          };

          postElement.appendChild(postImage);
        }

        // Create post body (truncate if necessary)
        const postBody = document.createElement("p");
        postBody.textContent = post.body
          ? post.body.length > 100
            ? `${post.body.slice(0, 100)}...`
            : post.body
          : "No content available.";

        // Append title and body to the post element
        postElement.appendChild(postTitle);
        postElement.appendChild(postBody);

        if (post.tags && post.tags.length > 0) {
          const tagsElement = document.createElement("div");
          tagsElement.classList.add("tags");
          tagsElement.textContent = post.tags.join(", ");

          // Hide tag element if it somehow ends up empty
          if (!tagsElement.textContent.trim()) {
            tagsElement.style.display = "none";
          } else {
            postElement.appendChild(tagsElement);
          }
        }

        // Append the post element to the container
        blogContainer.appendChild(postElement);

        // Add click event to redirect to edit page with post id
        postElement.addEventListener("click", () => {
          window.location.href = `/post/edit.html?id=${post.id}`; // Redirect to edit page with post ID
        });
      });
    } else {
      const noPostsMessage = document.createElement("p");
      noPostsMessage.textContent = "No posts available.";
      document.getElementById("blog-container").appendChild(noPostsMessage);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error fetching posts.";
    document.getElementById("blog-container").appendChild(errorMessage);
  }
});
