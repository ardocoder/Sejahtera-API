// import exppress from 'express';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
// const cors = require('cors'); // npm install cors

const app = express();
// const productRoutes = require('./src/routes/products'); // dummy
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, callback) => {
    if (
        file.mimetype == 'image/png' || 
        file.mimetype == 'image/jpg' || 
        file.mimetype == 'image/jpeg'
        ){
        callback(null, true);
    } else {
        callback(null, false);
    }
}

// app.use(cors());

app.use(bodyParser.json()); // type JSON
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

// app.use(express.json()); // for parsing application JSON
// app.use(express.urlencoded({extended:true})); // for parsing application x-www-form-urlencoded

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

// app.use('/v1/customer', productRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({message: message, data: data});
})

mongoose.connect('mongodb+srv://ardocoder:rbAGRiJDBw2kFhC1@cluster0.gbb2c.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => {
    app.listen(4000, () => console.log('Connection Success'));
})
.catch(err => console.log(err));