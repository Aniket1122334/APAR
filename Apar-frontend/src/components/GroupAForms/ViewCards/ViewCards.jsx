import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import styles from "./ViewCards.module.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ViewCards() {
  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [popup, setPopup] = useState(""); // ⭐ Popup state

  useEffect(() => {
    checkTokenAndFetch();
  }, []);

  // =====================================================
  // 🔥 TOKEN CHECK + REDIRECT HANDLER
  // =====================================================
  const expireAndRedirect = () => {
    setPopup("Session expired. Please login again.");
    setTimeout(() => {
      setPopup("");
      navigate("/");
    }, 1500);
  };

  const checkTokenAndFetch = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      expireAndRedirect();
      return;
    }

    try {
      jwtDecode(token); // just to verify token
      fetchForms(); // safe to fetch
    } catch (err) {
      expireAndRedirect();
    }
  };

  // =====================================================
  // FETCH EMPLOYEE FORMS
  // =====================================================
  const fetchForms = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        expireAndRedirect();
        return;
      }

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        expireAndRedirect();
        return;
      }

      const cat = decoded.group.toLowerCase(); // a/b/c

      const response = await api.get(`/view/group-${cat}/forms`);

      if (response.data.success) {
        setForms(response.data.employeeForms || []);
        setMessage(response.data.message || "");
      } else {
        setMessage(response.data.message || "No forms found.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        expireAndRedirect();
        return;
      }

      setError(err.response?.data?.message || "Failed to fetch forms.");
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
        {message || "No forms submitted yet."}
      </p>
    );

  return (
    <div className="container mt-4">
      {/* ⭐ GLOBAL POPUP MESSAGE */}
      {popup && <div className={styles.popup}>{popup}</div>}

      <h3 className="fw-bold text-center mb-4">
        Employee Forms Assigned to You
      </h3>

      <div className="row g-4">
        {forms.map((form) => {
          const user = form.userId || {};

          return (
            <div key={form._id} className="col-md-6 col-lg-4">
              <div className={`${styles.cardBox} card`}>
                <div className="card-body">
                  <h5 className={`fw-bold ${styles.cardTitle}`}>
                    {form.officerName || "Unnamed Employee"}
                  </h5>

                  <div className={styles.cardText}>
                    <p>
                      <strong>Employee ID:</strong> {user.employeeId || "N/A"}
                    </p>
                    <p>
                      <strong>Designation:</strong> {user.designation || "N/A"}
                    </p>
                    <p>
                      <strong>Department:</strong> {user.department || "N/A"}
                    </p>
                    <p>
                      <strong>Branch:</strong> {user.branch || "N/A"}
                    </p>

                    <p className="mt-2">
                      <strong>Submitted On:</strong>{" "}
                      {form.createdAt
                        ? new Date(form.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <button
                    className="btn btn-primary mt-3 w-100"
                    onClick={() =>
                      navigate(`/reporting-officer/groupA/form/${form._id}`)
                    }
                  >
                    View Full Form
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
