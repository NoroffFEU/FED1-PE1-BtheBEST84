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

    // Display all blog posts in the main content area
    displayBlogPosts(data.data);

    // Get the 3 latest posts for the carousel
    const latestPosts = data.data.slice(0, 3);
    displayCarousel(latestPosts);
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

// Function to display carousel with latest posts
// Function to display carousel with latest posts
function displayCarousel(posts) {
  const carouselContainer = document.getElementById("carousel-container");
  carouselContainer.innerHTML = ""; // Clear carousel before adding new posts

  posts.forEach((post) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    carouselItem.innerHTML = `
      <a href="/post/index.html?id=${post.id}"> <!-- Correct URL format with query param -->
        <img src="${post.media?.url}" alt="${post.media?.alt}" />
        <div class="carousel-caption">
          <h2>${post.title}</h2>
        </div>
      </a>
    `;
    carouselContainer.appendChild(carouselItem);
  });

  // Initialize carousel functionality
  let currentIndex = 0;
  const totalPosts = posts.length;
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  function updateCarousel() {
    const offset = -currentIndex * 100;
    document.getElementById(
      "carousel-container"
    ).style.transform = `translateX(${offset}%)`;
  }

  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalPosts) % totalPosts;
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalPosts;
    updateCarousel();
  });

  // Swipe functionality for mobile devices
  let startX = 0;
  let endX = 0;

  carouselContainer.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  });

  carouselContainer.addEventListener("touchmove", (event) => {
    endX = event.touches[0].clientX;
  });

  carouselContainer.addEventListener("touchend", () => {
    if (startX > endX + 30) {
      // Swipe left
      currentIndex = (currentIndex + 1) % totalPosts;
      updateCarousel();
    } else if (startX < endX - 30) {
      // Swipe right
      currentIndex = (currentIndex - 1 + totalPosts) % totalPosts;
      updateCarousel();
    }
  });
}

// Call the function to fetch and display blog posts
fetchBlogPosts();
