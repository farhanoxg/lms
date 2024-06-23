import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastContextProvider } from "./context/ToastContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ToastContextProvider>
      <Router>
        <AuthContextProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/" element={<HomePage />} />

            </Route>
            <Route element={<ProtectedRoute role="student" />}>
              <Route path="/student" element={<StudentPage />} />
            <Route path="/" element={<HomePage />} />
            </Route>
          </Routes>
        </AuthContextProvider>
      </Router>
    </ToastContextProvider>
  );
}

export default App;
