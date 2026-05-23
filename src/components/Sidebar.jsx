import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
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
import {Link, useLocation} from 'react-router-dom';

export default function Sidebar({ onClose }) {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const handleMenuClick = (label) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (subItems) => subItems?.some((sub) => location.pathname === sub.path);

  const menuItems = [
    { label: '홈', icon: <Home size={18} />, path: '/admin/dashboard' },

    {
      label: '운영관리', icon: <ClipboardList size={18} />, subItems: [
        { label: '공지사항', path: '/admin/notice/list' },
        { label: '관리자 일정 관리', path: '#' },
      ]
    },

    { label: '훈련일지', icon: <NotebookText size={18} />, path: '/admin/train/list' },

    {
      label: '출결', icon: <CalendarCheck size={18} />, subItems: [
        { label: '출결 현황', path: '/admin/att/status' },
        { label: '위험 수강생 관리', path: '/admin/attendance/setting' },
      ]
    },

    {
      label: '수강생', icon: <Users size={18} />, subItems: [
        { label: '수강생 관리', path: '/admin/lecture/part/list' },
        { label: '상담일지', path: '/admin/consult' },
      ]
    },

    {
      label: '과정', icon: <BookOpen size={18} />, subItems: [
        { label: '과정 조회', path: '/admin/lecture/list' },
        { label: '과정 등록', path: '/admin/lecture/new' },
        { label: '담당자 관리', path: '/admin/instr' },
        { label: '수강 신청 관리', path: '/admin/ask' },
      ]
    },

    {
      label: '성적관리', icon: <ScrollText size={18} />, path: '/admin/score'
    },

    {
      label: '만족도 평가', icon: <ClipboardList size={18} />, subItems: [
        { label: '만족도 평가 결과', path: '/admin/survey/list' },
        { label: '평가 항목 설정', path: '/admin/survey' },
      ]
    },

    {
      label: '사이트 관리', icon: <Settings size={18} />, subItems: [
        { label: '메인 배너 관리', path: '/admin/banner' },
        { label: '사이트 노출 관리', path: '/admin/navigation' },
        { label: '카테고리 관리', path: '/admin/category' },
      ]
    },

    { label: '회원 등급 관리', icon: <UserCog size={18} />, path: '/admin/users/list' },

    { label: 'SMS 발송', icon: <Mail size={18} />, path: '/admin/sms' }
  ];

  return (
     <aside
      className={`text-white h-full transition-all duration-300 flex flex-col
        ${isCollapsed ? 'w-16' : 'w-64'}`}
      style={{ backgroundColor: '#1B2D4D' }}
    >
      {/* 상단 로고 + 버튼 */}
      <div className="flex items-center justify-between px-4 py-4 mt-2 shrink-0">
        {!isCollapsed && (
          <Link to="/admin/dashboard" onClick={onClose}>
            <img src={logo} alt="Edudy Logo" className="w-[85px] h-[39.39px]" />
          </Link>
        )}
        {/* 데스크탑: 접기/펼치기, 모바일: 닫기 */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-white hidden lg:block ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <button
          onClick={onClose}
          className="text-white lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* 메뉴 */}
      {!isCollapsed && (
        <nav className="mt-2 flex-1 overflow-y-auto pb-4">
          {menuItems.map((item) => (
            <div key={item.label}>
              {/* 단일 메뉴 */}
              {!item.subItems ? (
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 text-sm font-semibold space-x-3 pl-6 transition-colors
                    ${isActive(item.path)
                      ? 'bg-[#36FFD7] text-black'
                      : 'hover:bg-white/10'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  {/* 상위 메뉴 (토글용) */}
                  <div
                    className={`flex justify-between items-center px-4 py-3 cursor-pointer text-sm font-semibold transition-colors
                      ${openMenu === item.label || isGroupActive(item.subItems)
                        ? 'bg-[#36FFD7] text-black'
                        : 'hover:bg-white/10'
                      }`}
                    onClick={() => handleMenuClick(item.label)}
                  >
                    <div className="flex items-center space-x-3 pl-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`transform transition-transform duration-200 ${openMenu === item.label ? 'rotate-90' : ''}`}
                    />
                  </div>

                  {/* 서브 메뉴 */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      openMenu === item.label ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="bg-[#152340]">
                      {item.subItems.map((sub, idx) => (
                        <Link
                          to={sub.path}
                          key={idx}
                          onClick={onClose}
                          className={`block pl-12 pr-4 py-2.5 text-sm transition-colors
                            ${isActive(sub.path)
                              ? 'text-[#36FFD7] bg-white/5'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
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
