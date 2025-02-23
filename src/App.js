import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./SideBar/Sidebar";
import Login from "./Login/Login";
import Registration from "./Login/Registration";
import HomeScreen from "./Home/HomeScreen";
import CategoriesList from "./Left/Categories/CategoriesList";

const AppContent = () => {
  const location = useLocation();

  // 檢查當前路徑是否為登入或註冊頁面
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Sidebar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
