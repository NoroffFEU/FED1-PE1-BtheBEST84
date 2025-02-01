// Initiate array variable
let postList = [];

// Fetch posts
async function getPosts() {
  try {
    const response = await fetch(
      "https://v2.api.noroff.dev/blog/posts/BtheBEST"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Check that the array is not empty or that it is not an array
    if (!Array.isArray(data.data) || data.data.length === 0) {
      throw new Error("");
    }
    postList = data.data;
  } catch (error) {
    alert("Something went wrong");
  }
}

// Call the function
getPosts();
