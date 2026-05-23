import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';

export default function AdminBanner() {
  const [lectureList, setLectureList] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [priorityList, setPriorityList] = useState([null, null, null, null, null]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mode, setMode] = useState('add');
  const [targetIndex, setTargetIndex] = useState(null);

  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  const fetchData = async () => {
    try {
      const [lectureRes, bannerRes] = await Promise.all([
        axios.get('/admin/lecture/list'),
        axios.get('/admin/banner')
      ]);

      const today = dayjs().startOf('day');
      const filteredLectures = lectureRes.data
        .filter((lec) => dayjs(lec.lectureStart).isAfter(today))
        .map((lec) => {
          const banner = bannerRes.data.find(b => b.lectureId === lec.lectureId);
          return {
            ...lec,
            bannerId: banner?.bannerId || null,
            bannerImage: banner?.bannerImage || null,
            bannerPriority: banner?.bannerPriority ?? null
          };
        });

      const ordered = Array(5).fill(null);
      filteredLectures.forEach((lec) => {
        if (lec.bannerPriority && lec.bannerPriority >= 1 && lec.bannerPriority <= 5) {
          ordered[lec.bannerPriority - 1] = lec;
        }
      });

      setLectureList(filteredLectures);
      setBannerList(bannerRes.data);
      setPriorityList(ordered);
    } catch (e) {
      console.error('배너 또는 강의 불러오기 실패', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!selectedLecture) return alert('과정을 선택해주세요.');
    if (!imageFile && !selectedLecture.bannerImage) return alert('이미지를 등록해주세요.');

    try {
      const formData = new FormData();
      formData.append('lectureId', selectedLecture.lectureId.toString());
      formData.append('bannerPriority', (targetIndex + 1).toString());
      if (imageFile) formData.append('bannerImageFile', imageFile);

      for (let [k, v] of formData.entries()) {
      }

      if (selectedLecture.bannerId) {
        // 수정
        await axios.put(`/admin/banner/${selectedLecture.bannerId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // 신규 등록
        await axios.post('/admin/banner', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      alert('배너 등록/수정 완료');
      setShowModal(false);
      setImageFile(null);
      setSelectedLecture(null);
      fetchData();
    } catch (e) {
      console.error('배너 등록/수정 실패', e);
      alert('처리 실패');
    }
  };

  const handleDelete = async (lecture) => {
    if (!lecture.bannerId) return;
    try {
      const formData = new FormData();
      formData.append('lectureId', lecture.lectureId.toString());
      formData.append('bannerPriority', '10');
      await axios.put(`/admin/banner/${lecture.bannerId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchData();
    } catch (e) {
      alert('삭제 실패');
    }
  };

  const modalLectures = mode === 'add'
    ? lectureList.filter(l => !priorityList.some(p => p?.lectureId === l.lectureId))
    : lectureList;

  return (
    <AdminLayout>
      <PageMeta title="배너 관리" description="배너 우선순위를 설정합니다." />

      <h1 className="text-2xl font-bold mb-4">배너 우선순위 관리</h1>

      {priorityList.some(p => p === null) && (
        <div className="flex justify-end mb-2">
          <button
            className="border border-gray-400 px-4 py-2 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setMode('add');
              setTargetIndex(priorityList.findIndex(p => p === null));
              setShowModal(true);
            }}
          >
            추가
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-t border-b border-gray-300 text-center min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2">우선순위</th>
              <th className="py-2">배너 이미지</th>
              <th className="py-2">과정명</th>
              <th className="py-2 hidden sm:table-cell">기간</th>
              <th className="py-2">관리</th>
            </tr>
          </thead>
          <tbody>
          {priorityList.map((lec, idx) => {
            return (
              <tr key={idx} className="border-t border-gray-300">
                <td className="py-2">{idx + 1}</td>
                <td className="py-2">
                  {lec?.bannerImage ? (
                    <img src={`${imageBaseUrl}/upload/banner/${lec.bannerImage}`} className="w-30 h-12 mx-auto" />
                  ) : <img src='/no31.png' className="w-30  h-12 mx-auto" />}
                </td>
                <td className="py-2">{lec?.lectureTitle || '-'}</td>
                <td className="py-2 whitespace-nowrap hidden sm:table-cell">{lec ? `${lec.lectureStart} ~ ${lec.lectureEnd}` : '-'}</td>
                <td className="py-2">
                  {lec && (
                    <div className="flex justify-center gap-2">
                      <button
                        className="border border-gray-400 px-3 py-1 rounded cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setMode('replace');
                          setTargetIndex(idx);
                          setShowModal(true);
                        }}
                      >
                        교체
                      </button>
                      {priorityList.findLastIndex(i => i !== null) === idx && (
                        <button
                          className="border border-gray-400 px-3 py-1 rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => handleDelete(lec)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>

        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">강의 선택</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-t border-b border-gray-300 text-center min-w-[500px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2">배너 이미지</th>
                    <th className="py-2">과정명</th>
                    <th className="py-2 hidden sm:table-cell">기간</th>
                    <th className="py-2">선택</th>
                  </tr>
                </thead>
                <tbody>
                  {modalLectures.map((lec) => (
                    <tr key={lec.lectureId} className="border-t border-gray-300">
                      <td className="py-2">
                        {lec.bannerImage ? (
                          <img src={`${imageBaseUrl}/upload/banner/${lec.bannerImage}`} className="w-30  h-12 mx-auto" />
                        ) : <img src='/no31.png' className="w-30  h-12 mx-auto" />}
                      </td>
                      <td className="py-2">{lec.lectureTitle}</td>
                      <td className="py-2 hidden sm:table-cell">{lec.lectureStart} ~ {lec.lectureEnd}</td>
                      <td className="py-2">
                        <button
                          className={`border px-3 py-1 rounded cursor-pointer ${selectedLecture?.lectureId === lec.lectureId ? 'bg-gray-200' : 'border-gray-400'}`}
                          onClick={() => setSelectedLecture(lec)}
                        >
                          선택
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 이미지 수정부분 */}
            {selectedLecture && (
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">배너 이미지</h3>

                 {/* 숨겨진 input */}
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                 {/* 이미지 미리보기 (기존 또는 새 파일) */}
              <div className="flex justify-center">
                <img
                  src={
                    imageFile
                    ? URL.createObjectURL(imageFile) // 새로 업로드한 파일이 있을 경우 미리보기
                    : selectedLecture?.bannerImage
                      ? `${imageBaseUrl}/upload/banner/${selectedLecture.bannerImage}` // 기존 배너 이미지
                      : '/no31.png' // 기본 이미지 (public 폴더에 있어야 함)
                  }
                  className="h-32 cursor-pointer rounded"
                  alt="배너 이미지"
                  onClick={() => document.getElementById('imageInput').click()} // 클릭하면 input 트리거
                />
              </div>

              <p className="text-center text-sm text-gray-500 mt-2">이미지를 클릭해서 수정</p>
            </div>
            )}

            <div className="flex justify-end mt-4 gap-2">
              {selectedLecture && (
                <button
                  className="bg-[#192a48] text-white px-4 py-2 rounded hover:bg-[#142033] cursor-pointer"
                  onClick={handleUpload}
                >
                  등록하기
                </button>
              )}
              <button
                className="border border-gray-400 px-4 py-2 rounded cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setShowModal(false);
                  setSelectedLecture(null);
                  setImageFile(null);
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
