import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./GroupAReportingOfficerForm.module.css";
import { jwtDecode } from "jwt-decode";

export default function GroupAReportingOfficerForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [officerId, setOfficerId] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Popup
  const [popupMessage, setPopupMessage] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    reportingOfficerId: "",
    accomplishmentOfWork: "",
    qualityOfWork: "",
    knowledgeOfRules: "",
    practicalApplication: "",
    coordinationAbility: "",
    initiative: "",
    senseOfResponsibility: "",
    communicationSkills: "",
    analyticalAbility: "",
    abilityToWorkInTeam: "",
    abilityToMeetDeadlines: "",
    interpersonalRelations: "",
    punctuality: "",
    conductBehavior: "",
    penPictureByReportingOfficer: "",
    overallRemarks: "",
    place: "",
    date: "",
    declarationAccepted: false,
  });

  // ⭐ Hindi + English Rating Fields
  const ratingFields = [
    {
      key: "accomplishmentOfWork",
      label: "योजना/आवंटित कार्य की पूर्ति / Accomplishment of Work",
    },
    { key: "qualityOfWork", label: "कार्य की गुणवत्ता / Quality of Work" },
    {
      key: "knowledgeOfRules",
      label:
        "नियम/विनियम/प्रक्रियाओं का ज्ञान व अनुप्रयोग / Knowledge of Rules & Procedures",
    },
    {
      key: "practicalApplication",
      label: "व्यावहारिक अनुप्रयोग / Practical Application",
    },
    {
      key: "coordinationAbility",
      label: "समन्वय क्षमता / Coordination Ability",
    },
    { key: "initiative", label: "पहल / Initiative" },
    {
      key: "senseOfResponsibility",
      label: "उत्तरदायित्व की भावना / Sense of Responsibility",
    },
    { key: "communicationSkills", label: "संचार कौशल / Communication Skills" },
    {
      key: "analyticalAbility",
      label: "विश्लेषणात्मक क्षमता / Analytical Ability",
    },
    {
      key: "abilityToWorkInTeam",
      label: "टीम में कार्य करने की क्षमता / Team Work Ability",
    },
    {
      key: "abilityToMeetDeadlines",
      label: "समय सीमा का पालन / Ability to Meet Deadlines",
    },
    {
      key: "interpersonalRelations",
      label: "अंतरवैयक्तिक संबंध / Interpersonal Relations",
    },
    { key: "punctuality", label: "समयपालन / Punctuality" },
    { key: "conductBehavior", label: "आचरण एवं व्यवहार / Conduct & Behaviour" },
  ];

  // PRINT PDF
  const handlePrint = () => {
    window.print();
  };

  // Load token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    const decoded = jwtDecode(token);

    setOfficerId(decoded.employeeId);

    setFormData((prev) => ({
      ...prev,
      employeeId: id,
      reportingOfficerId: decoded.employeeId,
    }));
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (
        key !== "declarationAccepted" &&
        (!formData[key] || String(formData[key]).trim() === "")
      ) {
        newErrors[key] = "Please fill this field";
      }
    });

    if (!formData.declarationAccepted) {
      newErrors.declarationAccepted = "You must accept the declaration.";
    }

    setErrors(newErrors);
    return newErrors;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const first = Object.keys(validationErrors)[0];
      document
        .getElementsByName(first)[0]
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Convert rating fields → Number
    const numericData = { ...formData };
    ratingFields.forEach((f) => {
      numericData[f.key] = Number(numericData[f.key]);
    });

    try {
      const res = await api.post(
        `/form/group-a/reporting-officer`,
        numericData
      );

      if (res.data.success) {
        setSubmitted(true);

        setPopupMessage("✔ Reporting Officer Form Submitted Successfully!");
        setTimeout(() => setPopupMessage(""), 2000);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Submission Failed");
    }
  };

  return (
    <div
      className={`container my-4 p-4 shadow bg-white rounded ${styles.wrapper}`}
    >
      {/* Center Popup */}
      {popupMessage && <div className={styles.popupCenter}>{popupMessage}</div>}

      <h3 className="text-center fw-bold mb-4 text-primary no-print">
        Reporting Officer – Group A
      </h3>

      <form onSubmit={handleSubmit}>
        {/* EMPLOYEE DETAILS */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">
              कर्मचारी पहचान संख्या / Employee ID
            </label>
            <input
              className="form-control"
              value={formData.employeeId}
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">
              प्रतिवेदन अधिकारी पहचान संख्या / Reporting Officer ID
            </label>
            <input className="form-control" value={officerId} readOnly />
          </div>
        </div>

        {/* RATING FIELDS */}
        <h5 className="fw-bold mt-4">Performance Ratings (1–10)</h5>

        <div className="row mt-2 g-3">
          {ratingFields.map((field) => (
            <div className="col-md-6" key={field.key}>
              <label className="form-label fw-bold">{field.label}</label>

              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                name={field.key}
                value={formData[field.key]}
                onChange={handleChange}
              />

              {errors[field.key] && (
                <p className={styles.error}>{errors[field.key]}</p>
              )}
            </div>
          ))}
        </div>

        {/* PEN PICTURE */}
        <div className="mt-4">
          <label className="form-label fw-bold">
            प्रतिवेदन अधिकारी द्वारा संक्षिप्त विवरण / Pen Picture
          </label>
          <textarea
            rows="3"
            name="penPictureByReportingOfficer"
            className="form-control"
            value={formData.penPictureByReportingOfficer}
            onChange={handleChange}
          />
        </div>

        {/* OVERALL REMARKS */}
        <div className="mt-4">
          <label className="form-label fw-bold">
            समग्र टिप्पणी / Overall Remarks
          </label>
          <textarea
            rows="3"
            name="overallRemarks"
            className="form-control"
            value={formData.overallRemarks}
            onChange={handleChange}
          />
        </div>

        {/* PLACE & DATE */}
        <div className="row mt-4">
          <div className="col-md-6">
            <label className="form-label fw-bold">स्थान / Place</label>
            <input
              name="place"
              className="form-control"
              value={formData.place}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">दिनांक / Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DECLARATION */}
        <div className="mt-4">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="declarationAccepted"
              checked={formData.declarationAccepted}
              onChange={handleChange}
            />
            <label className="form-check-label ms-2">
              I hereby declare that all information provided above is true.
            </label>
          </div>
          {errors.declarationAccepted && (
            <p className={styles.error}>{errors.declarationAccepted}</p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="text-center mt-4 no-print">
          <button
            className="btn btn-primary px-4"
            disabled={!formData.declarationAccepted}
          >
            Submit Report
          </button>
        </div>
      </form>

      {/* PRINT BUTTON */}
      {submitted && (
        <div className="text-center mt-4 no-print">
          <button className={styles.printButton} onClick={handlePrint}>
            🖨 Print Submitted Form
          </button>
        </div>
      )}
    </div>
  );
}
