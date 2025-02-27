const express = require('express');
const router = express.Router();

router.get('/route-test', (req, res) => {
  res.json({ message: 'Route test works!' });
});

router.get('/auth-test', auth, (req, res) => {
  res.json({ 
    message: 'Auth test in routes works!',
    user: req.user
  });
});

const authRoutes = require('./auth');
const templateRoutes = require('./templates');
const userRoutes = require('./users');
const searchRoutes = require('./search');
const adminRoutes = require('./admin');
const homeRoutes = require('./home');
const exportRoutes = require('./export');
const testRoutes = require('./test');
const simpleRoutes = require('./simple');

router.use('/auth', authRoutes);
router.use('/templates', templateRoutes);
router.use('/users', userRoutes);
router.use('/search', searchRoutes);
router.use('/admin', adminRoutes);
router.use('/home', homeRoutes);
router.use('/export', exportRoutes);
router.use('/test', testRoutes);
router.use('/simple', simpleRoutes);

module.exports = router; 