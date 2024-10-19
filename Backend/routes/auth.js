const express = require('express');
const router= express.Router();
const {signup,login,image_for_OCR}= require('../controller/authcontroller');

const multer = require('multer'); 
const upload = multer({dest: 'uploads/'});

router.post('/signup',signup);
router.post('/login',login);

router.post('/upload',upload.single('image'),image_for_OCR);

module.exports = router;
