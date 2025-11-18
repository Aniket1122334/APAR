import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import styles from "./ViewCardsReview.module.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ViewCardsReview() {
  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [popup, setPopup] = useState("");

  useEffect(() => {
    checkTokenAndFetch();
  }, []);

  // =====================================================
  // TOKEN EXPIRE HANDLER
  // =====================================================
  const expireAndRedirect = () => {
    setPopup("Session expired. Please login again.");
    setTimeout(() => {
      setPopup("");
      navigate("/");
    }, 1500);
  };

  // =====================================================
  // CHECK TOKEN FIRST
  // =====================================================
  const checkTokenAndFetch = () => {
    const token = localStorage.getItem("token");
    if (!token) return expireAndRedirect();

    try {
      const decoded = jwtDecode(token);
      fetchReportingOfficerForms(decoded.group.toLowerCase());
    } catch (err) {
      expireAndRedirect();
    }
  };

  // =====================================================
  // FETCH REPORTING OFFICER FORMS (DYNAMIC CATEGORY)
  // =====================================================
  const fetchReportingOfficerForms = async (category) => {
    try {
      const response = await api.get(
        `/view/group-${category}/reporting-officer`
      );

      if (response.data.success) {
        setForms(response.data.reportingForms || []);
        setMessage(response.data.message || "");
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) return expireAndRedirect();

      setError(
        err.response?.data?.message ||
          "Failed to fetch reporting officer forms."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI STATES
  // =====================================================
  if (loading)
    return <p className="text-center mt-4 fw-bold">Loading forms...</p>;

  if (error)
    return <p className="text-center mt-4 text-danger fw-bold">❌ {error}</p>;

  if (!forms.length)
    return (
      <p className="text-center mt-4 text-muted fw-bold">
        {message || "No reporting officer forms found."}
      </p>
    );

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className={`container mt-4 ${styles.pageWrapper}`}>
      {popup && <div className={styles.popup}>{popup}</div>}

      <h3 className="fw-bold text-center mb-4 text-primary">
        Reporting Officer Forms Assigned to You
      </h3>

      <div className="row g-4">
        {forms.map((form) => (
          <div key={form._id} className="col-md-6 col-lg-4">
            <div className={`${styles.cardBox} card shadow-sm`}>
              <div className="card-body">
                <h5 className={`fw-bold mb-3 ${styles.cardTitle}`}>
                  {form.name || "Employee"}
                </h5>

                <div className={styles.cardText}>
                  <p>
                    <strong>Reporting Officer ID:</strong>{" "}
                    {form.reportingOfficerId || "N/A"}
                  </p>
                  <p>
                    <strong>Designation:</strong> {form.designation || "N/A"}
                  </p>
                  <p>
                    <strong>Department:</strong> {form.department || "N/A"}
                  </p>
                  <p>
                    <strong>Branch:</strong> {form.branch || "N/A"}
                  </p>

                  <p className="mt-2">
                    <strong>Submitted On:</strong>{" "}
                    {form.submittedOn
                      ? new Date(form.submittedOn).toLocaleString()
                      : form.createdAt
                      ? new Date(form.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <button
                  className={`btn btn-primary w-100 mt-3 ${styles.reviewBtn}`}
                  onClick={() =>
                    navigate(`/reviewing-officer/groupA/reportForm/${form._id}`)
                  }
                >
                  Review This Form
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
