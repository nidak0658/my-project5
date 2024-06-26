const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PhotoSchema = new mongoose.Schema({
  userId: String,
  url: String,
  key: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Photo = mongoose.model('Photo', PhotoSchema);

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('photo'), async (req, res) => {
  const { userId, description } = req.body;
  const file = req.file;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${userId}/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    const data = await s3.upload(params).promise();
    const newPhoto = new Photo({
      userId,
      url: data.Location,
      key: data.Key,
      description
    });
    await newPhoto.save();
    res.json(newPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View photos endpoint
app.get('/photos/:userId', async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.params.userId });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete photo endpoint
app.delete('/photos/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: photo.key
    };

    await s3.deleteObject(params).promise();
    await photo.remove();
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
