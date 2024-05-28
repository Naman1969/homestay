const express = require("express")
const router = express.Router()
const Place = require('../models/Place'); // Import Place model
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const multer = require('multer');

// Multer middleware for uploading photos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep original filename
    }
});
const upload = multer({ storage });


// Update Place endpoint
router.put('/places/:id', upload.array('photos', 10), async (req, res) => {
    const { token } = req.cookies;
    const { id } = req.params;
    const {
        title,
        address,
        description,
        perks,
        extraInfo,
        checkin,
        checkout,
        maxGuests,
    } = req.body;

    try {
        jwt.verify(token, jwtSecret, async (err, userData) => {
            if (err) return res.status(403).json({ error: 'Unauthorized' });

            const placeDoc = await Place.findById(id);
            if (!placeDoc) {
                return res.status(404).json({ error: 'Place not found' });
            }
            if (userData.id === placeDoc.owner.toString()) {
                // Update fields from request body
                placeDoc.title = title;
                placeDoc.address = address;
                placeDoc.description = description;
                placeDoc.perks = perks;
                placeDoc.extraInfo = extraInfo;
                placeDoc.checkin = checkin;
                placeDoc.checkout = checkout;
                placeDoc.maxGuests = maxGuests;

                // Update photos if any are uploaded
                if (req.files && req.files.length > 0) {
                    const uploadedPhotos = req.files.map(file => file.originalname);
                    placeDoc.photos = uploadedPhotos;
                }

                // Save updated place document
                await placeDoc.save();
                res.json(placeDoc);
            } else {
                res.status(403).json({ error: 'Unauthorized' });
            }
        });
    } catch (error) {
        console.error('Error updating place:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add Place endpoint
router.post('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkin,
        checkout,
        maxGuests,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(403).json({ error: 'Unauthorized' });
        try {
            const placeDoc = await Place.create({
                owner: userData.id,
                title,
                address,
                photos,
                description,
                perks,
                extraInfo,
                checkin,
                checkout,
                maxGuests,
            });
            res.status(201).json(placeDoc);
        } catch (error) {
            console.error('Error creating place:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Get all places for a user endpoint
router.get('/getAllPlace', async (req, res) => {
    const { token } = req.cookies;
    try {
        // Verify JWT token
        const decodedToken = jwt.verify(token, jwtSecret);
        const { id: owner } = decodedToken;

        // Find places belonging to the user
        const places = await Place.find({ owner });
        res.json(places);
    } catch (error) {
        // Handle authentication and database errors
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Unauthorized' });
        } else {
            console.error('Error fetching places:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Get place by ID endpoint
router.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const place = await Place.findById(id);
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }
        res.json(place);
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router