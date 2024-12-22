// src/components/Sidebar/Sidebar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar({ isOpen, onToggleSidebar }) {
  const [showManagement, setShowManagement] = useState(false);

  const toggleManagement = () => {
    setShowManagement(!showManagement);
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onToggleSidebar}></div>}
      <aside className={`${styles.sidebar} ${isOpen ? styles.active : ""}`}>
        <div className={styles.logo}>
          <h2>Football Management</h2>
        </div>
        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <i className="fas fa-tachometer-alt"></i> Bảng điều khiển
          </NavLink>

          {/* Nhóm Quản lý giải đấu */}
          <div className={styles.navLink} onClick={toggleManagement}>
            <i className={`fas ${showManagement ? 'fa-caret-down' : 'fa-caret-right'}`}></i>
            Quản lý giải đấu
          </div>
          <div
            className={`${styles.management} ${showManagement ? styles.show : ""}`}
          >
            <NavLink
              to="/teams"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <i className="fas fa-users"></i> Đội bóng
            </NavLink>
            <NavLink
              to="/matches"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <i className="fas fa-futbol"></i> Trận đấu
            </NavLink>
            <NavLink
              to="/standings"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <i className="fas fa-list-ol"></i> Bảng xếp hạng
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <i className="fas fa-plus"></i> Thêm mới
            </NavLink>
            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <i className="fas fa-file-invoice"></i> Biên nhận lệ phí
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;