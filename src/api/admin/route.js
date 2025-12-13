const express = require('express');
const router = express.Router();
const { signupAdmin, loginAdmin, forgotPassword, changePassword,getUserDetails, resendOtp,updateProfile } = require('./controllers');
const auth = require('../../../middleware/middleware');


router.post('/signup', signupAdmin);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/resend-otp', resendOtp);
router.post('/change-password',auth, changePassword);
router.get('/details',auth, getUserDetails );
router.put("/update-profile", updateProfile);

module.exports = router;
