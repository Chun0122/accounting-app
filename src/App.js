import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Sidebar from "./SideBar/Sidebar";
import Login from "./Login/Login";
import Registration from "./Login/Registration";
import HomeScreen from "./Home/HomeScreen";
import CategoriesList from "./Left/Categories/CategoriesList";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
