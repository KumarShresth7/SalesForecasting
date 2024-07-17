const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)


app.get('/',(req,res)=>console.log('Sales Forecasting API'))

const PORT = process.env.PORT||5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

