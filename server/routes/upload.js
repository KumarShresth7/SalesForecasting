const express = require('express');
const multer = require('multer');
const SalesData = require('../models/Sales');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');
const router = express.Router();

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// File upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const result of results) {
          const salesData = new SalesData({
            date: new Date(result.date),
            sales: parseFloat(result.sales)
          });
          await salesData.save();
        }

        // Send data to Python service for training
        await axios.post('http://localhost:5001/train', results);

        res.send('File uploaded and data saved!');
      } catch (error) {
        res.status(500).send('Error saving data');
      }
    });
});

// Fetch sales data endpoint
router.get('/sales', async (req, res) => {
  try {
    const salesData = await SalesData.find();
    res.json(salesData);
  } catch (error) {
    res.status(500).send('Error fetching sales data');
  }
});

// Predict sales endpoint
router.post('/predict', async (req, res) => {
  try {
    const dates = req.body.dates;
    const response = await axios.post('http://localhost:5001/predict', { dates });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error making predictions');
  }
});

module.exports = router;
