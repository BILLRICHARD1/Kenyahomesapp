const express = require('express');
const router = express.Router();
const { revealContact, checkPayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/reveal/:apartmentId', authenticate, revealContact);
router.get('/check/:apartmentId', authenticate, checkPayment);

module.exports = router;
