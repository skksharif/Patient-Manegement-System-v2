import { useState } from "react";
import "./App.css";
import Hero from "./components/Hero";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminHome from "./components/AdminHome";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      {/* your app components */}
      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login-portal" element={<Login />} />
          <Route path="/admin-home/*" element={<AdminHome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
