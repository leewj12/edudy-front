// src/pages/admin/LectureEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';

export default function LectureEdit() {
  const navigate = useNavigate();
  const { lectureId } = useParams();

  const [categoryList, setCategoryList] = useState([]);
  const [form, setForm] = useState({
    lectureCategory: '',
    lectureTitle: '',
    lectureShortTitle: '',
    lecturePostcode: '',
    lectureAddress: '',
    lectureAddressDetail: '',
    lectureCapacity: '',
    lectureStart: '',
    lectureEnd: '',
    lectureStartTime: '',
    lectureEndTime: '',
    lectureDescription: '',
    subjects: [{ subjectId: null, subjectTitle: '' }],
    lectureWarn: 0,
    lectureDanger: 0,
    lecturePriority: 0,
    lectureStatus: true,
  });
  const [LectureThumbnail, setLectureThumbnail] = useState(null);
  const [LectureContentImage, setLectureContentImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, lectureRes] = await Promise.all([
          axios.get('/admin/category/list'),
          axios.get(`/admin/lecture/${lectureId}`),
        ]);
        setCategoryList(categoryRes.data);

        // 기존 form은 유지하고 과목만 subjectTitles로 대체
        setForm((prev) => ({
          ...prev,
          ...lectureRes.data,
          lectureCategory: lectureRes.data.lectureCategoryId,
          subjects: lectureRes.data.subjects || [{ subjectId: null, subjectTitle: '' }],
          lectureWarn: lectureRes.data.lectureWarn ?? 0,
          lectureDanger: lectureRes.data.lectureDanger ?? 0,
          lecturePriority: lectureRes.data.lecturePriority ?? 0,
          lectureStatus: lectureRes.data.lectureStatus ?? true,
        }));
      } catch (err) {
        console.error('데이터 불러오기 실패', err);
        alert('수정할 데이터를 불러오지 못했습니다.');
        navigate('/admin/lecture/list');
      }
    };

    fetchData();
  }, [lectureId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm((prev) => ({
          ...prev,
          lecturePostcode: data.zonecode,
          lectureAddress: data.roadAddress,
        }));
      },
    }).open();
  };

  const handleSubjectChange = (index, value) => {
    const updated = [...form.subjects];
    updated[index].subjectTitle = value;
    setForm({ ...form, subjects: updated });
  };

  const addSubject = () => {
    setForm({ ...form, subjects: [...form.subjects, { subjectId: null, subjectTitle: '' }] });
  };

  const removeSubject = (index) => {
    const updated = [...form.subjects];
    updated.splice(index, 1);
    setForm({ ...form, subjects: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.lecturePostcode || !form.lectureAddress || !form.lectureAddressDetail.trim()) {
      alert('주소 정보를 모두 입력해주세요.');
      return;
    }

    const requestBody = {
      lectureTitle: form.lectureTitle,
      lectureShortTitle: form.lectureShortTitle,
      lectureDescription: form.lectureDescription,
      lecturePrice: 0,
      lectureCapacity: Number(form.lectureCapacity),
      lecturePostcode: form.lecturePostcode,
      lectureAddress: form.lectureAddress,
      lectureAddressDetail: form.lectureAddressDetail,
      lectureStart: form.lectureStart,
      lectureEnd: form.lectureEnd,
      lectureStartTime: form.lectureStartTime.length === 5 ? `${form.lectureStartTime}:00` : form.lectureStartTime,
      lectureEndTime: form.lectureEndTime.length === 5 ? `${form.lectureEndTime}:00` : form.lectureEndTime,
      lectureLayoutStart: `${form.lectureStart}T${form.lectureStartTime.length === 5 ? `${form.lectureStartTime}:00` : form.lectureStartTime}`,
      lectureLayoutEnd: `${form.lectureEnd}T${form.lectureEndTime.length === 5 ? `${form.lectureEndTime}:00` : form.lectureEndTime}`,
      lectureCategoryId: Number(form.lectureCategory),
      subjects: form.subjects.filter(s => s.subjectTitle.trim() !== ''),
      lectureWarn: form.lectureWarn,
      lectureDanger: form.lectureDanger,
      lecturePriority: form.lecturePriority,
      lectureStatus: form.lectureStatus,
    };

    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(requestBody)], { type: 'application/json' }));
    if (LectureThumbnail) formData.append('thumbnailFile', LectureThumbnail);
    if (LectureContentImage) formData.append('contentImageFile', LectureContentImage);

    try {
      await axios.put(`/admin/lecture/${lectureId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('과정이 성공적으로 수정되었습니다.');
      navigate('/admin/lecture/list');
    } catch (err) {
      console.error('수정 실패', err);
      alert('과정 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <AdminLayout>
      <PageMeta title="과정 수정" description="과정을 수정할 수 있습니다." />

      <section className="bg-white p-4 md:p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-6">과정 수정</h1>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm min-w-[500px]">
              <tbody>
                <tr>
                  <td className="w-28 md:w-40 font-medium border border-gray-300 px-3 py-2 bg-gray-50">카테고리</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <select name="lectureCategory" value={form.lectureCategory} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required>
                      <option value="">선택하세요</option>
                      {categoryList.map((cat) => (
                        <option key={cat.lectureCategoryId} value={cat.lectureCategoryId}>{cat.lectureCategoryName}</option>
                      ))}
                    </select>
                  </td>
                  <td className="w-28 md:w-40 font-medium border border-gray-300 px-3 py-2 bg-gray-50 hidden md:table-cell">과정명</td>
                  <td className="border border-gray-300 px-3 py-2 hidden md:table-cell">
                    <input type="text" name="lectureTitle" value={form.lectureTitle} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>
                <tr className="md:hidden">
                  <td className="w-28 font-medium border border-gray-300 px-3 py-2 bg-gray-50">과정명</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" name="lectureTitle" value={form.lectureTitle} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">요약명</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" name="lectureShortTitle" value={form.lectureShortTitle || ''} onChange={(e) => {
                      if (e.target.value.length <= 8) {
                        setForm({ ...form, lectureShortTitle: e.target.value });
                      }
                    }} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50 hidden md:table-cell">최대 인원</td>
                  <td className="border border-gray-300 px-3 py-2 hidden md:table-cell">
                    <input type="number" name="lectureCapacity" value={form.lectureCapacity} onChange={handleChange} min="1" className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>
                <tr className="md:hidden">
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">최대 인원</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" name="lectureCapacity" value={form.lectureCapacity} onChange={handleChange} min="1" className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">내용 이미지</td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <input type="file" accept="image/*" onChange={(e) => setLectureContentImage(e.target.files[0])} className="w-full text-sm" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">썸네일</td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <input type="file" accept="image/*" onChange={(e) => setLectureThumbnail(e.target.files[0])} className="w-full text-sm" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">시작 시간</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="time" name="lectureStartTime" value={form.lectureStartTime} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50 hidden md:table-cell">종료 시간</td>
                  <td className="border border-gray-300 px-3 py-2 hidden md:table-cell">
                    <input type="time" name="lectureEndTime" value={form.lectureEndTime} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>
                <tr className="md:hidden">
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">종료 시간</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="time" name="lectureEndTime" value={form.lectureEndTime} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">시작일</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="date" name="lectureStart" value={form.lectureStart} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50 hidden md:table-cell">종료일</td>
                  <td className="border border-gray-300 px-3 py-2 hidden md:table-cell">
                    <input type="date" name="lectureEnd" value={form.lectureEnd} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>
                <tr className="md:hidden">
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">종료일</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="date" name="lectureEnd" value={form.lectureEnd} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">우편번호</td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <div className="relative w-full">
                      <input type="text" name="lecturePostcode" value={form.lecturePostcode} readOnly className="w-full border border-gray-300 rounded px-3 py-2 pr-[100px]" required />
                      <button type="button" onClick={handlePostcode} className="absolute top-0 right-0 h-full bg-gray-500 text-white px-4 text-sm rounded-r hover:bg-gray-600">
                        주소 찾기
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">주소</td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <input type="text" name="lectureAddress" value={form.lectureAddress} readOnly className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">상세 주소</td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <input type="text" name="lectureAddressDetail" value={form.lectureAddressDetail} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 bg-gray-50">과정 설명</td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <input type="text" name="lectureDescription" value={form.lectureDescription} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 align-top bg-gray-50">과목</td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    {form.subjects.map((curr, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={curr.subjectTitle}
                          onChange={(e) => {
                            const updated = [...form.subjects];
                            updated[idx].subjectTitle = e.target.value;
                            setForm({ ...form, subjects: updated });
                          }}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder={`과목 ${idx + 1}`}
                          required
                        />
                        {form.subjects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = form.subjects.filter((_, i) => i !== idx);
                              setForm({ ...form, subjects: updated });
                            }}
                            className="text-red-500 text-sm border border-red-400 px-2 py-1 rounded hover:bg-red-100 min-w-13"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          subjects: [...form.subjects, { subjectId: null, subjectTitle: '' }],
                        })
                      }
                      className="mt-2 text-blue-600 underline text-sm"
                    >
                      + 과목 추가
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/admin/lecture/list')} className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-50">
              취소
            </button>
            <button type="submit" className="bg-[#192a48] hover:bg-[#142033] text-white px-6 py-2 rounded">
              수정
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}
