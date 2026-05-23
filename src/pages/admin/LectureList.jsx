// src/pages/admin/CourseList.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import { Link } from 'react-router-dom';

export default function LectureList() {
  const [lectures, setLecture] = useState([]);

  useEffect(() => {
    fetchLecture();
  }, []);

  const fetchLecture = async () => {
    try {
      const res = await axios.get('/admin/lecture/list');
      console.log("불러온 데이터",res.data);
      setLecture(res.data);
      
    } catch (err) {
      console.error("강의 목록 불러오기 실패", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/admin/lecture/${id}`);
      await fetchLecture();
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="강의 목록" description="등록된 강의 정보를 확인하고 관리할 수 있습니다." />
        <Header />

        <section className="bg-white p-6 mt-4 rounded-lg border border-gray-200 min-w-[1200px] shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">강의 목록</h1>
            <button
              onClick={() => window.location.href = '/admin/lecture/new'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              강의 등록
            </button>
          </div>

          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-2">강의명</th>
                <th className="border px-2 py-2">훈련기간</th>
                <th className="border px-2 py-2">대기인원</th>
                <th className="border px-2 py-2">모집인원</th>
                <th className="border px-2 py-2">모집율</th>
                <th className="border px-2 py-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture) => (
                <tr key={lecture.lectureId}>
                  <td className="border px-2 py-2 text-center">{lecture.lectureTitle}</td>
                  <td className="border px-2 py-2 text-center">{lecture.lectureStart} ~ {lecture.lectureEnd}</td>
                  <td className="border px-2 py-2 text-center">{lecture.lectureWaiting}명</td>
                  <td className="border px-2 py-2 text-center">{lecture.lectureEnrolled}/{lecture.lectureCapacity}명</td>
                  <td className="border px-2 py-2 text-center">{Math.round((lecture.lectureEnrolled / lecture.lectureCapacity) * 100)}%</td>
                  <td className="border px-2 py-2 text-center">
                  <Link
                    to={`/admin/lecture/edit/${lecture.lectureId}`}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(lecture.lectureId)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
              {lectures.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">등록된 강의가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
