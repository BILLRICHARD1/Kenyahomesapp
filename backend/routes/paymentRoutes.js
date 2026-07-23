const express = require('express');
const router  = express.Router();
const {
    revealContact,
    mpesaCallback,
    paymentStatus,
    checkPayment,
} = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Initiate STK Push — user must be logged in
router.post('/reveal/:apartmentId', authenticate, revealContact);

// Safaricom callback — no auth (Safaricom calls this directly)
router.post('/mpesa/callback', mpesaCallback);

// Poll for STK push result — user must be logged in
router.get('/status/:checkoutRequestId', authenticate, paymentStatus);

// Check if user already paid for a listing
router.get('/check/:apartmentId', authenticate, checkPayment);

module.exports = router;
