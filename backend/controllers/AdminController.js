const Settings = require('../models/Settings');
const User = require('../models/User');
const Apartment = require('../models/Apartment');
const Payment = require('../models/Payment');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/v1/admin/stats — dashboard overview numbers
const getStats = async (req, res) => {
    try {
        const [totalUsers, totalLandlords, totalListings, activeListings, totalPayments] = await Promise.all([
            User.count({ where: { role: 'user' } }),
            User.count({ where: { role: 'landlord' } }),
            Apartment.count(),
            Apartment.count({ where: { isAvailable: true } }),
            Payment.count({ where: { status: 'completed' } }),
        ]);

        const revenue = await Payment.sum('amount', { where: { status: 'completed' } });

        const recentUsers = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']],
            limit: 5,
        });

        res.json({
            totalUsers,
            totalLandlords,
            totalListings,
            activeListings,
            totalPayments,
            revenue: revenue || 0,
            recentUsers,
        });
    } catch (error) {
        console.error('getStats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/v1/admin/allusers — all users with optional role filter & search
const getAllUsers = async (req, res) => {
    console.log("fetching all users....")
    try {
        const { role, search, page = 1, limit = 20 } = req.query;
        const where = {};
        if (role) where.role = role;
        if (search) {
            where[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
            ];
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        res.json({ users: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
    } catch (error) {
        console.error('getAllUsers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/v1/admin/listings — all apartments with landlord info
const getAllListings = async (req, res) => {
    try {
        const { search, type, isAvailable, page = 1, limit = 20 } = req.query;
        const where = {};
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } },
            ];
        }
        if (type) where.type = type;
        if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Apartment.findAndCountAll({
            where,
            include: [{ model: User, as: 'landlord', attributes: ['id', 'username', 'email', 'phone'] }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        res.json({ listings: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
    } catch (error) {
        console.error('getAllListings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE /api/v1/admin/listings/:id
const deleteListing = async (req, res) => {
    try {
        const apt = await Apartment.findByPk(req.params.id);
        if (!apt) return res.status(404).json({ message: 'Listing not found' });
        await apt.destroy();
        res.json({ message: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT /api/v1/admin/listings/:id/toggle — toggle isAvailable
const toggleListing = async (req, res) => {
    try {
        const apt = await Apartment.findByPk(req.params.id);
        if (!apt) return res.status(404).json({ message: 'Listing not found' });
        apt.isAvailable = !apt.isAvailable;
        await apt.save();
        res.json({ message: 'Updated', isAvailable: apt.isAvailable });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createMaintenance = async (req, res) => {
    try {
        const { isMaintenance, maintenanceMessage } = req.body;
        const setting = await Settings.create({ isMaintenance, maintenanceMessage });
        res.status(200).json({ message: 'Setting created', setting });
    } catch (error) {
        res.status(500).json({ message: 'Error creating setting' });
    }
};

const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findAll();
        res.status(200).json({ settings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
};

module.exports = {
    getStats,
    getAllUsers,
    getAllListings,
    deleteListing,
    toggleListing,
    createMaintenance,
    getSettings,
};
