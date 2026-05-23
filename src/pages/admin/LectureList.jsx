// src/pages/admin/CourseList.jsx
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function LectureList() {
  const [lectures, setLecture] = useState([]);
  const navigate = useNavigate();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchLecture();
  }, []);

  const fetchLecture = async () => {
    try {
      const res = await axios.get('/admin/lecture/list');
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
    <AdminLayout>
      <PageMeta title="강의 목록" description="등록된 강의 정보를 확인하고 관리할 수 있습니다." />

      <section className="mt-4 text-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">강의 목록</h1>
          {userRole !== 'ROLE_INSTRUCTOR' && (
          <button
            onClick={() => window.location.href = '/admin/lecture/new'}
            className="border border-gray-400 px-3 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
          >
            강의 등록
          </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-t border-gray-200 text-center min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">강의명</th>
                <th className="py-2 px-3">훈련기간</th>
                <th className="py-2 px-3">대기인원</th>
                <th className="py-2 px-3">모집인원</th>
                <th className="py-2 px-3">모집율</th>
                {userRole !== 'ROLE_INSTRUCTOR' && (
                  <th className="py-2 px-3">관리</th>
                )}
              </tr>
            </thead>
            <tbody>

            {lectures.map((lecture) => (
              <tr
                key={lecture.lectureId}
                className="border-b hover:bg-gray-50 cursor-pointer border-gray-200"
                onClick={() => navigate(`/admin/lecture/${lecture.lectureId}`)}
              >
                <td className="py-2 px-3 font-medium">{lecture.lectureTitle}</td>
                <td className="py-2 px-3 whitespace-nowrap">{lecture.lectureStart} ~ {lecture.lectureEnd}</td>
                <td className="py-2 px-3">{lecture.lectureWaiting}명</td>
                <td className="py-2 px-3">{lecture.lectureEnrolled}/{lecture.lectureCapacity}명</td>
                <td className="py-2 px-3">
                  {lecture.lectureCapacity > 0
                    ? `${Math.round((lecture.lectureEnrolled / lecture.lectureCapacity) * 100)}%`
                    : '0%'}
                </td>

                {userRole !== 'ROLE_INSTRUCTOR' && (
                  <td className="py-2 px-3 space-x-2">
                    <Link
                      to={`/admin/lecture/edit/${lecture.lectureId}`}
                      onClick={(e) => e.stopPropagation()} // ✅ 행 클릭 방지
                      className="inline-block border border-gray-400 px-2.5 py-1 rounded text-sm text-black hover:bg-gray-100"
                    >
                      수정
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ 행 클릭 방지
                        handleDelete(lecture.lectureId);
                      }}
                      className="inline-block border border-gray-400 px-2.5 py-1 rounded text-sm text-black hover:bg-gray-100"
                    >
                      삭제
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {lectures.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  등록된 강의가 없습니다.
                </td>
              </tr>
            )}

            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
