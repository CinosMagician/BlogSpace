document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".edit-comment-form");
    const commentId = form.dataset.commentid;
    const descriptionTextarea = document.getElementById("comment_description"); // Ensure this ID matches your template

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const comment_description = descriptionTextarea.value.trim();

        if (!comment_description) {
            alert("Please fill in the comment field.");
            return;
        }

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ comment_description }),
            });

            if (response.ok) {
                document.location.replace(`/dashboard`);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Unable to update comment.'}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to update comment. Please try again later.");
        }
    });
});
