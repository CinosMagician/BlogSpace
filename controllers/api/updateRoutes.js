const router = require("express").Router();
const { Blog, Comment, User } = require("../../models");
const withAuth = require("../../utils/auth");

// This file handles any connection that uses /api/update

// Here we are getting a blog post with a specific id ready to update
router.get("/:id", withAuth, async (req, res) => {
  try {
    const blogPost = await Blog.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!blogPost) {
      res.status(404).json({ message: "Blog post not found" });
      return;
    }

    res.render("editBlog", { blogPost });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while fetching the blog post.",
      error: err,
    });
  }
});

// Here we are getting a comment with a specific id ready to update
router.get("/comment/:id", withAuth, async (req, res) => {
  try {
    const userComment = await Comment.findOne({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
      include: [
        {
          model: Blog,
          attributes: ["title"],
        },
        {
            model: User,
            attributes: ["username"],
        },
      ],
    });

    if (!userComment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const commentData = userComment.get({ plain: true });

    res.render("editComment", {
      comment: commentData,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while fetching the comment.",
      error: err,
    });
  }
});

module.exports = router;
