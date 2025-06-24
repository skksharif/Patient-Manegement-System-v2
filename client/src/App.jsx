import { useState } from "react";
import { createPortal } from "react-dom";

import "./App.css";
import Hero from "./components/Hero";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminHome from "./components/AdminHome";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      {createPortal(
        <ToastContainer position="top-right" autoClose={3000} />,
        document.getElementById("toast-root")
      )}
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
