import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
import styles from "./ViewGroupAFullEmployeeForm.module.css";

export default function ViewGroupAFullForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForm();
  }, []);

  // ==========================
  // FETCH SINGLE FORM
  // ==========================
  const loadForm = async () => {
    try {
      const res = await api.get(`/view/group-a/forms/${id}`);

      if (res.data.success) {
        setForm(res.data.form);
      }
    } catch (err) {
      console.error("Error loading form:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-4 fw-bold">Loading...</p>;
  if (!form)
    return <p className="text-center text-danger fw-bold">Form not found</p>;

  const user = form.userId || {};

  console.log(form);

  return (
    <div
      className={`container my-4 p-4 shadow bg-white rounded ${styles.wrapper}`}
    >
      {/* =======================
          HEADER
      ========================= */}
      <div className="text-center mb-4">
        <img src={logo} alt="Logo" width="100" className="mb-3" />
        <h4 className="fw-bold text-primary">
          दिल्ली कौशल एवं उद्यमिता विश्वविद्यालय
        </h4>
        <h6 className="fw-bold">DELHI SKILL AND ENTREPRENEURSHIP UNIVERSITY</h6>
        <p className="text-muted small">
          (A State University under Govt. of NCT of Delhi)
        </p>

        <h5 className="fw-bold mt-3">
          ANNUAL PERFORMANCE APPRAISAL REPORT (APAR)
        </h5>
        <p className="text-secondary">Non-Academic & Technical Staff</p>
        <hr />
      </div>

      {/* =======================
          EMPLOYEE INFO
      ========================= */}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">Employee ID</label>
          <input
            className="form-control"
            readOnly
            value={user.employeeId || "N/A"}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Group</label>
          <input className="form-control" readOnly value="Group A" />
        </div>
      </div>

      <div className="mt-3">
        <label className="form-label fw-bold">Employee Name</label>
        <input
          className="form-control"
          readOnly
          value={form.officerName || "N/A"}
        />
      </div>

      <div className="mt-3">
        <label className="form-label fw-bold">Department & Branch</label>
        <input
          className="form-control"
          readOnly
          value={`${user.department || "N/A"} - ${user.branch || "N/A"}`}
        />
      </div>

      {/* =======================
          SECTION
      ========================= */}
      <h4 className={`fw-bold text-center mt-5 ${styles.sectionHeading}`}>
        Self Appraisal – Part 1
      </h4>

      {/* =======================
          TEXT AREAS
      ========================= */}
      <div className="mt-4">
        <label className="form-label fw-bold">1. Duty Description</label>
        <textarea
          className="form-control"
          rows={3}
          readOnly
          value={form.dutyDescription}
        />
      </div>

      <div className="mt-4">
        <label className="form-label fw-bold">2. Work Resume</label>
        <textarea
          className="form-control"
          rows={3}
          readOnly
          value={form.workResume}
        />
      </div>

      <div className="mt-4">
        <label className="form-label fw-bold">
          3. Extraordinary Responsibilities
        </label>
        <textarea
          className="form-control"
          rows={3}
          readOnly
          value={form.extraordinary}
        />
      </div>

      <div className="mt-4">
        <label className="form-label fw-bold">
          4. Extra Skills / Trainings
        </label>
        <textarea
          className="form-control"
          rows={3}
          readOnly
          value={form.extraSkill}
        />
      </div>

      {/* =======================
          PLACE & DATE
      ========================= */}
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

      {/* =======================
          SUBMITTED ON
      ========================= */}
      <p className="text-muted mt-3">
        <strong>Submitted On:</strong>{" "}
        {form.createdAt ? new Date(form.createdAt).toLocaleString() : "N/A"}
      </p>

      {/* =======================
          REPORT BUTTON
      ========================= */}
      <div className="text-center mt-4">
        <button
          className={`btn btn-primary px-4 py-2 ${styles.reviewBtn}`}
          onClick={() =>
            navigate(
              `/reporting-officer/groupA/report/${form.userId.employeeId}`
            )
          }
        >
          Report Form
        </button>
      </div>
    </div>
  );
}
