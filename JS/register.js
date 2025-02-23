document
  .getElementById("register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const bio = document.getElementById("bio").value.trim();
    const avatarUrl = document.getElementById("avatar-url").value.trim();
    const avatarAlt = document.getElementById("avatar-alt").value.trim();
    const bannerUrl = document.getElementById("banner-url").value.trim();
    const bannerAlt = document.getElementById("banner-alt").value.trim();
    const messageElement = document.getElementById("message");

    // Bio, avatar alt, and banner alt must be less than 160 characters
    if (bio.length > 160) {
      messageElement.textContent = "Bio must be less than 160 characters.";
      messageElement.style.color = "red";
      return;
    }
    if (avatarAlt.length > 160) {
      //Allowed only less than 160 characters
      messageElement.textContent =
        "Avatar alt text must be less than 160 characters.";
      messageElement.style.color = "red";
      return;
    }
    if (bannerAlt.length > 160) {
      messageElement.textContent =
        "Banner alt text must be less than 160 characters.";
      messageElement.style.color = "red";
      return;
    }

    // Construct request body
    const requestBody = {
      name,
      email,
      password,
      bio: bio || undefined,
      avatar: avatarUrl
        ? { url: avatarUrl, alt: avatarAlt || "Avatar image" }
        : undefined,
      banner: bannerUrl
        ? { url: bannerUrl, alt: bannerAlt || "Banner image" }
        : undefined,
    };

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        messageElement.textContent = "Registration successful!";
        messageElement.style.color = "green";
        this.reset(); // Clear form
      } else {
        throw new Error(result.message || "Registration failed.");
      }
    } catch (error) {
      messageElement.textContent = error.message;
      messageElement.style.color = "red";
    }
  });
