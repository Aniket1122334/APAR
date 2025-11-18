const Joi = require("joi");

// -------------------------------------------------------------
// COMMON FIELDS (used by both Group A & Group BC)
// -------------------------------------------------------------
const baseCommonFields = {
  penPictureByReportingOfficer: Joi.string().trim().required(),
  overallRemarks: Joi.string().trim().allow("", "N/A"),
  recommendationForIncentives: Joi.string().trim().allow(""),
  place: Joi.string().trim().required(),

  // React date input gives YYYY-MM-DD
  date: Joi.string()
    .trim()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Date must be in format YYYY-MM-DD",
    }),

  submitted: Joi.boolean().optional(),

  // Officer metadata
  name: Joi.string().optional(),
  designation: Joi.string().optional(),
  department: Joi.string().optional(),
  branch: Joi.string().optional(),
  submittedOn: Joi.date().optional(),

  // NEW FIELD
  verification: Joi.boolean().optional().default(false),

  // ⭐ NEW FIELD ADDED: FINAL GRADE
  finalGrade: Joi.number().optional(),
};

// -------------------------------------------------------------
// Rating validation helper
// -------------------------------------------------------------
const grade = Joi.number().min(1).max(10).required().messages({
  "number.base": "Rating must be a number",
  "number.min": "Minimum rating is 1",
  "number.max": "Maximum rating is 10",
  "any.required": "This field is required",
});

// -------------------------------------------------------------
// GROUP A VALIDATION
// -------------------------------------------------------------
exports.validateReportingOfficerGroupA = (data) => {
  const schema = Joi.object({
    employeeId: Joi.string().trim().required(),
    reportingOfficerId: Joi.string().trim().required(),

    accomplishmentOfWork: grade,
    qualityOfWork: grade,
    knowledgeOfRules: grade,
    practicalApplication: grade,
    coordinationAbility: grade,
    initiative: grade,
    senseOfResponsibility: grade,
    communicationSkills: grade,
    analyticalAbility: grade,
    abilityToWorkInTeam: grade,
    abilityToMeetDeadlines: grade,
    interpersonalRelations: grade,
    punctuality: grade,
    conductBehavior: grade,

    ...baseCommonFields,
  });

  return schema.validate(data, { abortEarly: false });
};

// -------------------------------------------------------------
// GROUP B/C VALIDATION
// -------------------------------------------------------------
exports.validateReportingOfficerGroupBC = (data) => {
  const schema = Joi.object({
    employeeId: Joi.string().trim().required(),
    reportingOfficerId: Joi.string().trim().required(),

    accomplishmentOfWork: grade,
    qualityOfWork: grade,
    dataEntry: grade,
    knowledgeOfRule: grade,
    maintenanceOfRegisters: grade,
    coordinationAbility: grade,
    initiative: grade,
    proficiencyInComputerWork: grade,
    senseOfResponsibility: grade,
    communicationSkills: grade,
    abilityOfTeamWork: grade,
    abilityToMeetDeadlines: grade,
    interpersonalRelations: grade,
    punctuality: grade,
    behavior: grade,
    relationWithPublic: grade,
    training: grade,
    stateOfHealth: grade,
    integrity: grade,

    ...baseCommonFields,
  });

  return schema.validate(data, { abortEarly: false });
};
