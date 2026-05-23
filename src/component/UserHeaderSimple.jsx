// ✅ UserHeader.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import axios from "../api/axiosInstance";
import AskModal from "../component/AskModal";

export default function UserHeader() {
  const { isLoggedIn, userRole, setAccessToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [priorityLectures, setPriorityLectures] = useState([]);
  const [showAskModal, setShowAskModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/guest/category/list")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("카테고리 불러오기 실패:", err);
      });
  }, []);

  useEffect(() => {
    axios.get("/guest/lecture/list/priority")
      .then((res) => {
        const sorted = res.data
          .sort((a, b) => a.lecturePriority - b.lecturePriority)
          .slice(0, 5);
        setPriorityLectures(sorted);
      })
      .catch((err) => {
        console.error("우선순위 강의 불러오기 실패:", err);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = searchInput.trim();
    navigate(`/lectureList?keyword=${encodeURIComponent(keyword)}`);
  };

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
    <>
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="px-[16px] md:px-[128px] py-4">
          <div className="flex items-center justify-between mb-2">
            <Link to="/">
              <img src="/logo.png" alt="Edudy Logo" className="h-10" />
            </Link>

            <div className="flex items-center gap-6">
              <form
                onSubmit={handleSearch}
                className="hidden md:flex items-center w-[250px] h-[35px] border border-gray-300 rounded-full px-4 shadow-sm bg-white"
              >
                <input
                  type="text"
                  placeholder="어떤 강의를 찾고 있나요?"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 outline-none text-sm placeholder-gray-400"
                />
                <button type="submit">
                  <Search className="w-4 h-4 text-gray-500 cursor-pointer" />
                </button>
              </form>

              <div className="hidden md:flex items-center gap-4 text-sm">
                {isLoggedIn ? (
                  <>
                    {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_INSTRUCTOR') && (
                      <Link to="/admin/dashboard" className="hover:text-[#00C59E] text-gray-500">
                        관리자 사이트
                      </Link>
                    )}
                    <Link to="/user/mypage" className="hover:text-[#00C59E] text-gray-500">
                      마이페이지
                    </Link>
                    <button onClick={handleLogout} className="hover:text-[#00C59E] text-gray-500">
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="hover:text-[#00C59E] text-gray-500">로그인</Link>
                    <Link to="/signup" className="hover:text-[#00C59E] text-gray-500">회원가입</Link>
                  </>
                )}
              </div>

              <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="hidden md:flex gap-4 font-medium justify-start items-center text-[17px] h-10 text-gray-900">
            <div className="relative group font-bold text-gray-900">
              {/* 드롭다운 트리거 */}
              <Link
                to="/lectureList"
                className="hover:text-[#00C59E] flex items-center cursor-pointer h-full px-2 py-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                &nbsp;전체과정&nbsp;&nbsp;
              </Link>

              {/* 드롭다운 메뉴 */}
              <div className="absolute left-0 mt-[4px] w-[180px] bg-white/90 border border-gray-300 rounded shadow-md hidden group-hover:flex flex-col z-50"
                  onMouseEnter={(e) => e.currentTarget.classList.add('flex')}
                  onMouseLeave={(e) => e.currentTarget.classList.remove('flex')}>
                {categories.map((cat) => (
                  <Link
                    key={cat.lectureCategoryId}
                    to={`/lectureList?categoryId=${cat.lectureCategoryId}`}
                    className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                  >
                    {cat.lectureCategoryName}
                  </Link>
                ))}
              </div>
            </div>

            {priorityLectures.map(({ lectureId, lectureShortTitle }) => (
              <Link
                key={lectureId}
                to={`/lecture/${lectureId}`}
                className="px-2 py-1 hover:text-[#00C59E] hover:bg-gray-100 rounded h-full flex items-center"
              >
                {lectureShortTitle}
              </Link>
            ))}

            <span className="border-l h-4 border-gray-300 mx-2"></span>

            <button
              onClick={() => setShowAskModal(true)}
              className="bg-[#192a48] hover:text-[#00C59E] text-white px-3 py-0.5 rounded text-[17px] h-[29px] flex items-center"
            >
              신청문의
            </button>
            {showAskModal && <AskModal onClose={() => setShowAskModal(false)} />}
          </nav>
        </div>
      </header>
    </>
  );
}