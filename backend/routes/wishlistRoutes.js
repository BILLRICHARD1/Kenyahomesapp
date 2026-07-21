const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getWishlist);
router.post('/:apartmentId', authenticate, addToWishlist);
router.delete('/:apartmentId', authenticate, removeFromWishlist);

module.exports = router;
