const express= require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const medicalRoutes = require('./routes/medical');
require('dotenv').config();
const app = express();

app.use(express.json()); 
app.use(cors());         

const url =process.env.URL;
mongoose.connect(url)
    .then(() => {
        console.log("Connected successfully to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB connection error: ", err.message);
    });

app.use('/api', authRoutes);        
app.use('/api', medicalRoutes);  

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});