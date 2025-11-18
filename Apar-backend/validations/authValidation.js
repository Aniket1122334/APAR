const Joi = require("joi");

// Phone schema
const phoneSchema = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .required()
  .messages({
    "string.empty": "Phone number is required",
    "string.pattern.base":
      "Invalid phone number (must be 10 digits starting with 6–9)",
  });

// Role schema
const roleSchema = Joi.string().trim().required().messages({
  "string.empty": "Role is required",
});

// OTP schema
const otpSchema = Joi.string()
  .length(4)
  .pattern(/^\d{4}$/)
  .required()
  .messages({
    "string.empty": "OTP is required",
    "string.length": "OTP must be 4 digits",
    "string.pattern.base": "OTP must contain only numbers",
  });

// Token schema
const tokenSchema = Joi.string().required().messages({
  "string.empty": "Token is required",
});

// Validate Request OTP
exports.validateRequestOtp = (data) => {
  return Joi.object({
    phone: phoneSchema,
    role: roleSchema,
  }).validate(data, { abortEarly: false });
};

// Validate Verify OTP
exports.validateVerifyOtp = (data) => {
  return Joi.object({
    otp: otpSchema,
    token: tokenSchema,
  }).validate(data, { abortEarly: false });
};

// Validate Resend OTP
exports.validateResendOtp = (data) => {
  return Joi.object({
    phone: phoneSchema,
    role: roleSchema,
  }).validate(data, { abortEarly: false });
};
