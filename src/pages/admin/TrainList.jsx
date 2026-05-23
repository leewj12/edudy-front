import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function TrainList() {
  const [courses, setCourses] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  //강의목록 가져오기
  const fetchCourses = async () => {
    try {
      const res = await axios.get('/admin/lecture/list');
  
      const now = dayjs();
  
      const transformed = res.data.map(course => {
        const isOngoing = dayjs(course.lectureStart).isBefore(now) && dayjs(course.lectureEnd).isAfter(now);
        const isFinished = dayjs(course.lectureEnd).isBefore(now);
  
        return {
          ...course,
          status: isOngoing ? '진행중' : isFinished ? '종료' : '예정',
          period: `${course.lectureStart} ~ ${course.lectureEnd}`,
          manager: '박형배' // 백엔드에서 없을 경우 임시 고정 (있다면 제거 가능)
        };
      });
  
      setCourses(transformed);
      setFiltered(transformed);
    } catch (err) {
      console.error("강의목록 불러오기 실패", err);
    }
  };

  //전체 렌더링
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = () => {
  const result = courses.filter((course) => {
    const matchKeyword = keyword ? (course.lectureTitle || '').includes(keyword) : true;
    const matchStatus = statusFilter ? (course.status || '').includes(statusFilter) : true;
    return matchKeyword && matchStatus;
  });
  setFiltered(result);
  setCurrentPage(1);
  };
  
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="훈련일지" description="훈련 과정을 조회하고 관리할 수 있습니다." />
        <Header />
        <h1 className="text-2xl font-bold mb-6">훈련일지</h1>

        {/* 검색/필터 영역 */}
        <div className="flex gap-4 mb-4 items-center text-sm">
          <input
            type="text"
            placeholder="과정명을 입력하세요"
            className="border border-gray-400 px-3 py-1.5 rounded w-80"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-400 px-3 py-1.5 rounded"
          >
            <option value="">운영 상태</option>
            <option value="진행중">진행중</option>
            <option value="수료">수료</option>
            <option value="예정">개강 예정</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-[#192a48] text-white px-4 py-1.5 rounded cursor-pointer"
          >
            조회
          </button>
        </div>

        {/* 기능 버튼 */}
        <div className="flex justify-end mb-2">
        </div>

        {/* 테이블 */}
        <div>
          <table className="w-full border-t border-b border-gray-300 text-center text-sm">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="py-2 px-3">과정명</th>
                <th className="py-2 px-3">상태</th>
                <th className="py-2 px-3">훈련기간</th>
                <th className="py-2 px-3">담임</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    조건에 맞는 과정이 없습니다.
                  </td>
                </tr>
              ) : (
                paginated.map((course, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                      <td
                        className="py-2 px-3 text-blue-600 underline cursor-pointer"
                        onClick={() => navigate(`/admin/trainList/${course.lectureId}`)}
                      >{course.lectureTitle}</td>
                      <td className="py-2 px-3">{course.status}</td>
                      <td className="py-2 px-3">{course.period}</td>
                      <td className="py-2 px-3">{course.manager}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="mt-6 flex items-center justify-between relative">
          <div className="text-sm">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1 border-gray-400 text-sm"
            >
              <option value={10}>10개씩</option>
              <option value={20}>20개씩</option>
              <option value={30}>30개씩</option>
            </select>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}