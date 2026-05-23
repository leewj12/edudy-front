//  AdminInstr.jsx 전체 렌더링 포함 버전
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import Pagination from '../../components/Pagination';
import ExcelExportButton from '../../component/admin/ExcelExportButton';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';
import styles from '../../css/PrintOnly.module.css';

export default function AdminInstr() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [selectedToRegister, setSelectedToRegister] = useState([]);
  const [lectureMap, setLectureMap] = useState({});

  const formatPhone = (num) => {
    if (!num) return '';
    return num.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  };

  const fetchCoursesAndInstructors = async () => {
    try {
      const courseRes = await axios.get('/admin/lecture/list');
      const now = dayjs();
      const ongoing = courseRes.data.filter(course => dayjs(course.lectureEnd).isAfter(now));
      if (ongoing.length === 0) {
        setError('현재 진행 중인 과정이 없습니다.');
        return;
      }
      setCourses(ongoing);
      setSelectedCourse(ongoing[0].lectureId);
    } catch (err) {
      console.error(err);
      setError('진행 중인 과정 정보를 불러오지 못했습니다.');
    }
  };

  const fetchLectureMappings = async () => {
    try {
      const res = await axios.get('/admin/staff/list');
      const map = {};
      res.data.forEach(({ userId, lectureTitle }) => {
        if (!map[userId]) map[userId] = [];
        map[userId].push(lectureTitle);
      });
      setLectureMap(map);
    } catch (err) {
      console.error('참여 과정 매핑 실패', err);
    }
  };

  const fetchInstructors = async (lectureId) => {
    try {
      const res = await axios.get(`/admin/staff/lecture/${lectureId}`);
      const valid = res.data.map(item => ({
        id: item.lectureStaffId,
        userId: item.userId,
        name: item.userName,
        phone: formatPhone(item.userPhone),
        birth: item.userBirth ? dayjs(item.userBirth).format('YYMMDD') : '',
      }));
      setOriginalData(valid);
      setFiltered(valid);
    } catch (err) {
      console.error(err);
      setOriginalData([]);
      setFiltered([]);
    }
  };

  useEffect(() => { fetchCoursesAndInstructors(); }, []);
  useEffect(() => {
    if (selectedCourse) {
      fetchInstructors(selectedCourse);
      fetchLectureMappings();
    }
  }, [selectedCourse]);

  useEffect(() => {
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) setCurrentPage(1);
  }, [itemsPerPage, filtered]);

  const handleSearch = () => {
    const result = originalData.filter(item => (!search || item.name.includes(search)));
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleRemove = async () => {
    if (selectedIds.length === 0) return alert('해지할 강사를 선택하세요.');
    if (!window.confirm('선택한 담당자를 해지하시겠습니까?')) return;
    try {
      for (const id of selectedIds) await axios.delete(`/admin/staff/${id}`);
      await fetchInstructors(selectedCourse);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert('해지 중 오류 발생');
    }
  };

  const handleOpenModal = async () => {
    try {
      const res = await axios.get('/admin/instructor/list');
      const registeredIds = originalData.map(d => d.userId);
      const filtered = res.data.filter(i => !registeredIds.includes(i.userId));
      setInstructors(filtered);
      setSelectedToRegister([]);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('강사 목록을 불러오지 못했습니다.');
    }
  };

  const handleRegisterStaff = async () => {
    if (selectedToRegister.length === 0) return alert('등록할 강사를 선택하세요.');
    try {
      for (const userId of selectedToRegister) {
        await axios.post('/admin/staff', { userId, lectureId: selectedCourse });
      }
      await fetchInstructors(selectedCourse);
      setIsModalOpen(false);
      alert('강사가 성공적으로 등록되었습니다.');
    } catch (err) {
      console.error(err);
      alert('등록 중 오류 발생');
    }
  };

  const toggleRegisterSelect = (userId) => {
    setSelectedToRegister(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const toggleSelectAll = (checked) => {
    setSelectedToRegister(checked ? instructors.map(i => i.userId) : []);
  };

  const handleCheck = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <AdminLayout>
      
        <PageMeta title="담당자 관리" description="과정을 담당할 강사를 배정합니다" />
        <h1 className="text-2xl font-bold mb-6">담당자 관리</h1>

        <div className={`flex gap-4 mb-4 items-center no-print text-sm ${styles['no-print']}`}>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="border border-gray-400 px-3 py-1.5 rounded cursor-pointer">
            {courses.map(course => (
              <option key={course.lectureId} value={course.lectureId}>{course.lectureTitle}</option>
            ))}
          </select>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="이름으로 검색" className="border border-gray-400 px-3 py-1.5 rounded w-80" />
          <button onClick={handleSearch} className="bg-[#192a48] text-white px-4 py-1.5 rounded cursor-pointer">조회</button>
        </div>

        {error ? (
          <div className="text-center text-red-500 font-semibold mt-10">{error}</div>
        ) : (
          <>
            <div className={`flex justify-end mb-2 ${styles['no-print']}`}>
              <div className="flex gap-2">
                <button onClick={handleOpenModal} className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">등록</button>
                <button onClick={handleRemove} className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">해지</button>
                <ExcelExportButton data={filtered} filename="담당자_리스트" columns={[{ key: 'name', label: '이름' }, { key: 'phone', label: '전화번호' }, { key: 'birth', label: '생년월일' }]} />
                <button onClick={() => window.print()} className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">프린트</button>
              </div>
            </div>

            <div id="print-area">
              <table className="w-full border-t border-b border-gray-300 text-center text-sm">
                <thead className="bg-[#FAFAFA] h-9">
                  <tr>
                    <th><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? paginated.map(i => i.id) : [])} checked={paginated.length > 0 && paginated.every(i => selectedIds.includes(i.id))} className={styles['no-print']} /></th>
                    <th>이름</th>
                    <th>생년월일</th>
                    <th>담당 과정</th>
                    <th>연락처</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={5} className="py-6 text-gray-400">조건에 맞는 담당자가 없습니다.</td></tr>
                  ) : (
                    paginated.map(item => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleCheck(item.id)} className={styles['no-print']} /></td>
                        <td>{item.name}</td>
                        <td>{item.birth}</td>
                        <td>
                          {/* <select className="text-sm rounded px-2 py-1 bg-white">
                            {(lectureMap[item.userId] || []).map((title, idx) => <option key={idx}>{title}</option>)}
                            </select> */}

                          <select
                            className="text-sm rounded px-2 h-9 bg-white cursor-default"
                            value={(lectureMap[item.userId] || [])[0]}
                            onChange={(e) => e.preventDefault()} // ✅ 선택 막음
                            >
                            {(lectureMap[item.userId] || []).map((title, idx) => (
                              <option
                              key={idx}
                              value={title}
                              aria-disabled={idx !== 0} // ✅ 브라우저는 무시함
                              style={{
                                color: idx !== 0 ? 'black' : undefined, // ✅ 흐려지지 않게
                                backgroundColor: 'white' // ✅ 선택시 배경 유지
                              }}
                              >
                                {title}
                              </option>
                            ))}
                          </select>

                        </td>
                        <td>{item.phone}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className={`mt-6 flex items-center justify-between relative ${styles['no-print']}`}>
              <div className="text-sm">
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="border rounded px-2 py-1 border-gray-400 text-sm cursor-pointer">
                  <option value={10}>10개씩</option>
                  <option value={20}>20개씩</option>
                  <option value={30}>30개씩</option>
                </select>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
              </div>
            </div>
          </>
        )}

        {isModalOpen && (
          <div className={`fixed inset-0 bg-black/50 bg-opacity-30 z-50 flex items-center justify-center ${styles['no-print']}`}>
            <div className="bg-white rounded-lg w-[600px] p-6 shadow-lg relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl" onClick={() => setIsModalOpen(false)}>&times;</button>
              <h2 className="text-lg font-semibold mb-4">강사 등록</h2>
              <div className="max-h-80 overflow-y-auto border-t border-b border-gray-300">
                <table className="w-full text-sm text-center">
                  <thead className="bg-gray-100 h-9">
                    <tr>
                      <th><input type="checkbox" onChange={(e) => toggleSelectAll(e.target.checked)} checked={instructors.length > 0 && instructors.every(i => selectedToRegister.includes(i.userId))} /></th>
                      <th>이름</th>
                      <th>생년월일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.length === 0 ? (
                      <tr className='h-9'><td colSpan={3} className="py-6 text-gray-400">등록 가능한 강사가 없습니다.</td></tr>
                    ) : (
                      instructors.map(ins => (
                        <tr key={ins.userId} className="border-t border-gray-300 h-9">
                          <td><input type="checkbox" checked={selectedToRegister.includes(ins.userId)} onChange={() => toggleRegisterSelect(ins.userId)} /></td>
                          <td>{ins.usersName}</td>
                          <td>{ins.userBirth ? dayjs(ins.userBirth).format('YYMMDD') : ''}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center flex justify-center gap-3">
                <button onClick={handleRegisterStaff} className="bg-blue-600 text-white px-4 py-2 rounded">등록</button>
                <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded">취소</button>
              </div>
            </div>
          </div>
        )}
      
    </AdminLayout>
  );
}