const mongoose = require("mongoose");

const reportingOfficerSchema = new mongoose.Schema(
  {
    // Employee ID
    employeeId: {
      type: String,
      required: true,
      trim: true,
    },

    // Reporting Officer ID
    reportingOfficerId: {
      type: String,
      required: true,
      trim: true,
    },

    // Officer details
    name: { type: String },
    designation: { type: String },
    department: { type: String },
    branch: { type: String },
    submittedOn: { type: Date, default: Date.now },

    // GROUP A GRADING FIELDS
    accomplishmentOfWork: Number,
    qualityOfWork: Number,
    knowledgeOfRules: Number,
    practicalApplication: Number,
    coordinationAbility: Number,
    initiative: Number,
    senseOfResponsibility: Number,
    communicationSkills: Number,
    analyticalAbility: Number,
    abilityToWorkInTeam: Number,
    abilityToMeetDeadlines: Number,
    interpersonalRelations: Number,
    punctuality: Number,
    conductBehavior: Number,

    // GROUP B & C GRADING FIELDS
    dataEntry: Number,
    knowledgeOfRule: Number,
    maintenanceOfRegisters: Number,
    proficiencyInComputerWork: Number,
    abilityOfTeamWork: Number,
    behavior: Number,
    relationWithPublic: Number,
    training: Number,
    stateOfHealth: Number,
    integrity: Number,

    // Common text fields
    penPictureByReportingOfficer: { type: String, trim: true },
    recommendationForIncentives: { type: String, trim: true },
    overallRemarks: { type: String, trim: true, default: "N/A" },

    // General Info
    place: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },

    submitted: { type: Boolean, default: false },

    // NEW FIELD ADDED
    verification: {
      type: Boolean,
      default: false,
    },

    // 🚀 NEW FIELD: FINAL GRADE
    finalGrade: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports.reportingOfficerModel = mongoose.model(
  "reportingOfficerModel",
  reportingOfficerSchema
);
