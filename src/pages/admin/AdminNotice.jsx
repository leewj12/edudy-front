// src/pages/admin/AdminNoticePage.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';

export default function AdminNoticePage() {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ type: '', title: '' });
  const [form, setForm] = useState({ type: '공지', title: '' });

  useEffect(() => {
    const saved = localStorage.getItem('notices');
    if (saved) {
      setNotices(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const today = dayjs().format('YYYY-MM-DD');
    const newNotice = [form.type, form.title.trim(), today];
    const updated = [newNotice, ...notices];

    setNotices(updated);
    localStorage.setItem('notices', JSON.stringify(updated));
    setForm({ type: '공지', title: '' });
    setIsModalOpen(false);
  };

  const startEdit = (index) => {
    const [type, title] = notices[index];
    setEditingIndex(index);
    setEditForm({ type, title });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditForm({ type: '', title: '' });
  };

  const saveEdit = (index) => {
    const updated = [...notices];
    updated[index][0] = editForm.type;
    updated[index][1] = editForm.title.trim();
    setNotices(updated);
    localStorage.setItem('notices', JSON.stringify(updated));
    cancelEdit();
  };

  const deleteNotice = (index) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updated = notices.filter((_, i) => i !== index);
      setNotices(updated);
      localStorage.setItem('notices', JSON.stringify(updated));
    }
  };

  return (
    <AdminLayout>
      
        <PageMeta title="공지사항 관리" description="운영 공지사항을 확인하고 등록할 수 있습니다." />

        <div className="max-w-[1300px] mx-auto mt-6">
          <h1 className="text-xl font-semibold mb-6">운영 공지사항</h1>

          {/* 등록 폼 */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-6">
            <select name="type" value={form.type} onChange={handleChange} className="border border-gray-300 rounded px-2 py-1">
              <option value="공지">공지</option>
              <option value="강의">강의</option>
              <option value="일정">일정</option>
            </select>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="공지 제목을 입력하세요"
              className="flex-1 border border-gray-300 rounded px-3 py-1"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600"
            >
              등록
            </button>
          </form>

          {/* 공지 테이블 */}
          <table className="w-full border-t border-b border-gray-300 text-center">
            <thead className="bg-gray-50 border-b border-gray-300 text-xs text-gray-500">
              <tr>
                <th className="py-2">분류</th>
                <th className="py-2">제목</th>
                <th className="py-2">공지일자</th>
                <th className="py-2">관리</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {notices.map(([type, title, date], idx) => (
                <tr key={idx} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="py-2 px-2">
                    {editingIndex === idx ? (
                      <select
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="공지">공지</option>
                        <option value="강의">강의</option>
                        <option value="일정">일정</option>
                      </select>
                    ) : (
                      type
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {editingIndex === idx ? (
                      <input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      title
                    )}
                  </td>
                  <td className="py-2 px-2 text-gray-500">{date}</td>
                  <td className="py-2 px-2 space-x-2">
                    {editingIndex === idx ? (
                      <>
                        <button onClick={() => saveEdit(idx)} className="px-2 py-1 border border-gray-300 rounded">저장</button>
                        <button onClick={cancelEdit} className="px-2 py-1 border border-gray-300 rounded">취소</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(idx)} className="px-2 py-1 border border-gray-300 rounded">수정</button>
                        <button onClick={() => deleteNotice(idx)} className="px-2 py-1 border border-gray-300 rounded">삭제</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-4">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      
    </AdminLayout>
  );
}