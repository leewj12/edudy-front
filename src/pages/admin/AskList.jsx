import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import Pagination from '../../components/Pagination';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';

export default function AskList() {
  const [courses, setCourses] = useState([]);
  const [askList, setAskList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedLectureId, setSelectedLectureId] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [modalItem, setModalItem] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get('/admin/lecture/list').then((res) => {
      const upcoming = res.data.filter((item) => dayjs(item.lectureStart).isAfter(dayjs()));
      setCourses(upcoming);
    });
    // axios.get('/admin/ask/list').then((res) => {
    //   setAskList(res.data);
    //   setFilteredList(res.data);
    // });
    axios.get('/admin/ask/list').then((res) => {
      const sorted = res.data.sort((a, b) => new Date(b.askCreatedAt) - new Date(a.askCreatedAt));
      setAskList(sorted);
      setFilteredList(sorted);
    });
  }, []);

  const handleSearch = () => {
    const filtered = askList.filter((item) => {
      const matchLecture = selectedLectureId === '전체' || item.lectureId === Number(selectedLectureId);
      const matchName = item.askName?.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchStatus = statusFilter === '전체' || item.askStatus === statusFilter;
      return matchLecture && matchName && matchStatus;
    });
    setFilteredList(filtered);
    setCurrentPage(1);
  };

  // const handleBulkChange = async (newStatus) => {
  //   if (selectedIds.length === 0) return alert('선택된 항목이 없습니다.');
  //   try {
  //     for (const id of selectedIds) {
  //       await axios.patch(`/admin/ask/update/${id}`, { askStatus: newStatus });
  //     }
  //     setSelectedIds([]);
  //     const res = await axios.get('/admin/ask/list');
  //     setAskList(res.data);
  //     const filtered = res.data.filter((item) => {
  //       const matchLecture = selectedLectureId === '전체' || item.lectureId === Number(selectedLectureId);
  //       const matchName = item.askName?.toLowerCase().includes(searchKeyword.toLowerCase());
  //       const matchStatus = statusFilter === '전체' || item.askStatus === statusFilter;
  //       return matchLecture && matchName && matchStatus;
  //     });
  //     setFilteredList(filtered);
  //     setCurrentPage(1);
  //   } catch (err) {
  //     alert('상태 변경 중 오류가 발생했습니다.');
  //   }
  // };

  const handleBulkChange = async (newStatus) => {
    if (selectedIds.length === 0) {
      alert('선택된 항목이 없습니다.');
      return;
    }

    try {
      for (const id of selectedIds) {
        try {
          await axios.patch(`/admin/ask/update/${id}`, { askStatus: newStatus });
        } catch (err) {
          if (err.response?.status === 404) {
            alert(`ID ${id}에 해당하는 신청자가 존재하지 않거나 연락처가 잘못되었습니다.`);
          } else {
            alert(`ID ${id} 상태 변경 중 오류가 발생했습니다.`);
          }
        }
      }

      setSelectedIds([]);
      const res = await axios.get('/admin/ask/list');
      setAskList(res.data);

      const filtered = res.data.filter((item) => {
        const matchLecture = selectedLectureId === '전체' || item.lectureId === Number(selectedLectureId);
        const matchName = item.askName?.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchStatus = statusFilter === '전체' || item.askStatus === statusFilter;
        return matchLecture && matchName && matchStatus;
      });
      setFilteredList(filtered);
      setCurrentPage(1);
    } catch (err) {
      alert('상태 변경 전체 처리 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'APPROVED': return '승인';
      case 'REJECTED': return '거절';
      case 'PENDING': return '보류';
      case 'WAITING': default: return '미처리';
    }
  };

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginated = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const isSelectable = (status) => status === 'WAITING' || status === 'PENDING';

  return (
    <AdminLayout>
      <PageMeta title="수강 신청 관리" description="지원자 현황을 확인하고 처리하세요." />
      <h1 className="text-2xl font-bold mb-6">수강 신청 관리</h1>

      <form className="flex flex-wrap gap-3 mb-4 items-center text-sm" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <select className="border border-gray-400 px-3 py-2 rounded" value={selectedLectureId} onChange={(e) => setSelectedLectureId(e.target.value)}>
          <option value="전체">전체 과정</option>
          {courses.map((c) => (<option key={c.lectureId} value={c.lectureId}>{c.lectureTitle}</option>))}
        </select>
        <select className="border border-gray-400 px-3 py-2 rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="전체">전체 상태</option>
          <option value="WAITING">미처리</option>
          <option value="APPROVED">승인</option>
          <option value="REJECTED">거절</option>
          <option value="PENDING">보류</option>
        </select>
        <input type="text" placeholder="신청자 이름" className="border border-gray-400 px-3 py-2 rounded w-full sm:w-64" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
        <button type="submit" className="bg-[#192a48] text-white px-4 py-2 rounded">조회</button>
      </form>

      <div className="flex justify-end gap-2 mb-2 text-sm">
        <button onClick={() => handleBulkChange('APPROVED')} className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50">수락</button>
        <button onClick={() => handleBulkChange('REJECTED')} className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50">거절</button>
        <button onClick={() => handleBulkChange('PENDING')} className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50">보류</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-t border-b border-gray-300 text-left min-w-[600px]">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-2 py-2 text-center">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedIds(
                      e.target.checked
                        ? paginated.filter(i => isSelectable(i.askStatus)).map(i => i.lectureAskId)
                        : []
                    )
                  }
                  checked={
                    paginated.filter(i => isSelectable(i.askStatus)).length > 0 &&
                    paginated.filter(i => isSelectable(i.askStatus)).every(i => selectedIds.includes(i.lectureAskId))
                  }
                />
              </th>
              <th className="px-2 py-2">요청일자</th>
              <th className="px-2 py-2">과정명</th>
              <th className="px-2 py-2 hidden sm:table-cell">문의내용</th>
              <th className="px-2 py-2">신청자</th>
              <th className="px-2 py-2">상태</th>
            </tr>
          </thead>
          <tbody>
          {paginated.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-6 text-gray-400">조건에 맞는 신청이 없습니다.</td></tr>
          ) : (
            paginated.map(item => {
              const isDisabled = !isSelectable(item.askStatus);
              return (
                <tr
                  key={item.lectureAskId}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setModalItem(item)}
                >
                  <td className="px-2 py-2 text-center cursor-default" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.lectureAskId)}
                      disabled={isDisabled}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleCheckbox(item.lectureAskId);
                      }}
                    />
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">{dayjs(item.askCreatedAt).format('YYYY-MM-DD')}</td>
                  <td className="px-2 py-2">{item.lectureTitle}</td>
                  <td className="px-2 py-2 truncate max-w-xs text-gray-800 hidden sm:table-cell">
                    {item.askMemo?.trim() ? item.askMemo : '-'}
                  </td>
                  <td className="px-2 py-2">{item.askName}</td>
                  <td className="px-2 py-2">{getStatusLabel(item.askStatus)}</td>
                </tr>
              );
            })
          )}
        </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between relative">
        <div className="text-sm">
          <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="border rounded px-2 py-1 border-gray-400 text-sm">
            <option value={10}>10개씩</option>
            <option value={20}>20개씩</option>
            <option value={30}>30개씩</option>
          </select>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
      </div>

      {modalItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-[#192a48]">신청 상세 정보</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p><strong>이름:</strong> {modalItem.askName}</p>
              <p><strong>연락처:</strong> {modalItem.askPhone}</p>
              <p><strong>과정:</strong> {modalItem.lectureTitle}</p>
              {modalItem.askMemo?.trim() && (
                <div>
                  <p className="mt-4"><strong>문의내용:</strong></p>
                  <p className="whitespace-pre-wrap border border-gray-200 bg-gray-50 p-2 rounded">{modalItem.askMemo}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button className="px-4 py-1 bg-[#192a48] text-white rounded hover:bg-[#142033]" onClick={() => setModalItem(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
