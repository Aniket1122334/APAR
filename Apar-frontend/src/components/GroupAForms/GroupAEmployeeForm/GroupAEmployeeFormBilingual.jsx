import React, { useState, useEffect } from "react";
import styles from "./GroupAEmployeeFormBilingual.module.css";
import logo from "../../../assets/logo.jpg";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function GroupAEmployeeFormBilingual() {
  const navigate = useNavigate();

  // FORM DATA
  const [formData, setFormData] = useState({
    employeeId: "",
    officerName: "",
    department: "",
    branch: "",
    reportPeriod: "",
    absencePeriod: "",
    dutyDescription: "",
    workResume: "",
    extraordinary: "",
    extraSkill: "",
    place: "",
    date: "",
    declarationAccepted: false,
    verification: false,
  });

  const [userGroup, setUserGroup] = useState("");
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState("");

  // ⭐ PRINT BUTTON STATE
  const [submitted, setSubmitted] = useState(false);

  // ⭐ SUCCESS POPUP STATE
  const [successPopup, setSuccessPopup] = useState("");

  // ⭐ PRINT FUNCTION
  const handlePrint = () => {
    window.print();
  };

  // POPUP + REDIRECT
  const expireAndRedirect = () => {
    setPopup("Session expired. Redirecting to login...");
    setTimeout(() => {
      setPopup("");
      navigate("/");
    }, 1500);
  };

  // LOAD USER DATA
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      expireAndRedirect();
      return;
    }

    try {
      const decoded = jwtDecode(token);

      setUserGroup(decoded.group);

      setFormData((prev) => ({
        ...prev,
        employeeId: decoded.employeeId || "",
        officerName: decoded.name || "",
        department: decoded.department || "",
        branch: decoded.branch || "",
        reportPeriod: decoded.reportPeriod || "",
        absencePeriod: decoded.absencePeriod || "",
      }));
    } catch (err) {
      expireAndRedirect();
    }
  }, []);

  // INPUT HANDLER
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    if (name === "declarationAccepted") {
      setFormData((prev) => ({
        ...prev,
        declarationAccepted: checked,
        verification: checked ? true : false,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!formData.dutyDescription.trim())
      newErrors.dutyDescription = "Please fill this field";

    if (!formData.workResume.trim())
      newErrors.workResume = "Please fill this field";

    if (!formData.extraordinary.trim())
      newErrors.extraordinary = "Please fill this field";

    if (!formData.extraSkill.trim())
      newErrors.extraSkill = "Please fill this field";

    if (!formData.place.trim()) newErrors.place = "Please fill this field";

    if (!formData.date.trim()) newErrors.date = "Please fill this field";

    if (!formData.declarationAccepted)
      newErrors.declarationAccepted =
        "You must accept the declaration to submit the form.";

    setErrors(newErrors);
    return newErrors;
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      expireAndRedirect();
      return;
    }

    let decoded = null;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      expireAndRedirect();
      return;
    }

    if (decoded.group.toUpperCase() !== "A") {
      alert("Only Group A employees can submit this APAR form.");
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      const el = document.getElementsByName(firstError)[0];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

      setPopup(validationErrors[firstError]);
      setTimeout(() => setPopup(""), 2000);
      return;
    }

    const category = decoded.group.toLowerCase();

    try {
      const payload = {
        officerName: formData.officerName,
        dutyDescription: formData.dutyDescription,
        workResume: formData.workResume,
        extraordinary: formData.extraordinary,
        extraSkill: formData.extraSkill,
        place: formData.place,
        date: formData.date,
        verification: formData.verification,
      };

      const response = await api.post(
        `/form/group-${category}/employee`,
        payload
      );

      if (response.data.success) {
        setSubmitted(true);

        // ⭐ SUCCESS POPUP
        setSuccessPopup("Form Submitted Successfully!");
        setTimeout(() => setSuccessPopup(""), 2000);
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Form submission failed. Please try again."
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        expireAndRedirect();
      }
    }
  };

  return (
    <div
      className={`container my-4 p-4 shadow rounded bg-white ${styles.outer}`}
    >
      {/* ERROR POPUP */}
      {popup && <div className={styles.popup}>{popup}</div>}

      {/* SUCCESS POPUP */}
      {successPopup && <div className={styles.popupCenter}>{successPopup}</div>}

      {/* HEADER */}
      <div className="text-center mb-4">
        <img src={logo} alt="DSEU Logo" width="100" className="mb-2" />
        <h5 className="fw-bold text-primary">
          दिल्ली कौशल एवं उद्यमिता विश्वविद्यालय
        </h5>
        <h6>DELHI SKILL AND ENTREPRENEURSHIP UNIVERSITY</h6>
        <p className="text-muted small">
          (A State University under Govt. of NCT of Delhi)
        </p>
        <h6 className="fw-bold mt-3">
          वार्षिक कार्य निष्पादन मूल्यांकन रिपोर्ट (एपीएआर)
        </h6>
        <h6>ANNUAL PERFORMANCE APPRAISAL REPORT (APAR)</h6>
        <p className="fw-bold text-secondary">
          NON-ACADEMIC STAFF AND TECHNICAL STAFF
        </p>
      </div>

      {/* MAIN FORM */}
      <form onSubmit={handleSubmit}>
        {/* BASIC FIELDS */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              कर्मचारी पहचान संख्या / Employee ID:
            </label>
            <input
              className="form-control"
              value={formData.employeeId}
              readOnly
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">समूह / Group</label>
            <input className="form-control" value="Group A" readOnly />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            अधिकारी का नाम एवं पदनाम / Name of the Officer & Designation:
          </label>
          <input
            className="form-control"
            value={formData.officerName}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            विभाग एवं शाखा / Department & Branch:
          </label>
          <input
            className="form-control"
            value={`${formData.department}${
              formData.branch ? " - " + formData.branch : ""
            }`}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            संबंधित वर्ष / अवधि का प्रतिवेदन / Report for the Period
          </label>
          <input
            className="form-control"
            value={formData.reportPeriod}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">
            वर्ष के दौरान छुट्टी / Absence Period
          </label>
          <input
            className="form-control"
            value={formData.absencePeriod}
            readOnly
          />
        </div>

        {/* SELF APPRAISAL */}
        <h4 className="fw-bold text-center mt-4">
          स्व-मूल्यांकन / Self Appraisal
        </h4>

        <div className="mb-4">
          <label className="form-label fw-bold">
            1. कार्यों का संक्षिप्त विवरण / Brief description of the duties:
          </label>
          <textarea
            className="form-control"
            rows={4}
            name="dutyDescription"
            value={formData.dutyDescription}
            onChange={handleChange}
          />
          {errors.dutyDescription && (
            <p className={styles.error}>{errors.dutyDescription}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">
            2. किए गए कार्य का सारांश / Brief resume of work:
          </label>
          <textarea
            className="form-control"
            rows={4}
            name="workResume"
            value={formData.workResume}
            onChange={handleChange}
          />
          {errors.workResume && (
            <p className={styles.error}>{errors.workResume}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">
            3. असाधारण उत्तरदायित्व / Extraodinary responsibility:
          </label>
          <textarea
            className="form-control"
            rows={4}
            name="extraordinary"
            value={formData.extraordinary}
            onChange={handleChange}
          />
          {errors.extraordinary && (
            <p className={styles.error}>{errors.extraordinary}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">
            4. अतिरिक्त कौशल / Extra Skill:
          </label>
          <textarea
            className="form-control"
            rows={4}
            name="extraSkill"
            value={formData.extraSkill}
            onChange={handleChange}
          />
          {errors.extraSkill && (
            <p className={styles.error}>{errors.extraSkill}</p>
          )}
        </div>

        {/* PLACE & DATE */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="fw-bold">स्थान / Place</label>
            <input
              type="text"
              className="form-control"
              name="place"
              value={formData.place}
              onChange={handleChange}
            />
            {errors.place && <p className={styles.error}>{errors.place}</p>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="fw-bold">दिनांक / Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <p className={styles.error}>{errors.date}</p>}
          </div>
        </div>

        {/* DECLARATION */}
        <div className="mb-4">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="declarationAccepted"
              name="declarationAccepted"
              checked={formData.declarationAccepted}
              onChange={handleChange}
            />
            <label className="form-check-label ms-2">
              I hereby declare that all information provided above is correct.
            </label>
          </div>
          {errors.declarationAccepted && (
            <p className={styles.error}>{errors.declarationAccepted}</p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="text-center mt-3 no-print">
          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={!formData.declarationAccepted}
          >
            Submit APAR Form
          </button>
        </div>
      </form>

      {/* PRINT BUTTON */}
      {submitted && (
        <div className={`${styles.printWrapper} no-print mt-4`}>
          <button className={styles.printButton} onClick={handlePrint}>
            🖨 Print Submitted Form
          </button>
        </div>
      )}
    </div>
  );
}
