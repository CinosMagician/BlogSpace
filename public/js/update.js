document.addEventListener("DOMContentLoaded", () => {
    const blogId = document.querySelector(".edit-blog-form").dataset.blogid;
  
    const form = document.querySelector(".edit-blog-form");
    const titleInput = document.getElementById("blog_title");
    const descriptionTextarea = document.getElementById("blog_content");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const title = titleInput.value.trim();
      const description = descriptionTextarea.value.trim();
  
      if (!title || !description) {
        alert("Please fill in all fields.");
        return;
      }
  
      try {
        const response = await fetch(`/api/blogs/${blogId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        });
  
        if (response.ok) {
          alert("Blog post updated successfully!");
          document.location.replace(`/blog/${blogId}`);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || 'Unable to update blog post.'}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to update blog post. Please try again later.");
      }
    });
  });
  