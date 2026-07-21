const Payment = require('../models/Payment');
const Apartment = require('../models/Apartment');
const User = require('../models/User');

// POST /api/v1/payments/reveal/:apartmentId
// User pays 100 KES to reveal landlord phone for a specific apartment
const revealContact = async (req, res) => {
    try {
        const { apartmentId } = req.params;

        const apartment = await Apartment.findByPk(apartmentId, {
            include: [{ model: User, as: 'landlord', attributes: ['id', 'username', 'phone'] }],
        });

        if (!apartment) return res.status(404).json({ message: 'Apartment not found' });

        // Check if already paid
        const existing = await Payment.findOne({
            where: { userId: req.user.id, apartmentId: parseInt(apartmentId), status: 'completed' },
        });

        if (existing) {
            // Already paid — just return the phone
            return res.json({
                message: 'Contact already unlocked',
                phone: apartment.landlord.phone,
                landlord: apartment.landlord.username,
                alreadyPaid: true,
            });
        }

        // In production: integrate M-Pesa STK push here before creating payment record
        // For now we simulate a successful payment
        const reference = `KH-${Date.now()}-${req.user.id}`;

        await Payment.create({
            userId: req.user.id,
            apartmentId: parseInt(apartmentId),
            amount: 100.00,
            status: 'completed',
            reference,
        });

        res.status(201).json({
            message: 'Payment successful. Contact unlocked!',
            phone: apartment.landlord.phone,
            landlord: apartment.landlord.username,
            reference,
            alreadyPaid: false,
        });
    } catch (error) {
        console.error('revealContact error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/v1/payments/check/:apartmentId — check if user has paid for a listing
const checkPayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            where: {
                userId: req.user.id,
                apartmentId: parseInt(req.params.apartmentId),
                status: 'completed',
            },
        });

        res.json({ hasPaid: !!payment });
    } catch (error) {
        console.error('checkPayment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { revealContact, checkPayment };
