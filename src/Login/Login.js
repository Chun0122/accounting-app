import React, { useState } from "react";
import "./Login.css";

import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginData = {
      username: username,
      password: password,
    };

    fetch("/api/Auth/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (response.ok) {
          //  登入成功
          console.log("登入成功");
          // alert('登入成功！'); //  移除提示訊息

          response.json().then((data) => {
            const token = data.token; // 從 Response Body 中取得 token 值 (後端 API 返回的 token 欄位名稱)
            if (token) {
              //  將 token 儲存到 localStorage，key 名稱設為 authToken'
              localStorage.setItem("authToken", token);
              console.log("Token 儲存成功:", token);
              navigate("/"); //  導向首頁
            } else {
              console.error("登入成功，但 Token 未包含在響應中");
              alert("登入成功，但Token 獲取失敗，請稍後再試。"); //  顯示錯誤訊息
            }
          });
        } else if (response.status === 401) {
          // 登入失敗 (HTTP 狀態碼 401 Unauthorized) - 帳號或密碼錯誤
          console.log("帳號或密碼錯誤");
          alert("帳號或密碼錯誤。");
        } else {
          // 其他錯誤 (例如伺服器錯誤，網路錯誤等)
          console.error(
            "登入失敗，伺服器錯誤或其他錯誤，狀態碼:",
            response.status
          );
          alert("登入失敗，請稍後再試。");
        }
      })
      .catch((error) => {
        // 網路錯誤或其他錯誤 (例如 fetch 請求本身失敗)
        console.error("網路錯誤或其他錯誤", error);
        alert("網路錯誤，請檢查網路連線。");
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">歡迎使用記帳軟體</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">帳號</label>
            <input
              type="text"
              id="username"
              className="login-input"
              placeholder="請輸入帳號"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">密碼</label>
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder="請輸入密碼"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            登入
          </button>
        </form>
        <div className="login-footer">
          <a href="/forgot-password">忘記密碼？</a>
          <a href="/register">註冊帳號</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
