const express= require('express');
const router= express.Router();
const {update_medical_condition, chatbot}= require('../controller/medicalcontroller');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/updateMedicalCondition', authenticateToken, update_medical_condition);

module.exports =router;