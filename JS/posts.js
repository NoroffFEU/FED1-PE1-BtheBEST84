// Fetch and display multiple blog posts
async function fetchBlogPosts() {
  try {
    const response = await fetch(
      "https://v2.api.noroff.dev/blog/posts/BtheBEST"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error("Invalid or empty data received.");
    }

    displayBlogPosts(data.data);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    document.getElementById(
      "blog-container"
    ).innerHTML = `<p>Failed to load blog posts.</p>`;
  }
}

// Function to truncate text to a specific length
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// Function to display multiple blog posts
function displayBlogPosts(posts) {
  const container = document.getElementById("blog-container");
  container.innerHTML = ""; // Clear container before adding new posts

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("blog-post");

    postElement.innerHTML = `
            <h2>${post.title}</h2>
            ${
              post.media?.url
                ? `<img src="${post.media.url}" alt="${
                    post.media.alt || "Blog image"
                  }" onerror="this.style.display='none';">`
                : ""
            }
            <p>${
              post.body ? truncateText(post.body, 100) : "No content available."
            }</p>
            ${
              post.tags?.length
                ? `<div class="tags">Tags: ${post.tags.join(", ")}</div>`
                : ""
            }
        `;

    // Add click event to redirect to post page
    postElement.addEventListener("click", () => {
      window.location.href = `/post/index.html?id=${post.id}`;
    });

    container.appendChild(postElement);
  });
}

// Call the function to fetch and display blog posts
fetchBlogPosts();
