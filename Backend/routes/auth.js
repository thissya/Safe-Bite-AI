const express = require('express');
const router = express.Router();
const {signup,login,getuser}= require('../controller/authcontroller');

const authenticateToken = require('../middleware/authMiddleware');

router.post('/signup',signup);
router.post('/login',login);
router.get('/profile',authenticateToken,getuser);

module.exports = router;
