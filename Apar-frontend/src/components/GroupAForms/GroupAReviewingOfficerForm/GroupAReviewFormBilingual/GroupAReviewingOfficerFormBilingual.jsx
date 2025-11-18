import React, { useEffect, useState } from "react";
import api from "../../../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styles from "./GroupAReviewingOfficerFormBilingual.module.css";

export default function GroupAReviewingOfficerFormBilingual() {
  const { id } = useParams(); // reportingOfficerId
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [declaration, setDeclaration] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");

  const [formData, setFormData] = useState({
    lengthOfService: "",
    agreeWithAssessment: "",
    disagreementReason: "",
    penPictureByReviewingOfficer: "",
    numericalGradingOnPart3: "",
    place: "",
    date: "",
    signature: "",
    name: "",
    designation: "",
  });

  const [ratings, setRatings] = useState({
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
  });

  const ratingFields = Object.keys(ratings);

  // ⭐ PRINT FUNCTION
  const handlePrint = () => {
    window.print();
  };

  // ============================
  // LOAD TOKEN + RO FORM
  // ============================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const decoded = jwtDecode(token);

      setFormData((prev) => ({
        ...prev,
        name: decoded.name,
        designation: decoded.designation,
        place: decoded.branch || "",
      }));

      loadReportingForm();
    } catch (err) {
      return navigate("/");
    }
  }, []);

  const loadReportingForm = async () => {
    try {
      const res = await api.get(`/view/group-a/reviewing-officer/${id}`);

      if (res.data.success) {
        const form = res.data.form;
        setReportData(form);

        setRatings({
          accomplishmentOfWork: form.accomplishmentOfWork || "",
          qualityOfWork: form.qualityOfWork || "",
          knowledgeOfRules: form.knowledgeOfRules || "",
          practicalApplication: form.practicalApplication || "",
          coordinationAbility: form.coordinationAbility || "",
          initiative: form.initiative || "",
          senseOfResponsibility: form.senseOfResponsibility || "",
          communicationSkills: form.communicationSkills || "",
          analyticalAbility: form.analyticalAbility || "",
          abilityToWorkInTeam: form.abilityToWorkInTeam || "",
          abilityToMeetDeadlines: form.abilityToMeetDeadlines || "",
          interpersonalRelations: form.interpersonalRelations || "",
          punctuality: form.punctuality || "",
          conductBehavior: form.conductBehavior || "",
        });
      }
    } catch (err) {
      console.log("Error loading reporting data", err);
    }
  };

  // ============================
  // HANDLERS
  // ============================
  const handleChange = (e) => {
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (e) => {
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
    setRatings({ ...ratings, [e.target.name]: e.target.value });
  };

  // ============================
  // VALIDATION
  // ============================
  const validateForm = () => {
    let newErrors = {};

    ratingFields.forEach((field) => {
      if (!ratings[field] || String(ratings[field]).trim() === "") {
        newErrors[field] = "Please fill rating (1–10)";
      }
    });

    Object.keys(formData).forEach((key) => {
      if (!formData[key] || String(formData[key]).trim() === "") {
        newErrors[key] = "Please fill this field";
      }
    });

    if (!declaration) {
      newErrors.declaration = "You must accept the declaration.";
    }

    setErrors(newErrors);
    return newErrors;
  };

  // ============================
  // SUBMIT
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const first = Object.keys(validationErrors)[0];
      document.getElementsByName(first)[0]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const fixedRatings = { ...ratings };
    ratingFields.forEach((f) => (fixedRatings[f] = Number(fixedRatings[f])));

    const payload = {
      reportingOfficerId: reportData.reportingOfficerId,
      employeeId: reportData.employeeId,

      lengthOfService: formData.lengthOfService,
      agreeWithAssessment: formData.agreeWithAssessment,
      disagreementReason: formData.disagreementReason,

      independentAssessment: fixedRatings,

      penPictureByReviewingOfficer: formData.penPictureByReviewingOfficer,
      numericalGradingOnPart3: Number(formData.numericalGradingOnPart3),

      place: formData.place,
      date: formData.date,
      signature: formData.signature,
      name: formData.name,
      designation: formData.designation,

      verification: declaration,
    };

    try {
      const res = await api.post(`/form/group-a/reviewing-officer`, payload);

      if (res.data.success) {
        setSubmitted(true);

        // ⭐ Show popup
        setPopupMessage("Review Submitted Successfully!");
        setTimeout(() => setPopupMessage(""), 1000); // hide after 1 sec
      }
    } catch (err) {
      console.log("❌ FULL API ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  if (!reportData)
    return <p className="text-center fw-bold mt-4">Loading...</p>;

  return (
    <div className="container my-4 p-4 shadow bg-white rounded">
      {/* ⭐ POPUP CENTER SCREEN */}
      {popupMessage && <div className={styles.popupCenter}>{popupMessage}</div>}

      <h3 className="fw-bold text-primary text-center mb-4 no-print">
        Reviewing Officer – Group A
      </h3>

      <form onSubmit={handleSubmit}>
        <h5 className="fw-bold mb-3">Independent Assessment (1–10)</h5>

        <div className="row g-3">
          {ratingFields.map((field) => (
            <div className="col-md-6" key={field}>
              <label className="form-label fw-bold">
                {field.replace(/([A-Z])/g, " $1")}
              </label>

              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                name={field}
                value={ratings[field]}
                onChange={handleRatingChange}
              />

              {errors[field] && <p className={styles.error}>{errors[field]}</p>}
            </div>
          ))}
        </div>

        <hr />

        <div className="mb-3">
          <label className="fw-bold">Length of Service</label>
          <textarea
            className="form-control"
            name="lengthOfService"
            value={formData.lengthOfService}
            onChange={handleChange}
          />
          {errors.lengthOfService && (
            <p className={styles.error}>{errors.lengthOfService}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="fw-bold">Agree With Assessment?</label>
          <select
            className="form-control"
            name="agreeWithAssessment"
            value={formData.agreeWithAssessment}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Partially">Partially</option>
            <option value="No">No</option>
          </select>
          {errors.agreeWithAssessment && (
            <p className={styles.error}>{errors.agreeWithAssessment}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="fw-bold">Disagreement Reason</label>
          <textarea
            className="form-control"
            name="disagreementReason"
            value={formData.disagreementReason}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="fw-bold">Pen Picture (100 words)</label>
          <textarea
            className="form-control"
            maxLength="100"
            name="penPictureByReviewingOfficer"
            value={formData.penPictureByReviewingOfficer}
            onChange={handleChange}
          />
          {errors.penPictureByReviewingOfficer && (
            <p className={styles.error}>
              {errors.penPictureByReviewingOfficer}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="fw-bold">Numerical Grading (0–10)</label>
          <input
            type="number"
            min="0"
            max="10"
            name="numericalGradingOnPart3"
            className="form-control"
            value={formData.numericalGradingOnPart3}
            onChange={handleChange}
          />
          {errors.numericalGradingOnPart3 && (
            <p className={styles.error}>{errors.numericalGradingOnPart3}</p>
          )}
        </div>

        <hr />

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="fw-bold">Place</label>
            <input
              className="form-control"
              name="place"
              value={formData.place}
              onChange={handleChange}
            />
            {errors.place && <p className={styles.error}>{errors.place}</p>}
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-bold">Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <p className={styles.error}>{errors.date}</p>}
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-bold">Signature</label>
            <input
              className="form-control"
              name="signature"
              value={formData.signature}
              onChange={handleChange}
            />
            {errors.signature && (
              <p className={styles.error}>{errors.signature}</p>
            )}
          </div>
        </div>

        {/* NAME / DESIGNATION */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="fw-bold">Name</label>
            <input
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="fw-bold">Designation</label>
            <input
              name="designation"
              className="form-control"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DECLARATION CHECKBOX */}
        <div className="my-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="declaration"
              name="declaration"
              checked={declaration}
              onChange={(e) => {
                setDeclaration(e.target.checked);
                if (errors.declaration) {
                  setErrors((prev) => ({ ...prev, declaration: "" }));
                }
              }}
            />

            <label className="form-check-label ms-2" htmlFor="declaration">
              I hereby declare that all information provided above has been
              filled in by me, and I take full responsibility for its accuracy.
            </label>
          </div>

          {errors.declaration && (
            <p className={styles.error}>{errors.declaration}</p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="text-center mt-3 no-print">
          <button className="btn btn-primary px-4" disabled={!declaration}>
            Submit Final Review
          </button>
        </div>
      </form>

      {/* ⭐ PRINT BUTTON AFTER SUBMISSION */}
      {submitted && (
        <div className="text-center mt-4 no-print">
          <button className={styles.printButton} onClick={handlePrint}>
            🖨 Print Submitted Review
          </button>
        </div>
      )}
    </div>
  );
}
