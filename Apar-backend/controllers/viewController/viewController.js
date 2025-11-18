const {
  employeeFormModel,
} = require("../../models/employeeFormModel/employeeFormModel");
const {
  reportingOfficerModel,
} = require("../../models/reportingOfficerModel/reportingOfficerModel");
const { userModel } = require("../../models/userModel/userModel");

module.exports.getAllEmployeeForms = async (req, res) => {
  try {
    const { category } = req.params;
    const reportingOfficerId = req.user.id;

    // Validate category
    if (!["group-a", "group-bc"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Use: group-a | group-bc",
      });
    }

    // Fetch employees assigned under this reporting officer
    const assignedEmployees = await userModel.find({
      reportingOfficer: reportingOfficerId,
    });

    if (!assignedEmployees.length) {
      return res.status(404).json({
        success: false,
        message: "No employees assigned under your supervision.",
      });
    }

    // Extract userIds
    const employeeUserIds = assignedEmployees.map((emp) => emp._id);

    // Get their APAR employee forms
    const forms = await employeeFormModel
      .find({ userId: { $in: employeeUserIds } })
      .populate({
        path: "userId",
        select: "employeeId name designation department branch",
      })
      .sort({ createdAt: -1 });

    if (!forms.length) {
      return res.status(200).json({
        success: true,
        message: "No appraisal forms submitted yet.",
        totalForms: 0,
        employeeForms: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee APAR forms fetched successfully.",
      totalForms: forms.length,
      employeeForms: forms,
    });
  } catch (err) {
    console.error("❌ Error fetching employee forms:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching employee forms.",
      error: err.message,
    });
  }
};

module.exports.getSingleEmployeeForm = async (req, res) => {
  try {
    const { category, formId } = req.params;

    // Validate the category
    if (!["group-a", "group-bc"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Use: group-a | group-bc",
      });
    }

    // Fetch the form using universal employeeFormModel
    const form = await employeeFormModel
      .findById(formId)
      .populate({
        path: "userId",
        select: "employeeId name designation department branch",
      })
      .populate({
        path: "reportingOfficer",
        select: "name designation",
      })
      .populate({
        path: "reviewingOfficer",
        select: "name designation",
      });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      form,
    });
  } catch (error) {
    console.error("❌ View Single Employee Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching employee form",
      error: error.message,
    });
  }
};

module.exports.getAllReportingOfficerForms = async (req, res) => {
  try {
    const { category } = req.params;
    const reviewingOfficerId = req.user.id;

    // Validate category
    if (!["group-a", "group-bc"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Use: group-a | group-bc",
      });
    }

    //Find all employees assigned reviewing officer
    const assignedEmployees = await userModel.find({
      reviewingOfficer: reviewingOfficerId,
    });

    if (!assignedEmployees.length) {
      return res.status(404).json({
        success: false,
        message: "No employees assigned under your review.",
      });
    }

    // Extract employeeIds
    const employeeIds = assignedEmployees.map((emp) => emp.employeeId);

    const reportingForms = await reportingOfficerModel
      .find({ employeeId: { $in: employeeIds } })
      .populate({
        path: "reportingOfficerId",
        select: "name designation department branch",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalForms: reportingForms.length,
      reportingForms,
    });
  } catch (err) {
    console.error("❌ Error fetching reporting officer forms:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reporting officer forms.",
      error: err.message,
    });
  }
};

module.exports.getSingleReportingOfficerForm = async (req, res) => {
  try {
    const { category, formId } = req.params;

    // Validate
    if (!["group-a", "group-bc"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Use: group-a | group-bc",
      });
    }

    // Find the reporting officer form
    const form = await reportingOfficerModel.findById(formId);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Reporting Officer form not found.",
      });
    }

    const employee = await userModel
      .findOne({ employeeId: form.employeeId })
      .select("employeeId officerName designation department branch");

    return res.status(200).json({
      success: true,
      form,
      employeeDetails: employee || null,
    });
  } catch (error) {
    console.error("❌ getSingleReportingOfficerForm Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching the reporting officer form.",
      error: error.message,
    });
  }
};
