// EmployeeForm Model
const {
  employeeFormModel,
} = require("../../models/employeeFormModel/employeeFormModel");

const {
  validateEmployeeFormGroupA,
  validateEmployeeFormGroupBC,
} = require("../../validations/employeeFormValidation");

const { userModel } = require("../../models/userModel/userModel");

// ReportingForm Model

const {
  reportingOfficerModel,
} = require("../../models/reportingOfficerModel/reportingOfficerModel");

const {
  validateReportingOfficerGroupA,
  validateReportingOfficerGroupBC,
} = require("../../validations/reportingOfficerValidation");

//Reviewing Model

const {
  reviewingOfficerModel,
} = require("../../models/reviewingOfficerModel/reviewingOfficerModel");

const {
  validateReviewingOfficerGroupA,
  validateReviewingOfficerGroupBC,
} = require("../../validations/reviewingOfficerValidation");

module.exports.createEmployeeForm = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    if (!["group-a", "group-bc"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Use group-a or group-bc.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (
      (category === "group-a" && user.group !== "A") ||
      (category === "group-bc" && !["B", "C"].includes(user.group))
    ) {
      return res.status(403).json({
        success: false,
        message: `You are not allowed to submit the ${category.toUpperCase()} form.`,
      });
    }

    if (!user.reportingOfficer || !user.reviewingOfficer) {
      return res.status(400).json({
        success: false,
        message: "Reporting or Reviewing Officer not assigned.",
      });
    }

    const existingForm = await employeeFormModel.findOne({ userId: user._id });

    if (existingForm) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted the APAR form.",
      });
    }
    // Payload
    const userPayload = {
      officerName: req.body.officerName,
      dutyDescription: req.body.dutyDescription,
      workResume: req.body.workResume,
      extraordinary: req.body.extraordinary || "N/A",
      extraSkill: req.body.extraSkill || "N/A",
      place: req.body.place,
      date: req.body.date,
      verification: req.body.verification ?? false,
    };

    const validate =
      category === "group-a"
        ? validateEmployeeFormGroupA
        : validateEmployeeFormGroupBC;

    const { error } = validate(userPayload);
    if (error) {
      console.log("🔥 VALIDATION ERROR DETAILS:", error.details);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });
    }

    // FINAL DATA SAVE
    const finalFormData = {
      ...userPayload,
      userId: user._id,
      employeeId: user.employeeId,
      reportingOfficer: user.reportingOfficer,
      reviewingOfficer: user.reviewingOfficer,
    };

    const newForm = await employeeFormModel.create(finalFormData);

    return res.status(201).json({
      success: true,
      message: `${category.toUpperCase()} Employee Form submitted successfully.`,
      form: newForm,
    });
  } catch (err) {
    console.error("❌ Employee Form Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting APAR form.",
      error: err.message,
    });
  }
};

module.exports.createReportingOfficerForm = async (req, res) => {
  try {
    const { category } = req.params; // group-a | group-bc
    const reportingOfficerMongoId = req.user.id;
    const reportingOfficerEmpId = req.user.employeeId;

    const officerName = req.user.name;
    const officerDesignation = req.user.designation;
    const officerDepartment = req.user.department;
    const officerBranch = req.user.branch;

    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
    }

    const employee = await userModel.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "No employee found with this ID.",
      });
    }

    // Authorization check
    if (String(employee.reportingOfficer) !== String(reportingOfficerMongoId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to assess this employee.",
      });
    }

    // Ensure employee present
    const empForm = await employeeFormModel.findOne({ userId: employee._id });

    if (!empForm) {
      return res.status(404).json({
        success: false,
        message: "Employee has not submitted their APAR form yet.",
      });
    }

    // Prevent duplicate submissions
    const existingReport = await reportingOfficerModel.findOne({
      employeeId: employee.employeeId,
      reportingOfficerId: reportingOfficerEmpId,
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted the report for employee ${employee.employeeId}.`,
      });
    }

    // Base fields
    const baseFormData = {
      employeeId: employee.employeeId,
      reportingOfficerId: reportingOfficerEmpId,

      name: officerName,
      designation: officerDesignation,
      department: officerDepartment,
      branch: officerBranch,
      submittedOn: new Date(),

      penPictureByReportingOfficer: req.body.penPictureByReportingOfficer,
      recommendationForIncentives: req.body.recommendationForIncentives,
      overallRemarks: req.body.overallRemarks || "N/A",

      place: req.body.place,
      date: req.body.date,
      submitted: true,
      verification: true,
    };

    let gradingFields = {};

    // -------------------------------
    // GROUP A GRADING
    // -------------------------------
    if (category === "group-a") {
      gradingFields = {
        accomplishmentOfWork: req.body.accomplishmentOfWork,
        qualityOfWork: req.body.qualityOfWork,
        knowledgeOfRules: req.body.knowledgeOfRules,
        practicalApplication: req.body.practicalApplication,
        coordinationAbility: req.body.coordinationAbility,
        initiative: req.body.initiative,
        senseOfResponsibility: req.body.senseOfResponsibility,
        communicationSkills: req.body.communicationSkills,
        analyticalAbility: req.body.analyticalAbility,
        abilityToWorkInTeam: req.body.abilityToWorkInTeam,
        abilityToMeetDeadlines: req.body.abilityToMeetDeadlines,
        interpersonalRelations: req.body.interpersonalRelations,
        punctuality: req.body.punctuality,
        conductBehavior: req.body.conductBehavior,
      };
    }

    // -------------------------------
    // GROUP B/C GRADING
    // -------------------------------
    if (category === "group-bc") {
      gradingFields = {
        accomplishmentOfWork: req.body.accomplishmentOfWork,
        qualityOfWork: req.body.qualityOfWork,
        dataEntry: req.body.dataEntry,
        knowledgeOfRule: req.body.knowledgeOfRule,
        maintenanceOfRegisters: req.body.maintenanceOfRegisters,
        coordinationAbility: req.body.coordinationAbility,
        initiative: req.body.initiative,
        proficiencyInComputerWork: req.body.proficiencyInComputerWork,
        senseOfResponsibility: req.body.senseOfResponsibility,
        communicationSkills: req.body.communicationSkills,
        abilityOfTeamWork: req.body.abilityOfTeamWork,
        abilityToMeetDeadlines: req.body.abilityToMeetDeadlines,
        interpersonalRelations: req.body.interpersonalRelations,
        punctuality: req.body.punctuality,
        behavior: req.body.behavior,
        relationWithPublic: req.body.relationWithPublic,
        training: req.body.training,
        stateOfHealth: req.body.stateOfHealth,
        integrity: req.body.integrity,
      };
    }

    // ----------------------------------------------------
    // ⭐ CALCULATE FINAL GRADE (AVERAGE)
    // ----------------------------------------------------
    const gradeValues = Object.values(gradingFields).filter(
      (v) => typeof v === "number" && !isNaN(v)
    );

    const finalGrade =
      gradeValues.length > 0
        ? Number(
            (
              gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length
            ).toFixed(2)
          )
        : null;

    // ----------------------------------------------------
    // FINAL DATA
    // ----------------------------------------------------
    const finalFormData = {
      ...baseFormData,
      ...gradingFields,
      finalGrade, // ⭐ Save final grade
    };

    // VALIDATION
    const validator =
      category === "group-a"
        ? validateReportingOfficerGroupA
        : validateReportingOfficerGroupBC;

    const { error } = validator(finalFormData);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });
    }

    // SAVE
    const newReport = await reportingOfficerModel.create(finalFormData);

    // Link to employee's APAR form
    empForm.reportingOfficer = newReport._id;
    await empForm.save();

    res.status(201).json({
      success: true,
      message: `Reporting Officer assessment for employee ${employee.employeeId} submitted successfully.`,
      form: newReport,
    });
  } catch (err) {
    console.error("❌ Reporting Officer Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while submitting reporting officer form",
      error: err.message,
    });
  }
};

module.exports.createReviewingOfficerForm = async (req, res) => {
  try {
    const { category } = req.params;

    // Reviewer identity (from JWT)
    const reviewerMongoId = req.user.id;
    const reviewerName = req.user.name;
    const reviewerDesignation = req.user.designation;
    const reviewerEmpId = req.user.employeeId;

    //THESE MUST EXIST IN req.body
    const { reportingOfficerId, employeeId } = req.body;

    // Required fields check
    if (!reportingOfficerId || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "reportingOfficerId and employeeId are required.",
      });
    }

    // Find Reporting Officer Form
    const roForm = await reportingOfficerModel.findOne({
      reportingOfficerId,
      employeeId,
    });

    if (!roForm) {
      return res.status(404).json({
        success: false,
        message: "Reporting officer form not found.",
      });
    }

    // Employee must exist
    const employee = await userModel.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // Authorization check
    if (String(employee.reviewingOfficer) !== String(reviewerMongoId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to review this employee.",
      });
    }

    // Prevent duplicate submission
    const existing = await reviewingOfficerModel.findOne({
      reportingOfficerId,
      employeeId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Review already submitted for ${employeeId}.`,
      });
    }

    // Ratings from RO form
    let defaultRatings = {};

    if (category === "group-a") {
      defaultRatings = {
        accomplishmentOfWork: roForm.accomplishmentOfWork,
        qualityOfWork: roForm.qualityOfWork,
        knowledgeOfRules: roForm.knowledgeOfRules,
        practicalApplication: roForm.practicalApplication,
        coordinationAbility: roForm.coordinationAbility,
        initiative: roForm.initiative,
        senseOfResponsibility: roForm.senseOfResponsibility,
        communicationSkills: roForm.communicationSkills,
        analyticalAbility: roForm.analyticalAbility,
        abilityToWorkInTeam: roForm.abilityToWorkInTeam,
        abilityToMeetDeadlines: roForm.abilityToMeetDeadlines,
        interpersonalRelations: roForm.interpersonalRelations,
        punctuality: roForm.punctuality,
        conductBehavior: roForm.conductBehavior,
      };
    }

    if (category === "group-bc") {
      defaultRatings = {
        accomplishmentOfWork: roForm.accomplishmentOfWork,
        qualityOfWork: roForm.qualityOfWork,
        dataEntry: roForm.dataEntry,
        knowledgeOfRule: roForm.knowledgeOfRule,
        maintenanceOfRegisters: roForm.maintenanceOfRegisters,
        coordinationAbility: roForm.coordinationAbility,
        initiative: roForm.initiative,
        proficiencyInComputerWork: roForm.proficiencyInComputerWork,
        senseOfResponsibility: roForm.senseOfResponsibility,
        communicationSkills: roForm.communicationSkills,
        abilityOfTeamWork: roForm.abilityOfTeamWork,
        abilityToMeetDeadlines: roForm.abilityToMeetDeadlines,
        interpersonalRelations: roForm.interpersonalRelations,
        punctuality: roForm.punctuality,
        behavior: roForm.behavior,
      };
    }

    //Merge reviewer overrides
    const finalRatings = {
      ...defaultRatings,
      ...(req.body.independentAssessment || {}),
    };

    //Checkbox verification
    const verification =
      req.body.verification === true || req.body.veerification === true
        ? true
        : false;

    // Final review object to save
    const finalReview = {
      reviewingOfficerId: reviewerEmpId,
      reportingOfficerId,
      employeeId,

      lengthOfService: req.body.lengthOfService,
      agreeWithAssessment: req.body.agreeWithAssessment,
      disagreementReason: req.body.disagreementReason || "N/A",

      independentAssessment: finalRatings,

      penPictureByReviewingOfficer: req.body.penPictureByReviewingOfficer,
      numericalGradingOnPart3: req.body.numericalGradingOnPart3,

      place: req.body.place,
      date: req.body.date,

      signature: req.body.signature,
      name: reviewerName,
      designation: reviewerDesignation,

      submitted: true,

      verification,
      veerification: verification,
    };

    //Validate before saving
    const validator =
      category === "group-a"
        ? validateReviewingOfficerGroupA
        : validateReviewingOfficerGroupBC;

    const { error } = validator(finalReview);

    if (error) {
      console.log("🔥 REVIEW VALIDATION ERROR DETAILS:");
      console.log(JSON.stringify(error.details, null, 2));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });
    }

    //Save review
    const newReview = await reviewingOfficerModel.create(finalReview);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });
  } catch (err) {
    console.error("❌ Reviewing Officer Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
