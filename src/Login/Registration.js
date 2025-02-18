import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.css";

function Registration() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); //  新增確認密碼 state
  const [email, setEmail] = useState(""); //  新增 Email state

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    //  如果驗證通過，才發送 API 請求
    if (password !== confirmPassword) {
      alert("密碼與確認密碼不一致。");
      return; //  停止提交表單
    }

    const registrationData = {
      username: username,
      password: password,
      email: email,
      //  其他註冊欄位
    };

    fetch("/api/Auth/Register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    })
      .then((response) => {
        if (response.ok) {
          //  註冊成功
          console.log("註冊成功");
          alert("註冊成功！請前往登入頁面登入。");
          navigate("/login"); // 導向到 /login 路徑
        } else {
          //  註冊失敗
          console.error(
            "註冊失敗，伺服器錯誤或其他錯誤，狀態碼:",
            response.status
          );
          alert("註冊失敗，請稍後再試。");
          //  TODO:  可以根據後端返回的錯誤訊息，顯示更具體的錯誤提示
        }
      })
      .catch((error) => {
        console.error("網路錯誤或其他錯誤", error);
        alert("網路錯誤，請檢查網路連線。");
      });
  };

  return (
    <div className="registration-container">
      <div className="registration-form-container">
        <h2>註冊帳號</h2>
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">帳號:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="請輸入帳號"
              required //  加入 HTML5 驗證，必填欄位
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">密碼:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="請輸入密碼"
              required
              minLength="6" //  密碼最小長度限制
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">確認密碼:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="再次輸入密碼"
              required
              minLength="6"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="請輸入 Email (選填)"
              // email type 輸入框會自動進行簡單的 Email 格式驗證
            />
          </div>
          <button type="submit" className="registration-button">
            註冊
          </button>
        </form>
        <div className="registration-actions">
          <Link to="/login" className="back-to-login-button">
            返回登入畫面
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registration;
