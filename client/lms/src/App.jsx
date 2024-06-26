import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastContextProvider } from "./context/ToastContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProfile from "./components/AdminProfile";
import StudentProfile from "./components/StudentProfile";

function App() {
  return (
    <ToastContextProvider>
      <Router>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<AdminProfile />} />
            </Route>
            <Route element={<ProtectedRoute role="student" />}>
              <Route path="/student" element={<StudentProfile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthContextProvider>
      </Router>
    </ToastContextProvider>
  );
}

export default App;
