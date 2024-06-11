const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", (req, res) => {
  Comment.findAll({})
    .then((commentData) => res.json(commentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Comment.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((commentData) => res.json(commentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!commentData) {
      res.status(404).json({ message: "404: Comment ID not found" });
      return;
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", withAuth, async (req, res) => {
  try {
    const { comment_description } = req.body;

    const [affectedRows] = await Comment.update(
      { comment_description },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    if (affectedRows === 0) {
      res
        .status(404)
        .json({
          message:
            "404: Comment ID not found or you don't have permission to update this comment",
        });
      return;
    }

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message: "An error occurred while updating the comment",
        error: err,
      });
  }
});


module.exports = router;
