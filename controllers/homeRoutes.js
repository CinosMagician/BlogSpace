const router = require("express").Router();
const { User, Blog, Comment } = require("../models");
const withAuth = require("../utils/auth");

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
					attributes: ['username'], // Include the User model to get the username of the comment author
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
				attributes: ['title'], // Include the Blog model to get the title of the blog
			  },
			  {
				model: User,
				attributes: ['username'], // Include the User model to get the username of the comment author
			  },
			],
		  },
		],
	  });
  
	  const user = userData.get({ plain: true });
	  console.log("User Data:", user); // Log the fetched user data
  
	  res.render("dashboard", {
		...user,
		logged_in: true,
	  });
	} catch (err) {
	  console.error("Error loading dashboard:", err);
	  res.status(500).json({ message: "An error occurred while loading the dashboard", error: err.message });
	}
  });
  

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

router.get("/signUp", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signUp");
});

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
