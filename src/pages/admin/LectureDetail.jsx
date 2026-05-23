// src/pages/admin/LectureDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';

export default function LectureDetail() {
  const { lectureId } = useParams();
  const navigate = useNavigate();

  const [lecture, setLecture] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, lecRes] = await Promise.all([
          axios.get('/admin/category/list'),
          axios.get(`/admin/lecture/${lectureId}`),
        ]);

        const categoryNameMap = {};
        catRes.data.forEach((c) => (categoryNameMap[c.lectureCategoryId] = c.lectureCategoryName));
        setCategoryMap(categoryNameMap);
        setLecture(lecRes.data);
      } catch (err) {
        alert('조회 실패');
        navigate('/admin/lecture/list');
      }
    };
    fetchData();
  }, [lectureId, navigate]);

  if (!lecture) return null;

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="과정 상세 조회" description="과정 정보를 확인합니다." />
        <Header />

        <section className="bg-white p-6 rounded-lg min-w-[1200px]">
          <h1 className="text-2xl font-bold mb-6">과정 상세 정보</h1>

          <table className="w-full border border-gray-300 text-sm">
            <tbody>
              {/* <Row label="카테고리" value={categoryMap[lecture.lectureCategoryId] || '-'} /> */}
              <Row label="과정명" value={lecture.lectureTitle} />
              <Row label="요약명" value={lecture.lectureShortTitle} />
              <Row label="최대 인원" value={`${lecture.lectureCapacity}명`} />
              <Row label="시작일" value={lecture.lectureStart} />
              <Row label="종료일" value={lecture.lectureEnd} />
              <Row label="시작 시간" value={lecture.lectureStartTime} />
              <Row label="종료 시간" value={lecture.lectureEndTime} />
              <Row label="우편번호" value={lecture.lecturePostcode} />
              <Row label="주소" value={`${lecture.lectureAddress} ${lecture.lectureAddressDetail}`} />
              <Row label="설명" value={lecture.lectureDescription || '-'} />
              {/* <Row
                label="과목 목록"
                value={
                  lecture.subjects?.length > 0
                    ? lecture.subjects.map((s, i) => (
                        <div key={s.subjectId} className="mb-1">{`${i + 1}. ${s.subjectTitle}`}</div>
                      ))
                    : '없음'
                }
              /> */}
            </tbody>
          </table>

          <div className="pt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/lecture/list')}
              className="px-4 py-2 border border-gray-400 rounded"
            >
              목록으로
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

const Row = ({ label, value }) => (
  <tr>
    <td className="w-40 font-medium border border-gray-300 px-3 py-2">{label}</td>
    <td className="border border-gray-300 px-3 py-2" colSpan="3">
      <div className="min-h-[30px]">{value}</div>
    </td>
  </tr>
);