const axios = require("axios");

module.exports.sendOTPMessage = async (phone, otp) => {
  try {
    const API_KEY = process.env.SMS_API_KEY;
    const SENDER_ID = process.env.SMS_SENDER_ID;
    const PEID = process.env.SMS_PEID;
    const TEMPLATE_ID = process.env.SMS_TEMPLATE_ID;

    // EXACT DLT TEMPLATE TEXT (NO CHANGE!)
    const text = `Your secure OTP for APAR login is ${otp} Do not share this OTP. Regards Delhi Skill and Entrepreneurship University`;

    const url = `http://smsfortius.in/api/mt/SendSMS?apikey=${API_KEY}&senderid=${SENDER_ID}&channel=Trans&DCS=0&flashsms=0&number=${phone}&text=${encodeURIComponent(
      text
    )}&route=02&peid=${PEID}&DLTTemplateId=${TEMPLATE_ID}`;

    const response = await axios.get(url);

    console.log("📩 SMS API Response:", response.data);

    return {
      success: true,
      response: response.data,
    };
  } catch (err) {
    console.error("❌ SMS API ERROR:", err);
    return {
      success: false,
      error: err.message,
    };
  }
};
