const router = require("express").Router();
const { User, Blog, Comment } = require("../models");
const withAuth = require("../utils/auth");

// This handles all of our routing with our homepage, also known as the routes that use just '/'

// This will get all Blogposts and use this data to run the handlebars to display all posts from all users.
router.get("/", async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const blogs = blogData.map((blog) =>
      blog.get({
        plain: true,
      })
    );

    res.render("homepage", {
      blogs,
      logged_in: req.session.logged_in,
      username: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// This will get a specific blog via id, used when we click on a specific blog on the homepage.
router.get("/blog/:id", async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const blog = blogData.get({
      plain: true,
    });

    res.render("blog", {
      ...blog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// This is used to get the dashboard for our current user, if not logged in, user will be redirected to log in
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Blog,
          include: [
            {
              model: Comment,
              include: [
                {
                  model: User,
                  attributes: ["username"],
                },
              ],
            },
          ],
        },
        {
          model: Comment,
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
        },
      ],
    });

    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res
      .status(500)
      .json({
        message: "An error occurred while loading the dashboard",
        error: err.message,
      });
  }
});

// This will handle the route when going to log in, if already logged in, it will take us to the dashboard
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

// This will handle the route when going to sign up, if already logged in, it will take us to the dashboard
router.get("/signUp", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signUp");
});

// This will let us update a blog with a specific id, used on the dashboard to edit the users blogs.
router.get("/update/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const blog = blogData.get({ plain: true });

    if (!blog) {
      res.status(404).json({ message: "Blog post not found" });
      return;
    }

    res.render("editBlog", {
      ...blog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
