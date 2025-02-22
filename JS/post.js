// Function to get query parameter by name
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Fetch and display a single blog post
async function fetchSinglePost() {
  const postId = getQueryParam("id");

  if (!postId) {
    document.body.innerHTML = "<p>Post ID is missing.</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/BtheBEST/${postId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const post = await response.json();
    const postData = post.data;

    document.getElementById("post-title").textContent = postData.title;

    // Format the body to wrap paragraphs correctly
    document.getElementById("post-body").innerHTML = formatBodyText(
      postData.body || "No content available."
    );

    if (postData.media?.url) {
      const imgElement = document.createElement("img");
      imgElement.src = postData.media.url;
      imgElement.onerror = () => {
        imgElement.style.display = "none";
      };
      document.getElementById("post-image").prepend(imgElement);
    }

    // Create tags
    const tagsContainer = document.getElementById("post-tags");
    if (postData.tags?.length) {
      tagsContainer.innerHTML = `<div class="tags">${postData.tags.join(
        ", "
      )}</div>`;
    }

    // Add author information to the post
    const authorContainer = document.getElementById("post-author");
    if (postData.author) {
      authorContainer.innerHTML = `
        <div class="author-info">
          ${
            postData.author.avatar?.url
              ? `<img src="${postData.author.avatar.url}" alt="${postData.author.avatar.alt}" class="author-avatar">`
              : ""
          }
          <h3>${postData.author.name || "Unknown Author"}</h3>
          <p>${postData.author.bio || ""}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
    document.body.innerHTML = "<p>Failed to load blog post.</p>";
  }
}

// Function to format post body with <p> tags
function formatBodyText(text) {
  // If already formatted with <p>, return as is
  if (text.includes("<p>")) return text;

  // Split text at double line breaks and wrap each paragraph in <p>
  return text
    .split(/\n\s*\n/) // Splits at empty lines
    .map((para) => `<p>${para.trim()}</p>`)
    .join(""); // Join formatted paragraphs
}

// Call function to fetch the post
fetchSinglePost();
