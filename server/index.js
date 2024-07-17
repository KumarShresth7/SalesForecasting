const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
const uploadRoute = require('./routes/upload')
dotenv.config()

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

mongoose.connect(process.env.MONGO_URI)
app.use('/api', uploadRoute)

app.get('/',(req,res)=>console.log('Sales Forecasting API'))

const PORT = process.env.PORT||5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

