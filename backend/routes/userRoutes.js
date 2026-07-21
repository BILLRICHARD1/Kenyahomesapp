const express = require('express');
const router = express.Router();
const { register, login, getProfile, getUserById, updateProfile, deleteProfile, resetPassword } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/profile/:id', authenticate, getUserById);
router.put('/profile/:id', authenticate, updateProfile);
router.delete('/profile/:id', authenticate, deleteProfile);
router.post('/passreset/:id', authenticate, resetPassword);

module.exports = router;
