const Joi = require("joi");

// 1–10 rating
const grade = Joi.number().min(1).max(10).required();

// -----------------------
// COMMON FIELDS
// -----------------------
const baseCommonFields = {
  reviewingOfficerId: Joi.string().trim().required(), // ⭐ ADD THIS LINE

  reportingOfficerId: Joi.string().trim().required(),
  employeeId: Joi.string().trim().required(),

  lengthOfService: Joi.string().trim().required(),

  agreeWithAssessment: Joi.string().valid("Yes", "No", "Partially").required(),

  disagreementReason: Joi.string().trim().allow("", "N/A"),

  penPictureByReviewingOfficer: Joi.string().trim().required(),

  numericalGradingOnPart3: Joi.number().min(0).max(10).required(),

  place: Joi.string().trim().required(),

  // frontend sends YYYY-MM-DD
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Date must be in YYYY-MM-DD format",
    }),

  signature: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  designation: Joi.string().trim().required(),

  submitted: Joi.boolean().optional(),

  verification: Joi.boolean().optional().default(false), // ⭐ OPTIONAL
  veerification: Joi.boolean().optional().default(false), // ⭐ OPTIONAL
};

// -----------------------
// GROUP A VALIDATION
// -----------------------
exports.validateReviewingOfficerGroupA = (data) => {
  const schema = Joi.object({
    ...baseCommonFields,

    independentAssessment: Joi.object({
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
    }).required(),
  });

  return schema.validate(data, { abortEarly: false });
};

// -----------------------
// GROUP BC VALIDATION
// -----------------------
exports.validateReviewingOfficerGroupBC = (data) => {
  const schema = Joi.object({
    ...baseCommonFields,

    independentAssessment: Joi.object({
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
    }).required(),
  });

  return schema.validate(data, { abortEarly: false });
};
