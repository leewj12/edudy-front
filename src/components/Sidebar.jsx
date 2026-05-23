import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import logo from '/src/assets/logo.png';
import {
  Home,
  CalendarCheck,
  Users,
  ScrollText,
  BookOpen,
  ClipboardList,
  Settings,
  UserCog,
  Mail,
  NotebookText,
  Briefcase,
} from 'lucide-react';
import {Link} from 'react-router-dom';

export default function Sidebar() {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const handleMenuClick = (label) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const menuItems = [
    { label: '홈', icon: <Home size={16} />, path: '/admin/dashboard' },

    {
      label: '운영관리', icon: <ClipboardList size={16} />, subItems: [
        { label: '공지사항', path: '/admin/notice/list' },
        { label: '관리자 일정 관리', path: '#' },
      ]
    },

    { label: '훈련일지', icon: <NotebookText size={16} />, path: '/admin/train/list' },

    {
      label: '출결', icon: <CalendarCheck size={16} />, subItems: [
        { label: '출결 현황', path: '/admin/att/status' },
        { label: '위험 수강생 관리', path: '/admin/attendance/setting' },
      ]
    },

    {
      label: '수강생', icon: <Users size={16} />, subItems: [
        { label: '수강생 관리', path: '/admin/lecture/part/list' },
        { label: '상담일지', path: '/admin/consult' },
      ]
    },
    
    {
      label: '과정', icon: <BookOpen size={16} />, subItems: [
        { label: '과정 조회', path: '/admin/lecture/list' },
        { label: '과정 등록', path: '/admin/lecture/new' },
        { label: '담당자 관리', path: '/admin/instr' },
        { label: '수강 신청 관리', path: '/admin/ask' },
      ]
    },

    {
      label: '성적관리', icon: <ScrollText size={16} />, path: '/admin/score'
    },

    {
      label: '만족도 평가', icon: <ClipboardList size={16} />, subItems: [
        { label: '만족도 평가 결과', path: '/admin/survey/list' },
        { label: '평가 항목 설정', path: '/admin/survey' },
      ]
    },

    {
      label: '사이트 관리', icon: <Settings size={16} />, subItems: [
        { label: '메인 배너 관리', path: '/admin/banner' },
        { label: '사이트 노출 관리', path: '/admin/navigation' },
        { label: '카테고리 관리', path: '/admin/category' },
      ]
    },

    { label: '회원 등급 관리', icon: <UserCog size={16} />, path: '/admin/users/list' },

    { label: 'SMS 발송', icon: <Mail size={16} />, path: '/admin/sms' }
  ];

  return (
     <aside
      className={`text-white min-h-screen transition-all duration-300 
        ${isCollapsed ? 'w-16 min-w-[64px]' : 'w-64 min-w-[256px]'}`}
      style={{ backgroundColor: '#1B2D4D' }}
    >
      {/* 상단 로고 + 화살표 버튼 */}
      <div className="flex items-center justify-between px-4 py-4 mt-2">
        {!isCollapsed && (
          <Link to="/admin/dashboard">
          {/* <Link to="/admin/dashboard"> */}
            <img src={logo} alt="Edudy Logo" className="w-[85px] h-[39.39px]" />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-white ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* 메뉴 전체: 사이드바가 접혔을 때는 안 보이게 */}
      {!isCollapsed && (
        <nav className="mt-2">
          {menuItems.map((item) => (
            <div key={item.label}>
              {/* 단일 메뉴 */}
              {!item.subItems ? (
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-3 text-m font-bold hover:bg-[#36FFD7] hover:text-black space-x-4 pl-8"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  {/* 상위 메뉴 (토글용) */}
                  <div
                    className={`flex justify-between items-center px-4 py-3 cursor-pointer text-m font-bold
                      ${openMenu === item.label ? 'bg-[#36FFD7] text-black' : ''}
                      hover:bg-[#36FFD7] hover:text-black`}
                    onClick={() => handleMenuClick(item.label)}
                  >
                    <div className="flex items-center space-x-4 pl-4">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transform transition-transform ${openMenu === item.label ? 'rotate-90' : ''}`}
                    />
                  </div>

                  {/* 서브 메뉴 */}
                  {openMenu === item.label && (
                    <div className="bg-[#36FFD7]/20 text-white text-m">
                      {item.subItems.map((sub, idx) => (
                        <Link
                          to={sub.path}
                          key={idx}
                          className="block pl-10 pr-4 py-2 hover:bg-[#36FFD7]/20 cursor-pointer"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* 구분선: 강의평가 이후에만 */}
              {item.label === '만족도 평가' && (
                <hr className="border-t border-gray-600 my-2 w-full" />
              )}
            </div>
          ))}
        </nav>
      )}
    </aside>
  );
}
