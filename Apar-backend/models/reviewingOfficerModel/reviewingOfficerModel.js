const mongoose = require("mongoose");

const reviewingOfficerSchema = new mongoose.Schema(
  {
    // Officer who is reviewing
    reviewingOfficerId: {
      type: String,
      required: true,
      trim: true,
    },

    // Employee being reviewed
    employeeId: {
      type: String,
      required: true,
      trim: true,
    },

    // Officer details
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String },
    branch: { type: String },
    submittedOn: { type: Date, default: Date.now },

    // Part 1 — general details
    lengthOfService: { type: String, required: true },
    agreeWithAssessment: { type: String, required: true },
    disagreementReason: { type: String, default: "N/A" },

    //supports both Group A & BC
    independentAssessment: {
      accomplishmentOfWork: { type: Number },
      qualityOfWork: { type: Number },
      knowledgeOfRules: { type: Number },
      practicalApplication: { type: Number },
      coordinationAbility: { type: Number },
      initiative: { type: Number },
      senseOfResponsibility: { type: Number },
      communicationSkills: { type: Number },
      analyticalAbility: { type: Number },
      abilityToWorkInTeam: { type: Number },
      abilityToMeetDeadlines: { type: Number },
      interpersonalRelations: { type: Number },
      punctuality: { type: Number },
      conductBehavior: { type: Number },

      // BC extra fields
      dataEntry: { type: Number },
      knowledgeOfRule: { type: Number },
      maintenanceOfRegisters: { type: Number },
      proficiencyInComputerWork: { type: Number },
      abilityOfTeamWork: { type: Number },
      behavior: { type: Number },
    },

    // Part 4
    penPictureByReviewingOfficer: { type: String, required: true },
    numericalGradingOnPart3: { type: Number, required: true },

    // General info
    place: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },

    // Signature
    signature: { type: String, required: true },

    // Submission flag
    submitted: { type: Boolean, default: true },

    //OLD FIELD
    veerification: {
      type: Boolean,
      default: false,
    },

    //NEW FIELD ADDED NOW
    verification: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Correct Model Name
module.exports.reviewingOfficerModel = mongoose.model(
  "reviewingOfficerModel",
  reviewingOfficerSchema
);
