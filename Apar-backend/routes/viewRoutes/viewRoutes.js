const express = require("express");
const router = express.Router();

const {
  getAllEmployeeForms,
  getSingleEmployeeForm,
  getAllReportingOfficerForms,
  getSingleReportingOfficerForm,
} = require("../../controllers/viewController/viewController");

router.get("/:category/forms", getAllEmployeeForms);

router.get("/:category/forms/:formId", getSingleEmployeeForm);

router.get("/:category/reporting-officer", getAllReportingOfficerForms);

router.get(
  "/:category/reviewing-officer/:formId",
  getSingleReportingOfficerForm
);

module.exports = router;
