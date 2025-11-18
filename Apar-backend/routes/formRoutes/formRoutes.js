const express = require("express");
const router = express.Router();

const {
  createEmployeeForm,
  createReportingOfficerForm,
  createReviewingOfficerForm,
} = require("../../controllers/CreateForms/CreateForms");

router.post("/:category/employee", createEmployeeForm);

router.post("/:category/reporting-officer", createReportingOfficerForm);

router.post("/:category/reviewing-officer", createReviewingOfficerForm);

module.exports = router;
