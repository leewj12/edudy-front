// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import Header from '../../components/Header';
// import PageMeta from '../../components/PageMeta';
// import axios from '../../api/axiosInstance';
// import dayjs from 'dayjs';

// export default function AdminNavigation() {
//   const [priorityList, setPriorityList] = useState([null, null, null, null, null]);
//   const [allLectures, setAllLectures] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLecture, setSelectedLecture] = useState(null);
//   const today = dayjs().format('YYYY-MM-DD');

//   const fetchLectures = async () => {
//     try {
//       const res = await axios.get('/admin/lecture/list');
//       console.log('📦 전체 강의 리스트:', res.data);
//       const sorted = res.data.filter(l => l.lecturePriority < 6).sort((a, b) => a.lecturePriority - b.lecturePriority);
//       const priorityArr = Array(5).fill(null);
//       sorted.forEach(l => {
//         priorityArr[l.lecturePriority - 1] = l;
//       });
//       setPriorityList(priorityArr);
//       setAllLectures(res.data);
//     } catch (e) {
//       console.error('강의 목록 불러오기 실패', e);
//     }
//   };

//   useEffect(() => {
//     fetchLectures();
//   }, []);

//   const handleAdd = async () => {
//     if (!selectedLecture) return;
//     const index = priorityList.findIndex(item => item === null);
//     try {
//       await axios.patch(`/admin/lecture/${selectedLecture.lectureId}/settings`, {
//         lecturePriority: index + 1
//       });
//       setShowModal(false);
//       setSelectedLecture(null);
//       fetchLectures();
//     } catch (e) {
//       alert('추가 실패');
//     }
//   };

//   const handleReplace = async (index) => {
//     if (!selectedLecture) return;
//     try {
//       const existing = priorityList[index];
//       if (existing) {
//         await axios.patch(`/admin/lecture/${existing.lectureId}/settings`, {
//           lecturePriority: 10
//         });
//       }
//       await axios.patch(`/admin/lecture/${selectedLecture.lectureId}/settings`, {
//         lecturePriority: index + 1
//       });
//       setShowModal(false);
//       setSelectedLecture(null);
//       fetchLectures();
//     } catch (e) {
//       alert('교체 실패');
//     }
//   };

//   const handleDelete = async (lectureId) => {
//     try {
//       await axios.patch(`/admin/lecture/${lectureId}/settings`, {
//         lecturePriority: 10
//       });
//       fetchLectures();
//     } catch (e) {
//       alert('삭제 실패');
//     }
//   };

//   const availableLectures = allLectures.filter(l => dayjs(l.lectureStart).isAfter(today));

//   return (
//     <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
//       <Sidebar />
//       <main className="flex-1 overflow-y-auto bg-white p-6">
//         <PageMeta title="사이트 노출 관리" description="사이트 노출 순위를 관리합니다." />
//         <Header />
//         <h1 className="text-2xl font-bold p-3">사이트 노출 관리</h1>

//         <div className="flex justify-end mb-2">
//           <button
//             className="border border-gray-400 px-4 py-2 rounded"
//             onClick={() => setShowModal(true)}
//             disabled={priorityList.every(p => p !== null)}
//           >
//             추가
//           </button>
//         </div>

//         <table className="w-full border-t border-b border-gray-300 text-center">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-2 border-y border-gray-300">우선순위</th>
//               <th className="py-2 border-y border-gray-300">요약 과정명</th>
//               <th className="py-2 border-y border-gray-300">전체 과정명</th>
//               <th className="py-2 border-y border-gray-300">카테고리</th>
//               <th className="py-2 border-y border-gray-300">과정 기간</th>
//               <th className="py-2 border-y border-gray-300">관리</th>
//             </tr>
//           </thead>
//           <tbody>
//             {priorityList.map((item, idx) => (
//               <tr key={idx} className="border-y border-gray-300">
//                 <td className="py-2">{idx + 1}</td>
//                 <td className="py-2">{item?.lectureShortTitle || '-'}</td>
//                 <td className="py-2">{item?.lectureTitle || '-'}</td>
//                 <td className="py-2">{item?.lectureCategoryName || '-'}</td>
//                 <td className="py-2">
//                   {item ? `${item.lectureStart} ~ ${item.lectureEnd}` : '-'}
//                 </td>
//                 <td className="py-2">
//                   {item && (
//                     <div className="flex justify-center gap-2">
//                       <button
//                         className="border border-gray-400 px-3 py-1 rounded"
//                         onClick={() => setShowModal(true)}
//                       >
//                         교체
//                       </button>
//                       {priorityList.findLastIndex(i => i !== null) === idx && (
//                         <button
//                           className="border border-gray-400 px-3 py-1 rounded"
//                           onClick={() => handleDelete(item.lectureId)}
//                         >
//                           삭제
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* 모달 */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white rounded shadow p-6 w-[700px] max-h-[80vh] overflow-y-auto">
//               <h2 className="text-lg font-bold mb-4">과정 선택</h2>
//               <table className="w-full text-sm border-t border-b border-gray-300 text-center">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="py-2">요약 과정명</th>
//                     <th className="py-2">전체 과정명</th>
//                     <th className="py-2">카테고리</th>
//                     <th className="py-2">선택</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {availableLectures.map((lecture) => (
//                     <tr key={lecture.lectureId} className="border-t border-gray-300">
//                       <td className="py-2">{lecture.lectureShortTitle}</td>
//                       <td className="py-2">{lecture.lectureTitle}</td>
//                       <td className="py-2">{lecture.lectureCategoryName}</td>
//                       <td className="py-2">
//                         <button
//                           className="border border-gray-400 px-3 py-1 rounded"
//                           onClick={() => {
//                             const index = priorityList.findIndex(p => p === null);
//                             if (priorityList.every(p => p !== null)) {
//                               const targetIdx = priorityList.findLastIndex(i => i !== null);
//                               handleReplace(targetIdx);
//                             } else {
//                               handleAdd();
//                             }
//                             setSelectedLecture(lecture);
//                           }}
//                         >
//                           선택
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="flex justify-end mt-4">
//                 <button
//                   className="border border-gray-400 px-4 py-2 rounded"
//                   onClick={() => {
//                     setShowModal(false);
//                     setSelectedLecture(null);
//                   }}
//                 >
//                   닫기
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';

export default function AdminNavigation() {
  const [priorityList, setPriorityList] = useState([null, null, null, null, null]);
  const [allLectures, setAllLectures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const today = dayjs().format('YYYY-MM-DD');

  const fetchLectures = async () => {
    try {
      const res = await axios.get('/admin/lecture/list');
      const sorted = res.data.filter(l => l.lecturePriority < 6).sort((a, b) => a.lecturePriority - b.lecturePriority);
      const priorityArr = Array(5).fill(null);
      sorted.forEach(l => {
        priorityArr[l.lecturePriority - 1] = l;
      });
      setPriorityList(priorityArr);
      setAllLectures(res.data);
      console.log(res.data);
    } catch (e) {
      console.error('강의 목록 불러오기 실패', e);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const handleAdd = async () => {
    if (!selectedLecture) return;
    const index = priorityList.findIndex(item => item === null);
    try {
      await axios.patch(`/admin/lecture/${selectedLecture.lectureId}/settings`, {
        lecturePriority: index + 1
      });
      setShowModal(false);
      setSelectedLecture(null);
      fetchLectures();
    } catch (e) {
      alert('추가 실패');
    }
  };

  const handleReplace = async (index) => {
    if (!selectedLecture) return;
    try {
      const existing = priorityList[index];
      if (existing) {
        await axios.patch(`/admin/lecture/${existing.lectureId}/settings`, {
          lecturePriority: 10
        });
      }
      await axios.patch(`/admin/lecture/${selectedLecture.lectureId}/settings`, {
        lecturePriority: index + 1
      });
      setShowModal(false);
      setSelectedLecture(null);
      fetchLectures();
    } catch (e) {
      alert('교체 실패');
    }
  };

  const handleDelete = async (lectureId) => {
    try {
      await axios.patch(`/admin/lecture/${lectureId}/settings`, {
        lecturePriority: 10
      });
      fetchLectures();
    } catch (e) {
      alert('삭제 실패');
    }
  };

  const availableLectures = allLectures
    .filter(l => dayjs(l.lectureStart).isAfter(today))
    .filter(l => !priorityList.some(p => p?.lectureId === l.lectureId)); // 우선순위 등록 강의 제외

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="사이트 노출 관리" description="사이트 노출 순위를 관리합니다." />
        <Header />
        <h1 className="text-2xl font-bold p-3">사이트 노출 관리</h1>

        {/* 추가 버튼: 우선순위 5개가 다 찼을 경우 숨김 */}
        {priorityList.some(p => p === null) && (
          <div className="flex justify-end mb-2">
            <button
              className="border border-gray-400 px-4 py-2 rounded"
              onClick={() => setShowModal(true)}
            >
              추가
            </button>
          </div>
        )}

        <table className="w-full border-t border-b border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 border-y border-gray-300">우선순위</th>
              <th className="py-2 border-y border-gray-300">요약 과정명</th>
              <th className="py-2 border-y border-gray-300">전체 과정명</th>
              <th className="py-2 border-y border-gray-300">카테고리</th>
              <th className="py-2 border-y border-gray-300">과정 기간</th>
              <th className="py-2 border-y border-gray-300">관리</th>
            </tr>
          </thead>
          <tbody>
            {priorityList.map((item, idx) => (
              <tr key={idx} className="border-y border-gray-300">
                <td className="py-2">{idx + 1}</td>
                <td className="py-2">{item?.lectureShortTitle || '-'}</td>
                <td className="py-2">{item?.lectureTitle || '-'}</td>
                <td className="py-2">{item?.lectureCategoryName || '-'}</td>
                <td className="py-2">
                  {item ? `${item.lectureStart} ~ ${item.lectureEnd}` : '-'}
                </td>
                <td className="py-2">
                  {item && (
                    <div className="flex justify-center gap-2">
                      <button
                        className="border border-gray-400 px-3 py-1 rounded"
                        onClick={() => {
                          setSelectedLecture(null); // 초기화 후 모달 오픈
                          setShowModal(true);
                        }}
                      >
                        교체
                      </button>
                      {priorityList.findLastIndex(i => i !== null) === idx && (
                        <button
                          className="border border-gray-400 px-3 py-1 rounded"
                          onClick={() => handleDelete(item.lectureId)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow p-6 w-[700px] max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">과정 선택</h2>
              <table className="w-full text-sm border-t border-b border-gray-300 text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2">요약 과정명</th>
                    <th className="py-2">전체 과정명</th>
                    <th className="py-2">카테고리</th>
                    <th className="py-2">선택</th>
                  </tr>
                </thead>
                <tbody>
                  {availableLectures.map((lecture) => (
                    <tr key={lecture.lectureId} className="border-t border-gray-300">
                      <td className="py-2">{lecture.lectureShortTitle}</td>
                      <td className="py-2">{lecture.lectureTitle}</td>
                      <td className="py-2">{lecture.lectureCategoryName}</td>
                      <td className="py-2">
                        <button
                          className={`border px-3 py-1 rounded ${selectedLecture?.lectureId === lecture.lectureId ? 'bg-gray-200' : 'border-gray-400'}`}
                          onClick={() => setSelectedLecture(lecture)}
                        >
                          선택
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 등록 / 닫기 버튼 */}
              <div className="flex justify-end mt-4 gap-2">
                {selectedLecture && (
                  <button
                    className="border border-gray-400 px-4 py-2 rounded"
                    onClick={() => {
                      if (priorityList.every(p => p !== null)) {
                        const targetIdx = priorityList.findLastIndex(p => p !== null);
                        handleReplace(targetIdx);
                      } else {
                        handleAdd();
                      }
                    }}
                  >
                    등록하기
                  </button>
                )}
                <button
                  className="border border-gray-400 px-4 py-2 rounded"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedLecture(null);
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}