import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ToastContext from "./ToastContext";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { toast } = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (!["/login", "/register"].includes(location.pathname)) {
          navigate("/login", { replace: true });
        }
        return;
      }

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setUser(storedUser);

      if (["/login", "/register"].includes(location.pathname)) {
        navigate(`/${storedUser}`, { replace: true });
      }
    } catch (err) {
      console.log(err);
      setError(err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!["/login", "/register"].includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    }
  };

  const loginUser = async (userData) => {
    try {
      const url =
        userData.role === "admin"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/student/login";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", result.user.role);
        console.log(result.user.role);

        setUser(result.user.role);

        toast.success(result.msg);
        navigate(`/${result.user.role}`, { replace: true });
      } else {
        throw new Error(result.msg);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const registerUser = async (userData) => {
    try {
      const url = "http://localhost:5000/api/auth/register";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("User registered successfully! Please log in.");
        navigate("/login", { replace: true });
      } else {
        throw new Error(result.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const logoutUser = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login", { replace: true });
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to log out");
    }
  };

  return (
    <AuthContext.Provider value={{ loginUser, registerUser, logoutUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
