const Payment   = require('../models/Payment');
const Apartment = require('../models/Apartment');
const User      = require('../models/User');
const { stkPush } = require('../services/mpesa');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/payments/reveal/:apartmentId
// Initiates an M-Pesa STK Push to the logged-in user's phone.
// Returns a checkoutRequestId so the client can poll for status.
// ─────────────────────────────────────────────────────────────────────────────
const revealContact = async (req, res) => {
    try {
        const { apartmentId } = req.params;

        const apartment = await Apartment.findByPk(apartmentId, {
            include: [{ model: User, as: 'landlord', attributes: ['id', 'username', 'phone'] }],
        });
        if (!apartment) return res.status(404).json({ message: 'Apartment not found' });

        // Already paid — return contact immediately
        const existing = await Payment.findOne({
            where: { userId: req.user.id, apartmentId: parseInt(apartmentId), status: 'completed' },
        });
        if (existing) {
            return res.json({
                alreadyPaid: true,
                phone:    apartment.landlord.phone,
                landlord: apartment.landlord.username,
            });
        }

        // Fetch the paying user's phone number
        const user = await User.findByPk(req.user.id, { attributes: ['id', 'phone'] });
        if (!user?.phone) {
            return res.status(400).json({
                message: 'No phone number on your account. Please update your profile first.',
            });
        }

        // Build a short unique reference (max 12 chars for Daraja)
        const reference = `KH-${apartmentId}-${req.user.id}`.slice(0, 12);

        // Initiate STK Push
        const mpesaRes = await stkPush(
            user.phone,
            100,
            reference,
            'Contact Reveal'
        );

        // mpesaRes.ResponseCode === '0' means the push was accepted (not yet paid)
        if (mpesaRes.ResponseCode !== '0') {
            console.error('STK Push rejected:', mpesaRes);
            return res.status(502).json({ message: mpesaRes.ResponseDescription || 'M-Pesa request failed' });
        }

        // Create a PENDING payment record so the callback can find it
        // Use upsert to handle duplicate requests gracefully
        await Payment.upsert({
            userId:            req.user.id,
            apartmentId:       parseInt(apartmentId),
            amount:            100.00,
            status:            'pending',
            reference,
            checkoutRequestId: mpesaRes.CheckoutRequestID,
        });

        return res.status(202).json({
            message:           'STK Push sent. Enter your M-Pesa PIN to complete payment.',
            checkoutRequestId: mpesaRes.CheckoutRequestID,
            alreadyPaid:       false,
        });
    } catch (error) {
        console.error('revealContact error:', error?.response?.data || error.message);
        // Surface Daraja auth errors clearly
        if (error?.response?.status === 400) {
            return res.status(502).json({ message: 'M-Pesa request failed — check your Daraja credentials.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/payments/mpesa/callback   (called by Safaricom — no auth)
// Safaricom posts the payment result here after the user enters their PIN.
// ─────────────────────────────────────────────────────────────────────────────
const mpesaCallback = async (req, res) => {
    // Always respond 200 immediately — Safaricom will retry if we don't
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

    try {
        const body     = req.body?.Body?.stkCallback;
        if (!body) return;

        const { ResultCode, CheckoutRequestID, CallbackMetadata } = body;

        const payment = await Payment.findOne({ where: { checkoutRequestId: CheckoutRequestID } });
        if (!payment) {
            console.warn('mpesaCallback: no payment found for', CheckoutRequestID);
            return;
        }

        if (ResultCode === 0) {
            // Payment succeeded — extract receipt number from metadata
            const items   = CallbackMetadata?.Item || [];
            const receipt = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value || null;

            payment.status             = 'completed';
            payment.mpesaReceiptNumber = receipt;
            await payment.save();

            console.log(`✅ M-Pesa payment confirmed: ${receipt} — payment #${payment.id}`);
        } else {
            // User cancelled or payment failed
            payment.status = 'failed';
            await payment.save();
            console.log(`❌ M-Pesa payment failed (ResultCode ${ResultCode}) — payment #${payment.id}`);
        }
    } catch (err) {
        console.error('mpesaCallback processing error:', err.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/payments/status/:checkoutRequestId
// Client polls this endpoint to know if the STK push was completed.
// Returns the landlord phone only when status === 'completed'.
// ─────────────────────────────────────────────────────────────────────────────
const paymentStatus = async (req, res) => {
    try {
        const { checkoutRequestId } = req.params;

        const payment = await Payment.findOne({
            where:   { checkoutRequestId, userId: req.user.id },
            include: [{
                model:   Apartment,
                as:      'apartment',
                include: [{ model: User, as: 'landlord', attributes: ['username', 'phone'] }],
            }],
        });

        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        if (payment.status === 'completed') {
            return res.json({
                status:   'completed',
                phone:    payment.apartment.landlord.phone,
                landlord: payment.apartment.landlord.username,
                receipt:  payment.mpesaReceiptNumber,
            });
        }

        if (payment.status === 'failed') {
            return res.json({ status: 'failed', message: 'Payment was cancelled or failed. Please try again.' });
        }

        // Still pending
        return res.json({ status: 'pending' });
    } catch (error) {
        console.error('paymentStatus error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/payments/check/:apartmentId  — quick check if user already paid
// ─────────────────────────────────────────────────────────────────────────────
const checkPayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            where: {
                userId:      req.user.id,
                apartmentId: parseInt(req.params.apartmentId),
                status:      'completed',
            },
        });
        res.json({ hasPaid: !!payment });
    } catch (error) {
        console.error('checkPayment error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { revealContact, mpesaCallback, paymentStatus, checkPayment };
