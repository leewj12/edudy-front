// src/components/Header.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from "../api/axiosInstance";
import { jwtDecode } from 'jwt-decode';

export default function Header({ onMenuToggle }) {
  const { accessToken, setAccessToken, userInfo  } = useAuth();
  const navigate = useNavigate();
  //console.log("디코딩된 userInfo:", userInfo); // ✅ 여기 추가
  const signUrl = userInfo?.sign || '';
  const roleMap = {
    ROLE_ADMIN: "관리자",
    ROLE_USER: "사용자",
    ROLE_INSTRUCTOR: "강사",
  };


  let userName = '';
  let userRole = '';

  try {
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      //console.log(decoded);
      userName = decoded.name || decoded.userName || '';
      userRole = decoded.role || decoded.userRole || ''; // ROLE_ADMIN → ADMIN
    }
  } catch (e) {
    console.warn("토큰 디코딩 실패", e);
  }
  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      setAccessToken(null);
      navigate("/adminLogin");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다.");
    }
  };
  return (
    <div className="flex items-center justify-between mb-6 gap-3">
      {/* 왼쪽: 모바일 햄버거 */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
      >
        <Menu size={22} />
      </button>

      {/* 오른쪽 영역 */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <Bell size={20} className="text-gray-500 hidden sm:block" />

        {/* 검색바 - 태블릿 이상에서만 */}
        <div className="relative hidden md:block w-[220px] lg:w-[260px]">
          <input
            type="text"
            placeholder="사이트 검색"
            className="w-full pl-4 pr-10 py-2 text-sm border
            border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
        </div>

        {/* 관리자 정보 및 로그아웃 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="text-xs text-gray-700 font-medium hover:underline cursor-pointer whitespace-nowrap"
            onClick={() => navigate('/admin/mypage')}
          >
            <span className="hidden sm:inline">{roleMap[userRole]} </span>
            <span className="font-bold">{userName}</span>
            <span className="hidden sm:inline"> 님</span>
          </div>

          <button
            className="bg-blue-50 hover:bg-blue-100 text-xs text-blue-700 px-2 sm:px-3 py-1 rounded border border-blue-300 cursor-pointer whitespace-nowrap"
            onClick={() => navigate('/')}
          >
            <span className="hidden sm:inline">서비스 </span>사이트
          </button>

          <button
            className="bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 px-2 sm:px-3 py-1 rounded border border-gray-300 cursor-pointer whitespace-nowrap"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
