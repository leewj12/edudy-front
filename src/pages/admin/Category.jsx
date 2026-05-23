import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/admin/category/list');
      setCategories(res.data);
    } catch (e) {
      console.error('카테고리 불러오기 실패:', e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.trim().length === 0 || newCategory.trim().length > 10) {
      return alert('카테고리명은 1~10자 이내로 입력해주세요.');
    }
    try {
      await axios.post('/admin/category', { lectureCategoryName: newCategory.trim() });
      setShowModal(false);
      setNewCategory('');
      fetchCategories();
    } catch (e) {
      console.error('카테고리 추가 실패:', e);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (editingName.trim().length === 0 || editingName.trim().length > 10) {
      return alert('카테고리명은 1~10자 이내로 입력해주세요.');
    }
    try {
      await axios.patch(`/admin/category/${id}`, { lectureCategoryName: editingName.trim() });
      setEditingId(null);
      fetchCategories();
    } catch (e) {
      console.error('수정 실패:', e);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/admin/category/${id}`);
    } catch (err) {
      const errData = err.response.data;
      alert(errData.message || '삭제 실패');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return alert('삭제할 카테고리를 선택하세요.');
    if (!window.confirm('선택한 카테고리를 삭제하시겠습니까?')) return;

    try {
      for (const id of selectedIds) {
        await handleDeleteCategory(id);
      }
      setSelectedIds([]);
      setSelectAll(false);
      fetchCategories();
    } catch (e) {
      alert('일괄 삭제 중 오류가 발생했습니다.');
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const allIds = categories.map((c) => c.lectureCategoryId);
      setSelectedIds(allIds);
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <AdminLayout>
      
        <PageMeta title="카테고리 관리" description="과정 카테고리를 관리합니다." />

        <h1 className="text-2xl font-bold p-3">카테고리 관리</h1>

        <section className="bg-white p-3 text-sm">
          <div className="flex justify-end gap-2 mb-4">
            <button className="border border-gray-400 px-2 py-2 rounded cursor-pointer" onClick={() => setShowModal(true)}>
              카테고리 추가
            </button>
            <button className="border border-gray-400 px-2 py-2 rounded cursor-pointer" onClick={handleBulkDelete}>
              삭제
            </button>
          </div>

          <table className="w-full text-sm border-t border-b border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border-y border-gray-300">
                  <input type="checkbox" className='cursor-pointer' checked={selectAll} onChange={toggleSelectAll} />
                </th>
                <th className="px-3 py-2 border-y border-gray-300">카테고리명</th>
                <th className="px-3 py-2 border-y border-gray-300">수정</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((c) => (
                <tr key={c.lectureCategoryId} className="text-center">
                  <td className="px-3 py-2 border-y border-gray-300">
                    <input
                      type="checkbox"
                      className='cursor-pointer'
                      checked={selectedIds.includes(c.lectureCategoryId)}
                      onChange={() => toggleSelectOne(c.lectureCategoryId)}
                    />
                  </td>
                  <td className="px-3 py-2 border-y border-gray-300">
                    {editingId === c.lectureCategoryId ? (
                      <input
                        type="text"
                        maxLength={10}
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateCategory(c.lectureCategoryId);
                        }}
                        className="border border-gray-400 px-2 py-1 rounded "
                      />
                    ) : (
                      c.lectureCategoryName
                    )}
                  </td>
                  <td className="px-3 py-2 border-y border-gray-300">
                    {editingId === c.lectureCategoryId ? (
                      <div className="flex justify-center gap-2">
                        <button
                          className="border border-gray-400 px-3 py-1 rounded cursor-pointer"
                          onClick={() => handleUpdateCategory(c.lectureCategoryId)}
                        >
                          완료
                        </button>
                        <button
                          className="border border-gray-400 px-3 py-1 rounded cursor-pointer"
                          onClick={() => setEditingId(null)}
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        className="border border-gray-400 px-3 py-1 rounded cursor-pointer"
                        onClick={() => {
                          setEditingId(c.lectureCategoryId);
                          setEditingName(c.lectureCategoryName);
                        }}
                      >
                        수정
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-lg font-bold mb-4">카테고리 추가</h2>
              <input
                type="text"
                maxLength={10}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                }}
                placeholder="카테고리명 입력 (최대 10자)"
                className="w-full border px-3 py-2 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 border rounded cursor-pointer" onClick={() => setShowModal(false)}>취소</button>
                <button className="px-4 py-2 border rounded bg-gray-100 cursor-pointer" onClick={handleAddCategory}>등록</button>
              </div>
            </div>
          </div>
        )}
      
    </AdminLayout>
  );
}