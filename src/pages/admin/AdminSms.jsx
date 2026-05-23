import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import Pagination from '../../components/Pagination';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';

export default function AdminSms() {
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // ✨ 모달 입력값 상태 추가
const [modalMessage, setModalMessage] = useState('');

  const fetchData = async () => {
    try {
      const courseRes = await axios.get('/admin/lecture/list');
      const now = dayjs();
      const courses = courseRes.data.filter(course =>
        dayjs(course.lectureStart).isBefore(now) && dayjs(course.lectureEnd).isAfter(now)
      );
      if (courses.length === 0) {
        setError('진행 중인 과정이 없습니다.');
        return;
      }
      setCourseList(courses);
      const firstId = courses[0].lectureId;
      setSelectedCourse(firstId);

      const partRes = await axios.get(`/admin/lecture/part/list/${firstId}`);
      const valid = partRes.data
        .filter(item => item.status !== 'DROPPED')
        .map(item => ({
          id: item.lecturePartId,
          name: item.userName,
          phone: item.userPhone,
          birth: item.userBirth ? dayjs(item.userBirth).format('YYMMDD') : '',
          risk: item.danger === 'NORMAL' ? '정상' : item.danger === 'WARN' ? '주의' : '경고',
          attendanceRate: item.currentAttendanceRate ?? 0,
        }));

      setOriginalData(valid);
      setFiltered(valid);
    } catch (err) {
      console.error(err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!selectedCourse) return;
      try {
        const partRes = await axios.get(`/admin/lecture/part/list/${selectedCourse}`);
        const valid = partRes.data
          .filter(item => item.status !== 'DROPPED')
          .map(item => ({
            id: item.lecturePartId,
            name: item.userName,
            phone: item.userPhone,
            birth: item.userBirth ? dayjs(item.userBirth).format('YYMMDD') : '',
            risk: item.danger === 'NORMAL' ? '정상' : item.danger === 'WARN' ? '주의' : '경고',
            attendanceRate: item.currentAttendanceRate ?? 0,
          }));
        setOriginalData(valid);
        setFiltered(valid);
      } catch (err) {
        console.error(err);
      }
    };
    fetchParticipants();
  }, [selectedCourse]);

  const handleSearch = () => {
    const result = originalData.filter((item) => {
      const matchNamePhone = item.name.includes(keyword) || item.phone.includes(keyword);
      const matchRisk = selectedRisk ? item.risk === selectedRisk : true;
      return matchNamePhone && matchRisk;
    });
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleSendWarning = async (partId) => {
    const confirm = window.confirm('해당 수강생에게 경고 문자를 보내시겠습니까?');
    if (!confirm) return;

    try {
      await axios.post(`/admin/sms/warning/${partId}`);
      alert('문자가 발송되었습니다.');
    } catch (err) {
      console.error(err);
      alert('문자 발송 실패');
    }
  };

  const handleNoticeSend = async (msg) => {
    try {
      await axios.post(`/admin/sms/notice/${selectedCourse}`, { message: msg });
      alert('전체 공지가 발송되었습니다.');
    } catch (err) {
      console.error(err);
      alert('발송 실패');
    } finally {
      setShowModal(false);
    }
  };

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <AdminLayout>
      
        <PageMeta title="문자 발송" description="수강생 문자 관리" />
        <h1 className="text-2xl font-bold mb-6">문자 발송</h1>

        <div className="flex gap-4 mb-4 items-center text-sm">
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="border px-3 py-1.5 rounded border-gray-400 cursor-pointer">
            {courseList.map((c) => <option key={c.lectureId} value={c.lectureId}>{c.lectureTitle}</option>)}
          </select>
          <select value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)} className="border px-3 py-1.5 rounded border-gray-400 cursor-pointer">
            <option value="">전체 위험도</option>
            <option value="정상">정상</option>
            <option value="주의">주의</option>
            <option value="경고">경고</option>
          </select>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="border px-3 py-1.5 rounded border-gray-400 w-80" placeholder="이름 또는 전화번호 검색" />
          <button onClick={handleSearch} className="bg-[#192a48] text-white px-4 py-1.5 rounded cursor-pointer">조회</button>
          <button onClick={() => setShowModal(true)} className="ml-auto border border-gray-400 px-3 py-1.5 rounded bg-white hover:bg-gray-100 cursor-pointer">공지 발송</button>
        </div>

        <table className="w-full border-t border-b border-gray-300 text-center text-sm">
          <thead className="bg-[#FAFAFA]">
            <tr>
              <th className="py-2 px-3">이름</th>
              <th className="py-2 px-3">전화번호</th>
              <th className="py-2 px-3">출석률</th>
              <th className="py-2 px-3">위험도</th>
              <th className="py-2 px-3">생년월일</th>
              <th className="py-2 px-3">문자 발송</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-300">조건에 맞는 수강생이 없습니다.</td></tr>
            ) : (
              paginated.map((item) => (
                <tr key={item.id} className="border-t border-gray-300">
                  <td className="py-2 px-3">{item.name}</td>
                  <td className="py-2 px-3">{item.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</td>
                  <td className="py-2 px-3">{item.attendanceRate}%</td>
                  <td className="py-2 px-3">{item.risk}</td>
                  <td className="py-2 px-3">{item.birth}</td>
                  <td className="py-2 px-3">
                    {['주의', '경고'].includes(item.risk) ? (
                      <button onClick={() => handleSendWarning(item.id)} className="text-sm border border-gray-400 hover:bg-gray-50 px-3 py-1 rounded cursor-pointer">경고 발송</button>
                    ) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-6 flex items-center justify-between relative">
          <div className="text-sm">
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="border rounded px-2 py-1 border-gray-400 text-sm cursor-pointer">
              <option value={10}>10개씩</option>
              <option value={20}>20개씩</option>
              <option value={30}>30개씩</option>
            </select>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p)} />
          </div>
        </div>

        {/* ✅ 내부 모달 컴포넌트 정의 */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">전체 공지 문자</h2>
              <textarea
                rows={4}
                maxLength={70}
                className="w-full border border-gray-400 rounded px-3 py-2 text-sm"
                placeholder="공지 내용을 입력해 주세요 최대 70자까지 입력 가능합니다."
                value={modalMessage}
                onChange={(e) => setModalMessage(e.target.value)}
              />
              <div className="text-sm text-right mt-1 text-gray-500">{modalMessage.length} / 70</div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer">취소</button>
                <button onClick={() => handleNoticeSend(modalMessage)} className="px-3 py-1 rounded bg-[#192a48] text-white text-sm cursor-pointer">발송</button>
              </div>
            </div>
          </div>
        )}
      
    </AdminLayout>
  );
}