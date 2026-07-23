/**
 * seedAdmin.js — Run once to create the admin user
 * Usage: node scripts/seedAdmin.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const User = require('../models/User');

// ─── Configure your admin credentials here ───────────────────────────────────
const ADMIN_USERNAME = 'Admin';
const ADMIN_EMAIL    = 'admin@kenyahouse.com';
const ADMIN_PASSWORD = 'Admin@2025!';       // Change this before running
const ADMIN_PHONE    = '+254700000000';
// ─────────────────────────────────────────────────────────────────────────────

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        // Sync models without altering existing tables
        await sequelize.sync();

        // Check if admin already exists
        const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
        if (existing) {
            console.log(`⚠️  Admin user already exists: ${ADMIN_EMAIL}`);
            console.log('   To reset the password, delete the user first or use the Settings page.');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        // Create admin
        const admin = await User.create({
            username: ADMIN_USERNAME,
            email:    ADMIN_EMAIL,
            password: hashedPassword,
            phone:    ADMIN_PHONE,
            role:     'admin',
            isActive: true,
        });

        console.log('✅ Admin user created successfully!');
        console.log(`   Email   : ${admin.email}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log(`   Role    : ${admin.role}`);
        console.log('\n⚠️  Remember to change the password after first login.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seed();
