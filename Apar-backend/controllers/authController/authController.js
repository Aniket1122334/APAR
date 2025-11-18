const jwt = require("jsonwebtoken");
const { userModel } = require("../../models/userModel/userModel");

const { sendOTPMessage } = require("../../utils/sendSMS");

const {
  validateRequestOtp,
  validateVerifyOtp,
  validateResendOtp,
} = require("../../validations/authValidation");

const SECRET = process.env.JWT_SECRET;
const SALT1 = process.env.SALT1;
const SALT2 = process.env.SALT2;

// -------------------------------------------------------------
// UTILITY FUNCTIONS
// -------------------------------------------------------------

// Generate 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Encode OTP
const encodeOTP = (otp) =>
  Buffer.from(`${SALT2}${otp}${SALT1}`).toString("base64");

// Create short-lived OTP token (5 minutes)
const createOtpToken = (data) => jwt.sign(data, SECRET, { expiresIn: "5m" });

// Create long-lived auth token (1 hour)
const createAuthToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      employeeId: user.employeeId,
      name: user.officerName,
      role: user.role,
      department: user.department,
      branch: user.branch,
      reportPeriod: user.reportPeriod,
      absencePeriod: user.absencePeriod,
      group: user.group,
      designation: user.designation,
    },
    SECRET,
    { expiresIn: "1h" }
  );

//REQUEST OTP
module.exports.requestOTP = async (req, res) => {
  try {
    // ------------------------------------------
    // 1️⃣ Joi Validation
    // ------------------------------------------
    const { error } = validateRequestOtp(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const { phone, role } = req.body;

    // ------------------------------------------
    // 2️⃣ Check if user exists
    // ------------------------------------------
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ------------------------------------------
    // 3️⃣ Check user selected role correctly
    // ------------------------------------------
    if (role !== user.role) {
      return res.status(400).json({
        success: false,
        message: "Incorrect role selected",
      });
    }

    // ------------------------------------------
    // 4️⃣ Generate OTP + Token
    // ------------------------------------------
    const otp = generateOTP();
    const encodedOTP = encodeOTP(otp);

    const token = createOtpToken({ phone, encodedOTP, role });

    // ------------------------------------------
    // 5️⃣ Prepare SMS Message
    // ------------------------------------------
    const smsMessage = `Your secure OTP for APAR login is ${otp} Do not share this OTP. Regards Delhi Skill and Entrepreneurship `;
    console.log(smsMessage);

    // ------------------------------------------
    // 6️⃣ Send OTP via SMS Gateway
    // ------------------------------------------
    const smsResult = await sendOTPMessage(phone, otp);

    // ------------------------------------------
    // 7️⃣ Handle SMS Gateway ERROR
    // ------------------------------------------
    if (!smsResult.success) {
      console.log("❌ SMS Failure:", smsResult);

      return res.status(500).json({
        success: false,
        message: `Unable to send OTP: ${smsResult.message}`,
        providerResponse: smsResult.response || null,
      });
    }

    // ------------------------------------------
    // 8️⃣ LOG SUCCESS
    // ------------------------------------------
    console.log("📩 OTP Sent Successfully:", smsResult);

    // ------------------------------------------
    // 9️⃣ Response to Frontend
    // ------------------------------------------
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      token,
      smsInfo: smsResult.response, // optional debugging info
    });
  } catch (err) {
    console.error("OTP Request Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
      error: err.message,
    });
  }
};

//VERIFY OTP
module.exports.verifyOTP = async (req, res) => {
  try {
    // Joi validation
    const { error } = validateVerifyOtp(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const { otp, token } = req.body;

    // Decode token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid",
      });
    }

    // Compare encoded OTP
    const encodedInputOtp = encodeOTP(otp);
    if (encodedInputOtp !== decoded.encodedOTP) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    // Find user
    const user = await userModel.findOne({ phone: decoded.phone });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Generate final login token
    const authToken = createAuthToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: authToken,
      user: {
        id: user._id,
      },
    });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// STEP 3
module.exports.resendOTP = async (req, res) => {
  try {
    // Joi validation
    const { error } = validateResendOtp(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const { phone, role } = req.body;

    // Check user exists
    const user = await userModel.findOne({ phone });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (role !== user.role) {
      return res.status(400).json({
        success: false,
        message: "Incorrect role selected",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const encodedOTP = encodeOTP(otp);

    // Create new OTP token
    const token = createOtpToken({ phone, encodedOTP, role });

    console.log(`Resent OTP for ${phone} (${role}): ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      token,
    });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
