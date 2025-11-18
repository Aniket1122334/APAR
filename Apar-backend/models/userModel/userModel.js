const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    officerName: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    reportPeriod: {
      type: String,
      required: true,
      trim: true,
    },

    absencePeriod: {
      type: String,
      trim: true,
      default: "N/A",
    },

    group: {
      type: String,
      enum: ["A", "B", "C"],
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["employee", "reportingOfficer", "reviewingOfficer"],
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // ⭐ ObjectId reference fields
    reportingOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      default: null,
    },

    reviewingOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ⭐ Joi Validation for ObjectId
function validateUser(data) {
  const schema = Joi.object({
    employeeId: Joi.string().trim().required(),
    officerName: Joi.string().trim().required(),
    designation: Joi.string().trim().required(),
    department: Joi.string().trim().required(),
    branch: Joi.string().trim().required(),
    reportPeriod: Joi.string().trim().required(),
    absencePeriod: Joi.string().trim().allow(""),

    group: Joi.string().valid("A", "B", "C").required(),

    role: Joi.string()
      .valid("employee", "reportingOfficer", "reviewingOfficer")
      .required(),

    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),

    // ⭐ If role is employee → reportingOfficer and reviewingOfficer required
    reportingOfficer: Joi.when("role", {
      is: "employee",
      then: Joi.string().required(),
      otherwise: Joi.string().allow(null),
    }),

    reviewingOfficer: Joi.when("role", {
      is: "employee",
      then: Joi.string().required(),
      otherwise: Joi.string().allow(null),
    }),
  });

  return schema.validate(data, { abortEarly: false });
}

const userModel = mongoose.model("userModel", userSchema);
module.exports = { userModel, validateUser };
