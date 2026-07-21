const express = require('express');
const router = express.Router();
const {
    createApartment,
    getApartments,
    getApartmentById,
    updateApartment,
    deleteApartment,
    getMyListings,
} = require('../controllers/apartmentController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public — list & view
router.get('/', getApartments);
router.get('/landlord/my', authenticate, getMyListings);  // must be before /:id
router.get('/:id', authenticate, getApartmentById);

// Protected — landlord CRUD
router.post('/', authenticate, upload.array('images', 6), createApartment);
router.put('/:id', authenticate, upload.array('images', 6), updateApartment);
router.delete('/:id', authenticate, deleteApartment);

module.exports = router;
