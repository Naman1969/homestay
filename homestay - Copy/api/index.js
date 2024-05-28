const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js'); // Make sure the path to User model is correct
const Place = require('./models/Place.js'); // Import Place model
require('dotenv').config();
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();
const jwtSecret = process.env.JWT_SECRET || 'namansuranahomestaywebsite2002';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173" // Update the origin URL with your frontend URL
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Registration endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.json(newUser); // Send the created user object as response
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message }); // Send error response
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
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
app.get('/profile', (req, res) => {
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
app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

// Update Place endpoint
app.put('/places/:id', upload.array('photos', 10), async (req, res) => {
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
app.post('/places', async (req, res) => {
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
app.get('/places', async (req, res) => {
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
app.get('/places/:id', async (req, res) => {
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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
