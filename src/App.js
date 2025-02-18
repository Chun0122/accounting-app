import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./Login/Login";
import Registration from "./Login/Registration";
import HomeScreen from "./Home/HomeScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
