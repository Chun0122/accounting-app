import React, { useState, useCallback } from "react";

import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); //  Sidebar Component 內部管理選單開關狀態

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const menuItems = [
    {
      value: "homescreen",
      label: "首頁",
      icon: "fa fa-folder-open",
      path: "/",
    },
    {
      value: "categories",
      label: "帳務類別管理",
      icon: "fa fa-folder-open",
      path: "/categories",
    },
    // 之後補上
    // {
    //   value: "subcategories",
    //   label: "帳務子類別管理",
    //   icon: "fa fa-tags",
    //   path: "/subcategories",
    // },
    // {
    //   value: "paymentMethods",
    //   label: "付款方式管理",
    //   icon: "fa fa-credit-card",
    //   path: "/payment-methods",
    // },
    // {
    //   value: "currencies",
    //   label: "幣別管理",
    //   icon: "fa fa-coins",
    //   path: "/currencies",
    // },
  ];

  const handleLogout = () => {
    if (!window.confirm("是否確定要登出？")) return;
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      <div className="menu-icon" onClick={toggleMenu}>
        <i className="bi bi-list"></i>
      </div>

      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.value}
              className={`sidebar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <Link to={item.path || "#"} className="sidebar-link">
                {item.icon && <i className={`sidebar-icon ${item.icon}`}></i>}
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i> 登出
        </button>
      </div>
    </>
  );
}

export default Sidebar;
