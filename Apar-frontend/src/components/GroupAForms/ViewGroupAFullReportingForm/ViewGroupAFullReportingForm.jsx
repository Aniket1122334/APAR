import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../../../assets/logo.jpg";
import styles from "./ViewGroupAFullReportingForm.module.css";

export default function ViewGroupAFullReportingForm() {
  const { id } = useParams(); // reporting officer form ID
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState("");

  useEffect(() => {
    verifyTokenAndFetch();
  }, []);

  // -------------------------------
  // TOKEN CHECK
  // -------------------------------
  const expireAndRedirect = () => {
    setPopup("Session expired. Redirecting to login...");
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/");
    }, 1500);
  };

  const verifyTokenAndFetch = () => {
    const token = localStorage.getItem("token");
    if (!token) return expireAndRedirect();

    try {
      const decoded = jwtDecode(token);
      const category = decoded.group.toLowerCase(); // group-a / group-bc

      loadReportingForm(category);
    } catch (err) {
      return expireAndRedirect();
    }
  };

  // -------------------------------
  // FETCH REPORTING OFFICER FORM
  // -------------------------------
  const loadReportingForm = async (category) => {
    try {
      const res = await api.get(
        `/view/group-${category}/reviewing-officer/${id}`
      );

      if (res.data.success) {
        setForm(res.data.form);
        setEmployee(res.data.employeeDetails);
      }
    } catch (err) {
      console.error("Error fetching reporting officer form:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(employee);

  if (loading) return <p className="text-center fw-bold mt-4">Loading...</p>;

  if (!form)
    return (
      <p className="text-center text-danger fw-bold mt-4">
        Reporting Officer Form Not Found
      </p>
    );

  return (
    <div
      className={`container my-4 p-4 shadow bg-white rounded ${styles.wrapper}`}
    >
      {popup && <div className={styles.popup}>{popup}</div>}

      {/* =================== HEADER =================== */}
      <div className="text-center mb-4">
        <img src={logo} alt="Logo" width="100" className="mb-3" />

        <h4 className="fw-bold text-primary">
          दिल्ली कौशल एवं उद्यमिता विश्वविद्यालय
        </h4>

        <h6 className="fw-bold">DELHI SKILL AND ENTREPRENEURSHIP UNIVERSITY</h6>
        <p className="text-muted small">
          (A State University under Govt. of NCT of Delhi)
        </p>

        <h5 className="fw-bold mt-3">APAR – Reporting Officer Assessment</h5>
        <p className="text-secondary">Group A – Part 3</p>

        <hr />
      </div>

      {/* =================== EMPLOYEE INFO =================== */}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">Employee ID</label>
          <input className="form-control" readOnly value={form.employeeId} />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Employee Name</label>
          <input
            className="form-control"
            readOnly
            value={employee?.officerName || "N/A"}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Department</label>
          <input
            className="form-control"
            readOnly
            value={employee?.department || "N/A"}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Branch</label>
          <input
            className="form-control"
            readOnly
            value={employee?.branch || "N/A"}
          />
        </div>
      </div>

      {/* =================== OFFICER INFO =================== */}
      <h5 className={`fw-bold mt-5 mb-2 ${styles.sectionHeading}`}>
        Reporting Officer Details
      </h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">Reporting Officer ID</label>
          <input
            className="form-control"
            readOnly
            value={form.reportingOfficerId}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Officer Name</label>
          <input className="form-control" readOnly value={form.name} />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Designation</label>
          <input className="form-control" readOnly value={form.designation} />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Department</label>
          <input className="form-control" readOnly value={form.department} />
        </div>
      </div>

      {/* =================== RATINGS =================== */}
      <h5 className={`fw-bold mt-5 mb-2 ${styles.sectionHeading}`}>
        Performance Ratings (1–10)
      </h5>

      <div className="row g-3">
        {[
          "accomplishmentOfWork",
          "qualityOfWork",
          "knowledgeOfRules",
          "practicalApplication",
          "coordinationAbility",
          "initiative",
          "senseOfResponsibility",
          "communicationSkills",
          "analyticalAbility",
          "abilityToWorkInTeam",
          "abilityToMeetDeadlines",
          "interpersonalRelations",
          "punctuality",
          "conductBehavior",
        ].map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label fw-bold">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input className="form-control" readOnly value={form[field]} />
          </div>
        ))}
      </div>

      {/* =================== TEXT FIELDS =================== */}
      <div className="mt-4">
        <label className="form-label fw-bold">Pen Picture</label>
        <textarea
          className="form-control"
          rows={3}
          readOnly
          value={form.penPictureByReportingOfficer}
        />
      </div>

      <div className="mt-4">
        <label className="form-label fw-bold">Overall Remarks</label>
        <textarea
          className="form-control"
          rows={3}
          readOnly
          value={form.overallRemarks}
        />
      </div>

      {/* =================== PLACE & DATE =================== */}
      <div className="row mt-4 g-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">Place</label>
          <input className="form-control" readOnly value={form.place} />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Date</label>
          <input className="form-control" readOnly value={form.date} />
        </div>
      </div>

      {/* =================== SUBMITTED ON =================== */}
      <p className="text-muted mt-3">
        <strong>Submitted On:</strong>{" "}
        {form.submittedOn ? new Date(form.submittedOn).toLocaleString() : "N/A"}
      </p>

      {/* =================== REVIEW BUTTON =================== */}
      <div className="text-center mt-4">
        <button
          className="btn btn-primary px-4 py-2"
          onClick={() =>
            navigate(`/reviewing-officer/groupA/reviewForm/${form._id}`)
          }
        >
          Review Form
        </button>
      </div>
    </div>
  );
}
