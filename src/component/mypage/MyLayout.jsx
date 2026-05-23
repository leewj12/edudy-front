// src/component/mypage/MypageLayout.jsx
import React, { useEffect, useState } from 'react';
import axios from "../../api/axiosInstance";
import UserHeaderSimple from '../UserHeaderSimple';
import UserQa from '../UserQa';
import MySidebar from './MySidebar';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function MyLayout({ children }) {
  const { accessToken } = useAuth();
  const [user, setUser] = useState({ name: '', lectureName: '프론트엔드 개발자 과정' });

  useEffect(() => {
    try {
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        console.log(decoded)
        const name = decoded.name || decoded.userName || '';
        setUser(prev => ({ ...prev, name }));
      }
    } catch (e) {
      console.warn("토큰 디코딩 실패", e);
    }
  }, [accessToken]);
  
  return (
    <>
      <UserHeaderSimple />

      <div className="relative flex">
        {/* 사이드바 */}
        <MySidebar name={user.name} lectureName={user.lectureName}/>

        {/* 콘텐츠 영역 */}
        <main className="ml-85 flex-1 p-10">{children}</main>
      </div>

      <UserQa />
    </>
  );
}