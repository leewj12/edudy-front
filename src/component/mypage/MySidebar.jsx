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
    <>
      {/* 모바일: 상단 탭 바 */}
      <div className="md:hidden bg-gray-50 border-b border-gray-200 px-4 py-3">
        <p className="text-sm font-bold mb-2">{userInfo?.userName || '이름 없음'}님 · <span className="font-normal text-gray-500">{userInfo?.lectureTitle || '진행중인 과정 없음'}</span></p>
        <div className="flex gap-2 overflow-x-auto">
          {menuList.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm transition-colors
                ${location.pathname === item.path
                  ? 'bg-[#192a48] text-white'
                  : 'bg-white text-gray-600 border border-gray-300'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 데스크톱: 고정 사이드바 */}
      <aside className="hidden md:block fixed top-[120px] left-0 w-85 h-[calc(100vh-80px)] bg-gray-50 p-6 overflow-y-auto z-40 pl-[128px]">
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
    </>
  );
}