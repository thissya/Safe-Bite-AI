const express= require('express');
const router= express.Router();
const {update_medical_condition}= require('../controller/medicalcontroller');
const authenticateToken = require('../middleware/authMiddleware');

router.put('/updateMedicalCondition', authenticateToken, update_medical_condition);

module.exports =router;