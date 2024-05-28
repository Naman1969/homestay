const express=require("express")
const router=express.Router()
const User = require('../models/User'); // Make sure the path to User model is correct
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

//Registration endpoint
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body)
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        newUser.save()
        res.json(newUser); // Send the created user object as response
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: error.message }); // Send error response
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const validPass = await bcrypt.compare(password, user.password);
            if (validPass) {
                jwt.sign({ email: user.email, id: user._id, name: user.name }, jwtSecret, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(user);
                });
            } else {
                res.status(401).json({ error: 'Incorrect password' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Profile endpoint
router.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        });
    } else {
        res.json(null);
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});


module.exports=router