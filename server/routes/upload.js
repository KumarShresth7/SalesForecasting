const express = require('express');
const multer = require('multer');
const SalesData = require('../models/Sales');
const csv = require('csv-parser');
const fs = require('fs');
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
      for (const result of results) {
        const salesData = new SalesData({
          date: new Date(result.date),
          sales: result.sales
        });
        await salesData.save();
      }
      res.send('File uploaded and data saved!');
    });
});

module.exports = router;
