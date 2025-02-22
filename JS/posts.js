const postsPerPage = 12;
let currentPage = 1;
let allPosts = [];

// Fetch and display multiple blog posts with pagination
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

    allPosts = data.data; // Store all posts

    // Display first page
    displayBlogPosts(getPaginatedPosts(currentPage));

    // Get the 3 latest posts for the carousel
    displayCarousel(allPosts.slice(0, 3));

    // Setup pagination
    setupPagination(allPosts.length);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    document.getElementById(
      "blog-container"
    ).innerHTML = `<p>Failed to load blog posts.</p>`;
  }
}

// Get paginated posts
function getPaginatedPosts(page) {
  const startIndex = (page - 1) * postsPerPage;
  return allPosts.slice(startIndex, startIndex + postsPerPage);
}

// Function to display multiple blog posts
function displayBlogPosts(posts) {
  const container = document.getElementById("blog-container");
  container.innerHTML = ""; // Clear previous posts

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
          ? `<div class="tags">${post.tags.join(", ")}</div>`
          : ""
      }
    `;

    postElement.addEventListener("click", () => {
      window.location.href = `/post/index.html?id=${post.id}`;
    });

    container.appendChild(postElement);
  });
}

// Function to setup pagination controls
function setupPagination(totalPosts) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // Clear previous buttons

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");

    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentPage = i;
      displayBlogPosts(getPaginatedPosts(currentPage));
      setupPagination(totalPosts);
    });

    paginationContainer.appendChild(button);
  }
}

// Function to truncate text to a specific length
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// Function to display carousel with latest posts
function displayCarousel(posts) {
  const carouselContainer = document.getElementById("carousel-container");
  carouselContainer.innerHTML = ""; // Clear previous posts

  posts.forEach((post) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    carouselItem.innerHTML = `
      <a href="/post/index.html?id=${post.id}">
        <img src="${post.media?.url}" alt="${post.media?.alt}" />
        <div class="carousel-caption">
          <h2>${post.title}</h2>
        </div>
      </a>
    `;
    carouselContainer.appendChild(carouselItem);
  });

  // Carousel functionality
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
      currentIndex = (currentIndex + 1) % totalPosts;
      updateCarousel();
    } else if (startX < endX - 30) {
      currentIndex = (currentIndex - 1 + totalPosts) % totalPosts;
      updateCarousel();
    }
  });
}

// Fetch and display posts
fetchBlogPosts();
