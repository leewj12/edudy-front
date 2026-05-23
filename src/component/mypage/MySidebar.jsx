// src/component/mypage/MySidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MySidebar() {
  const location = useLocation();
  const { userInfo } = useAuth(); //Context에서 직접 가져오기

  const menuList = [
    { label: '출석부', path: '/user/mypage' },
    { label: '성적 조회', path: '/user/score' },
    { label: '설문하기', path: '/user/survey' },
    { label: '내 정보', path: '/user/info' },
  ];

  return (
    <aside className="fixed top-[120px] left-0 w-85 h-[calc(100vh-80px)] bg-gray-50 p-6 overflow-y-auto z-40 pl-[128px]">
      <div className="my-5">
        <p className="text-lg font-bold">{userInfo?.userName || '이름 없음'}님</p>
        <p className="text-sm text-gray-500 mt-1">{userInfo?.lectureTitle || '진행중인 과정 없음'}</p>
        <hr className="my-4 border-gray-300" />
      </div>
      <ul className="space-y-5">
        {menuList.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex justify-between items-center pr-2 transition-colors duration-150 rounded px-2 cursor-pointer
                ${location.pathname === item.path
                  ? 'text-black font-bold hover:text-[#00C59E] hover:bg-gray-100'
                  : 'text-gray-400 hover:text-[#00C59E] hover:bg-gray-100'
                }`}
            >
              <span>{item.label}</span>
              <span className="text-xs">&gt;</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}