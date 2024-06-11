const router = require('express').Router();
// Here we are attaching all of our routes to the index so that our router can connect to them all
const blogRoutes = require('./blogRoutes');
const commentRoutes = require('./commentRoutes');
const userRoutes = require('./userRoutes');
const updateRoutes = require('./updateRoutes');
// Here we are initialising that connection with each file.
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);
router.use('/users', userRoutes);
router.use('/update', updateRoutes);

module.exports = router;

