const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    unique: true
  },
  address: String,
  addedPhotos: [String],
  description: String,
  perks: {
    wifi: Boolean,
    freeParking: Boolean,
    tv: Boolean,
    pets: Boolean,
    radio: Boolean
  },
  extraInfo: String,
  checkIn: String,
  checkOut: String,
  maxGuests: Number
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
