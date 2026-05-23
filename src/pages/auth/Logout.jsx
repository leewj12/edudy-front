import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";

export default function LogoutButton({ className = "" }) {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      setAccessToken(null);
      navigate("/");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      로그아웃
    </button>
  );
}