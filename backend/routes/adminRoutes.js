const express = require('express');
const router = express.Router();
const {
    getStats,
    getAllUsers,
    getAllListings,
    deleteListing,
    toggleListing,
    createMaintenance,
    getSettings,
} = require('../controllers/AdminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { updateProfile, deleteProfile } = require('../controllers/userController');

// Stats
router.get('/stats', authorizeAdmin, getStats);

// Users
router.get('/allusers', authorizeAdmin, getAllUsers);
router.put('/updateaccount/:id', authorizeAdmin, updateProfile);
router.delete('/deleteaccount/:id', authorizeAdmin, deleteProfile);

// Listings
router.get('/listings', authorizeAdmin, getAllListings);
router.delete('/listings/:id', authorizeAdmin, deleteListing);
router.put('/listings/:id/toggle', authorizeAdmin, toggleListing);

// Settings
router.post('/createsetting', authorizeAdmin, createMaintenance);
router.get('/getsettings', getSettings);

module.exports = router;
