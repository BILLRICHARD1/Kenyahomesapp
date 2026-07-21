const Apartment = require('../models/Apartment');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { Op } = require('sequelize');

// POST /api/v1/apartments — create listing (landlord only)
const createApartment = async (req, res) => {
    try {
        if (req.user.role !== 'landlord' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only landlords can create listings' });
        }

        const { title, description, price, location, type, bedrooms, bathrooms, garages } = req.body;

        if (!title || !price || !location || !type) {
            return res.status(400).json({ message: 'title, price, location, and type are required' });
        }

        // Collect uploaded image filenames
        const images = req.files ? req.files.map(f => f.filename) : [];

        if (images.length > 6) {
            return res.status(400).json({ message: 'Maximum 6 images allowed' });
        }

        const apartment = await Apartment.create({
            title,
            description: description || '',
            price: parseFloat(price),
            location,
            type,
            bedrooms: parseInt(bedrooms) || 1,
            bathrooms: parseInt(bathrooms) || 1,
            garages: parseInt(garages) || 0,
            images,
            landlordId: req.user.id,
        });

        res.status(201).json({ message: 'Apartment created successfully', apartment });
    } catch (error) {
        console.error('createApartment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/v1/apartments — list all available apartments (with search & filter)
const getApartments = async (req, res) => {
    try {
        const { search, type, minPrice, maxPrice, location, page = 1, limit = 20 } = req.query;

        const where = { isAvailable: true };

        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        if (type) where.type = type;
        if (location) where.location = { [Op.like]: `%${location}%` };
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows } = await Apartment.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'landlord',
                    attributes: ['id', 'username', 'phone'], // phone hidden from list
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        // Strip phone number from list response — only visible after payment
        const apartments = rows.map(apt => {
            const data = apt.toJSON();
            if (data.landlord) delete data.landlord.phone;
            return data;
        });

        res.json({
            apartments,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
        });
    } catch (error) {
        console.error('getApartments error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/v1/apartments/:id — get single apartment
// Phone number only visible if user has paid for this listing
const getApartmentById = async (req, res) => {
    try {
        const apartment = await Apartment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'landlord',
                    attributes: ['id', 'username', 'phone'],
                },
            ],
        });

        if (!apartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }

        const data = apartment.toJSON();

        // Check if requesting user has paid to see phone number
        let phoneVisible = false;
        if (req.user) {
            const payment = await Payment.findOne({
                where: {
                    userId: req.user.id,
                    apartmentId: apartment.id,
                    status: 'completed',
                },
            });
            phoneVisible = !!payment;
        }

        if (!phoneVisible && data.landlord) {
            delete data.landlord.phone;
        }

        data.phoneVisible = phoneVisible;

        res.json(data);
    } catch (error) {
        console.error('getApartmentById error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PUT /api/v1/apartments/:id — update listing (owner or admin only)
const updateApartment = async (req, res) => {
    try {
        const apartment = await Apartment.findByPk(req.params.id);
        if (!apartment) return res.status(404).json({ message: 'Apartment not found' });

        if (apartment.landlordId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, description, price, location, type, bedrooms, bathrooms, garages, isAvailable } = req.body;

        if (title) apartment.title = title;
        if (description) apartment.description = description;
        if (price) apartment.price = parseFloat(price);
        if (location) apartment.location = location;
        if (type) apartment.type = type;
        if (bedrooms !== undefined) apartment.bedrooms = parseInt(bedrooms);
        if (bathrooms !== undefined) apartment.bathrooms = parseInt(bathrooms);
        if (garages !== undefined) apartment.garages = parseInt(garages);
        if (isAvailable !== undefined) apartment.isAvailable = isAvailable === 'true' || isAvailable === true;

        // Handle images: if existingImages sent, use that as the new base (removes deleted ones)
        if (req.body.existingImages !== undefined) {
            try {
                const kept = JSON.parse(req.body.existingImages);
                apartment.images = kept;
            } catch { /* ignore parse error */ }
        }

        // Append any newly uploaded files
        if (req.files && req.files.length > 0) {
            const newFiles = req.files.map(f => f.filename);
            const combined = [...(apartment.images || []), ...newFiles];
            if (combined.length > 6) {
                return res.status(400).json({ message: 'Maximum 6 images allowed' });
            }
            apartment.images = combined;
        }

        await apartment.save();
        res.json({ message: 'Apartment updated successfully', apartment });
    } catch (error) {
        console.error('updateApartment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE /api/v1/apartments/:id — delete listing
const deleteApartment = async (req, res) => {
    try {
        const apartment = await Apartment.findByPk(req.params.id);
        if (!apartment) return res.status(404).json({ message: 'Apartment not found' });

        if (apartment.landlordId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await apartment.destroy();
        res.json({ message: 'Apartment deleted successfully' });
    } catch (error) {
        console.error('deleteApartment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/v1/apartments/landlord/my — landlord's own listings
const getMyListings = async (req, res) => {
    try {
        const apartments = await Apartment.findAll({
            where: { landlordId: req.user.id },
            order: [['createdAt', 'DESC']],
        });
        res.json({ apartments });
    } catch (error) {
        console.error('getMyListings error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createApartment,
    getApartments,
    getApartmentById,
    updateApartment,
    deleteApartment,
    getMyListings,
};
