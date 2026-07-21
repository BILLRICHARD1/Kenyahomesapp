const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { username, phone, email, password, role } = req.body;

        if (!username || !phone || !email || !password) {
            return res.status(400).json({ message: 'username, phone, email, and password are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Validate role — only allow 'user' and 'landlord' from registration
        const allowedRoles = ['user', 'landlord'];
        const userRole = allowedRoles.includes(role) ? role : 'user';

        // Create user
        const user = await User.create({
            username,
            phone,
            email,
            password: hashedPassword,
            role: userRole,
        });

        // Generate token on register too so user is immediately logged in
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user.id, username: user.username, phone: user.phone, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

// const getProfile = async (req, res) => {
//     try {
//         const user = await User.findByPk(req.user.id, {
//             attributes: { exclude: ['password'] }
//         });
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Disable caching
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findByPk(req.params.id);


        if (!existingUser) {
            res.status(400).json({ message: "this user does not exist" })
        } else {
            // return
            if (username) existingUser.username = username;
            if (email) existingUser.email = email;
            if (password) {
                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                existingUser.password = hashedPassword;
            }
            if (role) existingUser.role = role;
            await existingUser.save();
            return res.status(200).json({ message: "user updated successfully", status: "success", user: existingUser })
        }

    } catch (error) {
        console.log("error updating profile", error)
        res.status(500).json({ message: "error updating profile", error })

    }
}


// update password after confirming current password
const resetPassword = async (req, res) => {
    try {
        const { currentpassword, newpassword } = req.body;
        const existingUser = await User.findByPk(req.params.id);

        if (!existingUser) {
            res.status(400).json({ message: "this user does not exist" })
        } else {
            // compare passwords
            const isPasswordValid = await bcrypt.compare(currentpassword, existingUser.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: "current password is incorrect" })
            } else {
                // hash new password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newpassword, salt);
                existingUser.password = hashedPassword;
                await existingUser.save();
                res.status(200).json({ message: "password updated successfully", status: "success" })
            }
        }


    } catch (error) {
        console.log("error resetting password", error)
        res.status(500).json({ message: "error resetting password", error })
    }
}

const deleteProfile = async (req, res) => {
    try {
        console.log("req par", req.params)
        const existingUser = await User.findByPk(req.params.id);


        if (!existingUser) {
            res.status(400).json({ message: "this user does not exist" })
        } else {
            // return

            await existingUser.destroy();
            return res.status(200).json({ message: "user deleted successfully", status: "success", user: existingUser })
        }

    } catch (error) {
        console.log("error updating profile", error)
        res.status(500).json({ message: "error updating profile", error })

    }
}



module.exports = { register, login, getProfile, getUserById, updateProfile, deleteProfile, resetPassword };