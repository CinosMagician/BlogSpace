const router = require('express').Router();
const { Blog } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/:id', withAuth, async (req, res) => {
    try {
        const blogPost = await Blog.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!blogPost) {
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }

        res.render('editBlog', { blogPost });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while fetching the blog post.', error: err });
    }
});



module.exports = router;

