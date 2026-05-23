import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import Pagination from '../../components/Pagination';
import ExcelExportButton from '../../component/admin/ExcelExportButton';
import styles from '../../css/PrintOnly.module.css';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';

export default function LecturePartList() {
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const courseRes = await axios.get('/admin/lecture/list');
      const now = dayjs();
      const courses = courseRes.data.filter(course =>
        dayjs(course.lectureStart).isBefore(now) && dayjs(course.lectureEnd).isAfter(now)
      );

      if (courses.length === 0) {
        setError('현재 조회 가능한 진행 중인 과정이 없습니다.');
        return;
      }

      console.log('✅ 과정 목록:', courses);
      setCourseList(courses);
      const firstCourseId = courses[0].lectureId;
      setSelectedCourse(firstCourseId);

      const partRes = await axios.get(`/admin/lecture/part/list/${firstCourseId}`);
      console.log('✅ 수강생 응답 데이터:', partRes.data);

      const valid = partRes.data
        .filter(item => item.status !== 'DROPPED')
        .map(item => ({
          id: item.lecturePartId,
          name: item.userName,
          phone: item.userPhone,
          birth: item.userBirth ? dayjs(item.userBirth).format('YYMMDD') : '',
          attendanceRate: item.currentAttendanceRate ?? 0,
          // risk: item.riskLevel === 'NORMAL' ? '정상' : item.riskLevel === 'MEDIUM' ? '경고' : '위험',
          risk: item.danger === 'NORMAL' ? '정상' : item.danger === 'WARN' ? '주의' : '경고',
          course: firstCourseId,
        }));

      setOriginalData(valid);
      setFiltered(valid);
    } catch (err) {
      console.error('❌ 데이터 로딩 실패:', err);
      setError('현재 조회 가능한 진행 중인 과정이 없습니다.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) setCurrentPage(1);
  }, [itemsPerPage, filtered]);

  const handleSearch = () => {
    const result = originalData.filter((item) => {
      const matchesKeyword = keyword
        ? item.name.includes(keyword) || item.phone.includes(keyword)
        : true;
      const matchesCourse = item.course === selectedCourse;
      const matchesRisk = selectedRisk ? item.risk === selectedRisk : true;
      return matchesKeyword && matchesCourse && matchesRisk;
    });

    setFiltered(result);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!selectedCourse) return;
      try {
        const partRes = await axios.get(`/admin/lecture/part/list/${selectedCourse}`);
        console.log('🔄 선택한 과정 수강생 응답:', partRes.data);
  
        const valid = partRes.data
          .filter(item => item.status !== 'DROPPED')
          .map(item => ({
            id: item.lecturePartId,
            name: item.userName,
            phone: item.userPhone,
            birth: item.userBirth ? dayjs(item.userBirth).format('YYMMDD') : '',
            attendanceRate: item.currentAttendanceRate ?? 0,
            // risk: item.riskLevel === 'NORMAL' ? '정상' : item.riskLevel === 'MEDIUM' ? '경고' : '위험',
            risk: item.danger === 'NORMAL' ? '정상' : item.danger === 'WARN' ? '주의' : '경고',
            course: selectedCourse,
          }));
  
        setOriginalData(valid);
        setFiltered(valid);
      } catch (err) {
        console.error('❌ 수강생 재요청 실패:', err);
        setOriginalData([]);
        setFiltered([]);
      }
    };
  
    fetchParticipants();
  }, [selectedCourse]);

  const handleBulkExpel = async () => {
    if (selectedIds.length === 0) {
      alert('제적할 수강생을 선택하세요.');
      return;
    }
    if (!window.confirm('선택한 수강생들을 제적 처리하시겠습니까?')) return;
  
    try {
      for (const id of selectedIds) {
        await axios.patch(`/admin/lecture/part/update/${id}`, {
          status: 'DROPPED',
        });
      }
      await fetchData();
      setSelectedIds([]);
    } catch (err) {
      console.error('❌ 제적 처리 실패:', err);
      alert('제적 중 오류 발생');
    }
  };

  const handleCheck = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="수강생 관리" description="수강생 정보 관리" />
        <Header />
        <h1 className="text-2xl font-bold mb-6">수강생 관리</h1>

        <div className="flex gap-4 mb-4 items-center no-print text-sm">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border border-gray-400 px-3 py-1.5 rounded"
          >
            {courseList.map((course) => (
              <option key={course.lectureId} value={course.lectureId}>
                {course.lectureTitle}
              </option>
            ))}
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="border border-gray-400 px-3 py-1.5 rounded"
          >
            <option value="">전체 위험도</option>
            <option value="정상">정상</option>
            <option value="주의">주의</option>
            <option value="경고">경고</option>
          </select>

          <input
            type="text"
            placeholder="이름 또는 전화번호로 검색"
            className="border border-gray-400 px-3 py-1.5 rounded w-80"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-[#192a48] text-white px-4 py-1.5 rounded cursor-pointer"
          >
            조회
          </button>
        </div>

        {error ? (
          <div className="text-center text-red-500 font-semibold mt-10">{error}</div>
        ) : (
          <>
            <div className="flex justify-end mb-2">
              <div className="flex gap-2">
                <button
                  onClick={handleBulkExpel}
                  className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50 text-sm"
                >
                  제적
                </button>
                <ExcelExportButton
                  data={filtered}
                  filename="수강생_리스트"
                  columns={[
                    { key: 'name', label: '이름' },
                    { key: 'phone', label: '전화번호', format: (v) => v.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') },
                    { key: 'attendanceRate', label: '출석률', format: (v) => `${v}%` },
                    { key: 'risk', label: '위험도' },
                    { key: 'birth', label: '생년월일' },
                  ]}
                />
                <button
                  onClick={handlePrint}
                  className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50 text-sm"
                >
                  프린트
                </button>
              </div>
            </div>

            <div id="print-area">
              <table className="w-full border-t border-b border-gray-300 text-center text-sm">
                <thead>
                  <tr className="bg-[#FAFAFA]">
                    <th className="py-2 px-3">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setSelectedIds(e.target.checked ? paginated.map((item) => item.id) : [])
                        }
                        checked={paginated.length > 0 && paginated.every((item) => selectedIds.includes(item.id))}
                        className='no-print'
                      />
                    </th>
                    <th className="py-2 px-3">이름</th>
                    <th className="py-2 px-3">전화번호</th>
                    <th className="py-2 px-3">출석률</th>
                    <th className="py-2 px-3">위험도</th>
                    <th className="py-2 px-3">생년월일</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-gray-400">
                        조건에 맞는 수강생이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((item) => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => handleCheck(item.id)}
                            className='no-print'
                          />
                        </td>
                        <td className="py-2 px-3">{item.name}</td>
                        <td className="py-2 px-3">{item.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</td>
                        <td className="py-2 px-3">{item.attendanceRate}%</td>
                        <td className="py-2 px-3">{item.risk}</td>
                        <td className="py-2 px-3">{item.birth}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
          </>
        )}
      </main>
    </div>
  );
}