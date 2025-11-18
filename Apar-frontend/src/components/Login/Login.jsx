import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Login.module.css";
import api from "../../utils/api";
import logo from "../../assets/logo.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("");

  // ============================
  //   REQUEST OTP
  // ============================
  const handleRequestOtp = async () => {
    try {
      if (!role) return alert("Please select a role first");
      if (phone.length !== 10)
        return alert("Enter a valid 10-digit phone number");

      const response = await api.post("/auth/request", { phone, role });

      if (response.data.success) {
        alert("OTP sent successfully!");
        localStorage.setItem("otpTempToken", response.data.token);
        setShowOtp(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  // ============================
  //   VERIFY OTP
  // ============================
  const handleVerifyOtp = async () => {
    try {
      if (otp.length < 4) {
        alert("Enter a valid 4-digit OTP");
        return;
      }

      const otpToken = localStorage.getItem("otpTempToken");
      if (!otpToken) {
        alert("OTP session expired. Request OTP again.");
        return;
      }

      const response = await api.post("/auth/verify", {
        otp,
        token: otpToken,
      });

      if (response.data.success) {
        alert("Login successful!");

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.removeItem("otpTempToken");

        if (role === "employee") navigate("/employeeForm");
        else if (role === "reportingOfficer") navigate("/reporting-officer");
        else if (role === "reviewingOfficer") navigate("/reviewing-officer");
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* LEFT SIDE IMAGE */}
      <div className={styles.leftSection}>
        <img src={logo} alt="login-img" className={styles.loginImage} />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className={styles.rightSection}>
        <div className={`shadow-lg p-4 rounded ${styles.loginBox}`}>
          {/* ⭐ NEW HEADING */}
          <h2 className={styles.mainHeading}>Welcome to APAR</h2>

          <h3 className="text-center fw-bold mb-4">Login</h3>

          {/* ROLE SELECT BUTTONS */}
          <div className="d-flex justify-content-between mb-4">
            <button
              className={`btn ${
                role === "employee" ? "btn-dark" : "btn-outline-dark"
              } w-100 me-2`}
              onClick={() => setRole("employee")}
            >
              Employee
            </button>

            <button
              className={`btn ${
                role === "reportingOfficer" ? "btn-dark" : "btn-outline-dark"
              } w-100 me-2`}
              onClick={() => setRole("reportingOfficer")}
            >
              Reporting Officer
            </button>

            <button
              className={`btn ${
                role === "reviewingOfficer" ? "btn-dark" : "btn-outline-dark"
              } w-100`}
              onClick={() => setRole("reviewingOfficer")}
            >
              Reviewing Officer
            </button>
          </div>

          {/* PHONE NUMBER */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {!showOtp && (
            <button
              className="btn btn-primary w-100"
              onClick={handleRequestOtp}
            >
              Request OTP
            </button>
          )}

          {/* OTP FIELD */}
          {showOtp && (
            <>
              <div className="mb-3 mt-3">
                <label className="form-label fw-semibold">Enter OTP</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <button
                className="btn btn-success w-100"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
