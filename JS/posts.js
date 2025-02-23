document.addEventListener("DOMContentLoaded", async () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userName = userData?.name || "BtheBEST"; // Use logged-in user or default to BtheBEST to show the not logged in user the posts

  let currentPage = 1;
  const postsPerPage = 12;
  let allPosts = [];

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${userName}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error("Invalid or empty data received.");
    }

    allPosts = data.data; // Store all posts
    displayPaginatedPosts(); // Show 12 posts for the first page

    // Get the 3 latest posts for the carousel, throw error if failing
    const latestPosts = allPosts.slice(0, 3);
    displayCarousel(latestPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    document.getElementById(
      "blog-container"
    ).innerHTML = `<p>Failed to load blog posts.</p>`;
  }

  function displayPaginatedPosts() {
    const container = document.getElementById("blog-container");
    container.innerHTML = ""; // Clear container before adding new posts

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToDisplay = allPosts.slice(startIndex, endIndex);

    postsToDisplay.forEach((post) => {
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
        }</p><p id="read-more">Read more</p>
        ${
          post.tags?.length
            ? `<div class="tags">${post.tags.join(", ")}</div>`
            : ""
        }
      `;

      // Add click event to redirect to post page
      postElement.addEventListener("click", () => {
        window.location.href = `/post/index.html?id=${post.id}`;
      });

      container.appendChild(postElement);
    });

    updatePaginationButtons();
  }

  function updatePaginationButtons() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Clear unused buttons

    if (allPosts.length > postsPerPage) {
      if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "<";
        prevButton.classList.add("pagination-button");
        prevButton.addEventListener("click", () => {
          currentPage--;
          displayPaginatedPosts();
        });
        paginationContainer.appendChild(prevButton);
      }

      const totalPages = Math.ceil(allPosts.length / postsPerPage);
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("pagination-button");
        if (i === currentPage) {
          pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => {
          currentPage = i;
          displayPaginatedPosts();
        });
        paginationContainer.appendChild(pageButton);
      }

      if (currentPage * postsPerPage < allPosts.length) {
        const nextButton = document.createElement("button");
        nextButton.textContent = ">";
        nextButton.classList.add("pagination-button");
        nextButton.addEventListener("click", () => {
          currentPage++;
          displayPaginatedPosts();
        });
        paginationContainer.appendChild(nextButton);
      }
    }
  }
});

// Function to trunc the text to a specific length
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// Function to display carousel with the three latest posts
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

  // Start the carousel functionality
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
      // When user swipes left
      currentIndex = (currentIndex + 1) % totalPosts;
      updateCarousel();
    } else if (startX < endX - 30) {
      // When user swipes right
      currentIndex = (currentIndex - 1 + totalPosts) % totalPosts;
      updateCarousel();
    }
  });
}
