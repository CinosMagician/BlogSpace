const router = require('express').Router();
// This connects our routes for the server to connect to
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

// This tells the router what files to read when using these routes.
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;