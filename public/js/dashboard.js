const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#blog-title").value.trim();

  const description = document.querySelector("#blog-desc").value.trim();

  if (title && description) {
    const response = await fetch(`/api/blogs`, {
      method: "POST",
      body: JSON.stringify({ title, description }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert("Failed to create blog");
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute("data-id-del")) {
    const id = event.target.getAttribute("data-id-del");

    const response = await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert("Failed to delete blog");
    }
  }
};

const updateButtonHandler = async (event) => {
  if (event.target.hasAttribute("data-id-up")) {
    const id = event.target.getAttribute("data-id-up");
    try {
      const response = await fetch(`/blog/${id}`, {
        method: "GET",
      });

      if (response.ok) {
        document.location.replace(`/update/${id}`);
      } else {
        alert("Failed to fetch the blog post");
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      alert("An error occurred while fetching the blog post");
    }
  }
};

document
  .querySelector(".new-blog-form")
  .addEventListener("submit", newFormHandler);

document
  .querySelector(".blog-list")
  .addEventListener("click", delButtonHandler);

document
  .querySelector(".blog-list")
  .addEventListener("click", updateButtonHandler);

document.addEventListener("DOMContentLoaded", () => {
  const updateButtons = document.querySelectorAll(".update-btn-comment");
  const deleteButtons = document.querySelectorAll(".delete-btn-comment");

  updateButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const commentId = e.target.getAttribute("data-id-up");
      // Handle update logic here, e.g., show update form with the comment data
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent default action, if necessary
      const commentId = e.target.getAttribute("data-id-del");

      if (commentId) {
        try {
          const response = await fetch(`/api/comments/${commentId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            document.location.replace("/dashboard");
          } else {
            alert("Failed to delete comment");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred while deleting the comment");
        }
      }
    });
  });
});
