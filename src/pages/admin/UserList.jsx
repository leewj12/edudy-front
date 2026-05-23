import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import Pagination from '../../components/Pagination';
import ExcelExportButton from '../../component/admin/ExcelExportButton';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';
import styles from '../../css/PrintOnly.module.css';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleToUpdate, setRoleToUpdate] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users/list');
      console.log('✅ 유저 목록:', res.data);
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('❌ 유저 목록 로딩 실패:', err);
      setUsers([]);
      setFiltered([]);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) setCurrentPage(1);
  }, [itemsPerPage, filtered]);

  const handleSearch = () => {
    const result = users
      .filter((u) => (roleFilter ? u.userRole === roleFilter : true))
      .filter((u) => search ? u.usersName.includes(search) || u.userEmail.includes(search) : true);
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleCheck = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const handleUpdateRole = async () => {
    if (!roleToUpdate || (roleToUpdate !== 'USER' && roleToUpdate !== 'INSTRUCTOR')) {
      return alert('변경할 등급을 선택하세요.');
    }
    if (selectedIds.length === 0) return alert('등급을 수정할 회원을 선택하세요.');

    try {
      for (const id of selectedIds) {
        await axios.patch(`/admin/users/update/${id}`, { newRole: roleToUpdate });
      }
      alert('등급이 성공적으로 수정되었습니다.');
      await fetchUsers();
      setSelectedIds([]);
      setRoleToUpdate('');
    } catch (err) {
      console.error('등급 수정 실패:', err);
      alert('등급 수정 중 오류 발생');
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'ADMIN': return '관리자';
      case 'INSTRUCTOR': return '강사';
      default: return '일반회원';
    }
  };

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="회원 등급 관리" description="회원 목록을 확인하고 관리할 수 있습니다." />
        <Header />
        <h1 className="text-2xl font-bold mb-6">회원 등급 관리</h1>

        {/* 필터 */}
        <form
          className="flex gap-4 mb-4 items-center text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          {/* 🔁 셀렉트 박스 먼저 */}
          <select
            className="border px-3 py-2 rounded"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">전체 등급</option>
            <option value="USER">일반회원</option>
            <option value="INSTRUCTOR">강사</option>
            <option value="ADMIN">관리자</option>
          </select>

          {/* 🔁 검색창 다음 */}
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색하세요"
            className="border px-3 py-2 rounded w-70"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit" className="bg-[#192a48] text-white px-4 py-2 rounded">조회</button>
        </form>

        {/* 액션버튼 */}
        <div className="flex justify-end gap-2 mb-2 text-sm">
          <select
            value={roleToUpdate}
            onChange={(e) => setRoleToUpdate(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1"
          >
            <option value="">등급 수정</option>
            <option value="USER">일반회원</option>
            <option value="INSTRUCTOR">강사</option>
          </select>
          <button onClick={handleUpdateRole} className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50">수정</button>
          <ExcelExportButton
            data={filtered}
            filename="회원목록"
            columns={[{ key: 'userId', label: 'ID' }, { key: 'usersName', label: '이름' }, { key: 'userEmail', label: '이메일' }, { key: 'userRole', label: '등급' }]}
          />
          <button onClick={() => window.print()} className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50">프린트</button>
        </div>

        {/* 테이블 */}
        <table 
          id="print-area"
          className="w-full text-sm border-t border-b border-gray-300 text-left"
        >
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-2 py-2 text-center no-print">
                <input
                  type="checkbox"
                  onChange={(e) => setSelectedIds(e.target.checked ? paginated.filter(i => i.userRole !== 'ADMIN').map(i => i.userId) : [])}
                  checked={paginated.length > 0 && paginated.filter(i => i.userRole !== 'ADMIN').every(i => selectedIds.includes(i.userId))}
                />
              </th>
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">이름</th>
              <th className="px-2 py-2">이메일</th>
              <th className="px-2 py-2">전화번호</th>
              <th className="px-2 py-2">성별</th>
              <th className="px-2 py-2">생년월일</th>
              <th className="px-2 py-2">등급</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-6 text-gray-400">조건에 맞는 회원이 없습니다.</td></tr>
            ) : (
              paginated.map(user => (
                <tr key={user.userId} className="border-b border-gray-200">
                  <td className="px-2 py-2 text-center no-print">
                    <input
                      type="checkbox"
                      disabled={user.userRole === 'ADMIN'}
                      checked={selectedIds.includes(user.userId)}
                      onChange={() => handleCheck(user.userId)}
                    />
                  </td>
                  <td className="px-2 py-2">{user.userId}</td>
                  <td className="px-2 py-2">{user.usersName}</td>
                  <td className="px-2 py-2">{user.userEmail}</td>
                  <td className="px-2 py-2">{user.userPhone}</td>
                  <td className="px-2 py-2">{user.userGender}</td>
                  <td className="px-2 py-2">{user.userBirth ? dayjs(user.userBirth).format('YYYY-MM-DD') : ''}</td>
                  <td className="px-2 py-2">{getRoleName(user.userRole)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이징 */}
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
      </main>
    </div>
  );
}