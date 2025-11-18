import React from "react";
import styles from "./Navbar.module.css";
import logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      {/* LEFT - LOGO */}
      <div className={styles.left}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.appName}>APAR Portal</span>
      </div>

      {/* RIGHT - LOGOUT */}
      <div className={styles.right}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
