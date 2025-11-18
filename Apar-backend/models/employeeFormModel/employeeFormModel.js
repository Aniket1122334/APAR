const mongoose = require("mongoose");

const employeeFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
      trim: true,
    },

    officerName: {
      type: String,
      required: true,
      trim: true,
    },

    dutyDescription: {
      type: String,
      required: true,
      trim: true,
    },

    workResume: {
      type: String,
      required: true,
      trim: true,
    },

    extraordinary: {
      type: String,
      trim: true,
      default: "N/A",
    },

    extraSkill: {
      type: String,
      trim: true,
      default: "N/A",
    },

    place: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },

    reportingOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reportingOfficerModel",
      required: true,
    },

    reviewingOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviewingOfficerModel",
      required: true,
    },

    // ⭐ NEW FIELD
    verification: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const employeeFormModel = mongoose.model(
  "employeeFormModel",
  employeeFormSchema
);

module.exports = { employeeFormModel };
