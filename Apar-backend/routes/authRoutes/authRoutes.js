const express = require("express");
const router = express.Router();

const {
  requestOTP,
  verifyOTP,
  resendOTP,
} = require("../../controllers/authController/authController");

//Request OTP
router.post("/request", requestOTP);

//Verify OTP
router.post("/verify", verifyOTP);

//Resend OTP
router.post("/resend", resendOTP);

module.exports = router;
