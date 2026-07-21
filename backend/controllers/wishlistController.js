const Wishlist = require('../models/Wishlist');
const Apartment = require('../models/Apartment');
const User = require('../models/User');

// GET /api/v1/wishlist — get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const items = await Wishlist.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Apartment,
                    as: 'apartment',
                    include: [
                        {
                            model: User,
                            as: 'landlord',
                            attributes: ['id', 'username'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({ wishlist: items });
    } catch (error) {
        console.error('getWishlist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/v1/wishlist/:apartmentId — add to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { apartmentId } = req.params;

        const apartment = await Apartment.findByPk(apartmentId);
        if (!apartment) return res.status(404).json({ message: 'Apartment not found' });

        const [item, created] = await Wishlist.findOrCreate({
            where: { userId: req.user.id, apartmentId: parseInt(apartmentId) },
        });

        if (!created) {
            return res.status(409).json({ message: 'Already in wishlist' });
        }

        res.status(201).json({ message: 'Added to wishlist', item });
    } catch (error) {
        console.error('addToWishlist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE /api/v1/wishlist/:apartmentId — remove from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { apartmentId } = req.params;

        const deleted = await Wishlist.destroy({
            where: { userId: req.user.id, apartmentId: parseInt(apartmentId) },
        });

        if (!deleted) return res.status(404).json({ message: 'Not in wishlist' });

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('removeFromWishlist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
