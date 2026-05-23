// src/pages/admin/LectureEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
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
    lectureCurriculum: [''],
  });
  const [LectureThumbnail, setLectureThumbnail] = useState(null);
  const [LectureContentImage, setLectureContentImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, lectureRes] = await Promise.all([
          axios.get('/admin/category/list'),
          axios.get(`/admin/lecture/${lectureId}`)
        ]);
        setCategoryList(categoryRes.data);
        setForm({
          ...lectureRes.data,
          lectureCategory: lectureRes.data.lectureCategoryId,
          lectureCurriculum: lectureRes.data.lectureCurriculum || ['']
        });
      } catch (err) {
        console.error("데이터 불러오기 실패", err);
        alert("수정할 데이터를 불러오지 못했습니다.");
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

  const handleCurriculumChange = (index, value) => {
    const updated = [...form.lectureCurriculum];
    updated[index] = value;
    setForm({ ...form, lectureCurriculum: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.lecturePostcode || !form.lectureAddress || !form.lectureAddressDetail.trim()) {
      alert('주소 정보를 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'lectureCategory') {
        formData.append('lectureCategoryId', value);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, value);
      }
    });
    if (LectureThumbnail) formData.append('LectureThumbnail', LectureThumbnail);
    if (LectureContentImage) formData.append('LectureContentImage', LectureContentImage);

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
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="과정 수정" description="과정을 수정할 수 있습니다." />
        <Header />
        <section className="bg-white p-6 rounded-lg min-w-[1200px]">
          <h1 className="text-2xl font-bold mb-6">과정 수정</h1>

          <form onSubmit={handleSubmit} className="w-full">
            <table className="w-full border border-gray-300 text-sm">
              <tbody>
                <tr>
                  <td className="w-40 font-medium border px-3 py-2">카테고리</td>
                  <td className="border px-3 py-2" colSpan={3}>
                    <select name="lectureCategory" value={form.lectureCategory} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded px-3 py-2">
                      <option value="">선택하세요</option>
                      {categoryList.map((cat) => (
                        <option key={cat.lectureCategoryId} value={cat.lectureCategoryId}>
                          {cat.lectureCategoryName}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border px-3 py-2">과정명</td>
                  <td className="border px-3 py-2">
                    <input type="text" name="lectureTitle" value={form.lectureTitle} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                  <td className="font-medium border px-3 py-2">요약명</td>
                  <td className="border px-3 py-2">
                    <input type="text" name="lectureShortTitle" value={form.lectureShortTitle} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border px-3 py-2">우편번호</td>
                  <td className="border px-3 py-2" colSpan={3}>
                    <div className="relative">
                      <input type="text" name="lecturePostcode" value={form.lecturePostcode} readOnly
                        className="w-full border border-gray-300 rounded px-3 py-2 pr-[100px]" />
                      <button type="button" onClick={handlePostcode}
                        className="absolute top-0 right-0 h-full bg-gray-500 text-white px-4 text-sm rounded-r hover:bg-gray-600">
                        주소 찾기
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border px-3 py-2">주소</td>
                  <td className="border px-3 py-2" colSpan={3}>
                    <input type="text" name="lectureAddress" value={form.lectureAddress} readOnly
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border px-3 py-2">상세 주소</td>
                  <td className="border px-3 py-2" colSpan={3}>
                    <input type="text" name="lectureAddressDetail" value={form.lectureAddressDetail} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border px-3 py-2">정원</td>
                  <td className="border px-3 py-2">
                    <input type="number" name="lectureCapacity" value={form.lectureCapacity} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                  <td className="font-medium border px-3 py-2">설명</td>
                  <td className="border px-3 py-2">
                    <input type="text" name="lectureDescription" value={form.lectureDescription} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border px-3 py-2">시작일</td>
                  <td className="border px-3 py-2">
                    <input type="date" name="lectureStart" value={form.lectureStart} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                  <td className="font-medium border px-3 py-2">종료일</td>
                  <td className="border px-3 py-2">
                    <input type="date" name="lectureEnd" value={form.lectureEnd} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border px-3 py-2">시작시간</td>
                  <td className="border px-3 py-2">
                    <input type="time" name="lectureStartTime" value={form.lectureStartTime} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                  <td className="font-medium border px-3 py-2">종료시간</td>
                  <td className="border px-3 py-2">
                    <input type="time" name="lectureEndTime" value={form.lectureEndTime} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border px-3 py-2 align-top">과목</td>
                  <td className="border px-3 py-2" colSpan={3}>
                    {form.lectureCurriculum.map((curr, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={curr}
                          onChange={(e) => handleCurriculumChange(idx, e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder={`과목 ${idx + 1}`}
                          required
                        />
                        {form.lectureCurriculum.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = form.lectureCurriculum.filter((_, i) => i !== idx);
                              setForm({ ...form, lectureCurriculum: updated });
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
                      onClick={() => setForm({ ...form, lectureCurriculum: [...form.lectureCurriculum, ''] })}
                      className="mt-2 text-blue-600 underline text-sm"
                    >
                      + 과목 추가
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pt-6 flex justify-end gap-3">
              <button type="button" onClick={() => navigate('/admin/lecture/list')}
                className="px-4 py-2 border border-gray-400 rounded">취소</button>
              <button type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">수정</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
