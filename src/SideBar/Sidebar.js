import React, { useState, useCallback, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Sidebar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); //  Sidebar Component 內部管理選單開關狀態

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const handleLogout = () => {
    console.log("登出");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      <div className="menu-icon" onClick={toggleMenu}>
        <i className="bi bi-list"></i>
      </div>

      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <ul className="menu-list">
          <li className="menu-item">設定</li>
          <li className="menu-item">報表</li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i> 登出
        </button>
      </div>
    </>
  );
}

export default Sidebar;
