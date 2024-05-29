const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 4000;
const connectToMongo=require("./db/db.js")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

//Database Mongodb connection
connectToMongo()


// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));



// User Registration, Login, Profile Details, Logout Router
app.use("/",require("./routes/userAuth.js"))

//Add, Update, Delete, Get All, Get Individual Place
app.use("/place",require("./routes/places.js"))

app.use('/uploads', express.static(__dirname + '/uploads'));

app.post('/upload', upload.array('photos'), (req, res) => {
  console.log(req.files); // Logs the uploaded files
  if (!req.files) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }
  const filenames = req.files.map(file => file.filename);
  res.json({ filenames });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
