const Joi = require("joi");

// Common date validation
const dateField = Joi.string()
  .trim()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .required()
  .messages({
    "string.pattern.base":
      "Date must be in format YYYY-MM-DD (e.g., 2025-11-09)",
  });

// Common fields used by both GROUP A & GROUP BC
const baseEmployeeFields = {
  officerName: Joi.string().trim().required(),
  dutyDescription: Joi.string().trim().required(),
  workResume: Joi.string().trim().required(),
  extraordinary: Joi.string().trim().allow(""),
  extraSkill: Joi.string().trim().allow(""),
  place: Joi.string().trim().required(),
  date: dateField,

  verification: Joi.boolean().default(false).required(),
};

exports.validateEmployeeFormGroupA = (data) => {
  const schema = Joi.object({
    ...baseEmployeeFields,
  });

  return schema.validate(data, { abortEarly: false });
};

exports.validateEmployeeFormGroupBC = (data) => {
  const schema = Joi.object({
    ...baseEmployeeFields,
  });

  return schema.validate(data, { abortEarly: false });
};
