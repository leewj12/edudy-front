// ✅ AdminBanner.jsx (중요 부분만 정리)
// AdminBanner.jsx 전체 리팩토링된 코드

// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import Header from '../../components/Header';
// import PageMeta from '../../components/PageMeta';
// import axios from '../../api/axiosInstance';
// import dayjs from 'dayjs';

// export default function AdminBanner() {
//   const [priorityList, setPriorityList] = useState([null, null, null, null, null]);
//   const [allLectures, setAllLectures] = useState([]);
//   const [bannerList, setBannerList] = useState([]);
//   const [selectedLecture, setSelectedLecture] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [mode, setMode] = useState('add'); // 'add' or 'replace'
//   const [targetIndex, setTargetIndex] = useState(null);

//   const today = dayjs().format('YYYY-MM-DD');

//   const fetchData = async () => {
//     try {
//       const [lectureRes, bannerRes] = await Promise.all([
//         axios.get('/admin/lecture/list'),
//         axios.get('/admin/banner')
//       ]);

//       const lectures = lectureRes.data.filter(l => dayjs(l.lectureStart).isAfter(today));
//       const banners = bannerRes.data;
//       const lectureWithBanner = lectures.map(l => ({
//         ...l,
//         banner: banners.find(b => b.lectureId === l.lectureId) || null
//       }));

//       const priorityArr = Array(5).fill(null);
//       lectureWithBanner.forEach(l => {
//         if (l.banner?.bannerPriority >= 1 && l.banner?.bannerPriority <= 5) {
//           priorityArr[l.banner.bannerPriority - 1] = l;
//         }
//       });

//       setAllLectures(lectureWithBanner);
//       setBannerList(banners);
//       setPriorityList(priorityArr);
//     } catch (e) {
//       console.error('배너 또는 강의 불러오기 실패', e);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = async (lecture) => {
//     try {
//       await axios.patch(`/admin/banner/${lecture.banner.bannerId}/settings`, {
//         bannerPriority: 10
//       });
//       fetchData();
//     } catch (e) {
//       alert('삭제 실패');
//     }
//   };

//   const handleRegister = async () => {
//     if (!selectedLecture || (selectedLecture.banner === null && !imageFile)) {
//       return alert('모든 항목을 입력해주세요.');
//     }
//     const priority = mode === 'replace' ? targetIndex + 1 : priorityList.findIndex(p => p === null) + 1;
//     try {
//       if (mode === 'replace' && priorityList[targetIndex]?.banner) {
//         await axios.patch(`/admin/banner/${priorityList[targetIndex].banner.bannerId}/settings`, {
//           bannerPriority: 10
//         });
//       }

//       if (selectedLecture.banner) {
//         if (imageFile) {
//           const formData = new FormData();
//           formData.append('lectureId', selectedLecture.lectureId);
//           formData.append('bannerPriority', priority);
//           formData.append('bannerImageFile', imageFile);
//           await axios.put(`/admin/banner/${selectedLecture.banner.bannerId}`, formData);
//         } else {
//           await axios.patch(`/admin/banner/${selectedLecture.banner.bannerId}/settings`, {
//             bannerPriority: priority
//           });
//         }
//       } else {
//         const formData = new FormData();
//         formData.append('lectureId', selectedLecture.lectureId);
//         formData.append('bannerPriority', priority);
//         formData.append('bannerImageFile', imageFile);
//         await axios.post('/admin/banner', formData);
//       }

//       setShowModal(false);
//       setSelectedLecture(null);
//       setImageFile(null);
//       fetchData();
//       alert('등록 완료');
//     } catch (e) {
//       alert('등록 실패');
//     }
//   };

//   const openAddModal = () => {
//     setMode('add');
//     setShowModal(true);
//     setSelectedLecture(null);
//     setImageFile(null);
//   };

//   const openReplaceModal = (idx) => {
//     setMode('replace');
//     setTargetIndex(idx);
//     setShowModal(true);
//     setSelectedLecture(null);
//     setImageFile(null);
//   };

//   const modalLectures = mode === 'add'
//     ? allLectures.filter(l => !l.banner || l.banner.bannerPriority === 10)
//     : allLectures;

//   return (
//     <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
//       <Sidebar />
//       <main className="flex-1 overflow-y-auto bg-white p-6">
//         <PageMeta title="배너 관리" description="메인 배너 순위를 관리합니다." />
//         <Header />

//         <h1 className="text-2xl font-bold p-3">메인 배너 관리</h1>

//         {priorityList.some(p => p === null) && (
//           <div className="flex justify-end mb-2">
//             <button
//               className="border border-gray-400 px-4 py-2 rounded"
//               onClick={openAddModal}
//             >
//               추가
//             </button>
//           </div>
//         )}

//         <table className="w-full border-t border-b border-gray-300 text-center">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-2">우선순위</th>
//               <th className="py-2">배너 이미지</th>
//               <th className="py-2">과정명</th>
//               <th className="py-2">카테고리</th>
//               <th className="py-2">기간</th>
//               <th className="py-2">관리</th>
//             </tr>
//           </thead>
//           <tbody>
//             {priorityList.map((item, idx) => (
//               <tr key={idx} className="border-y border-gray-300">
//                 <td className="py-2">{idx + 1}</td>
//                 <td className="py-2">
//                   {item?.banner?.bannerImageUrl ? (
//                     <img src={item.banner.bannerImageUrl} className="w-32 h-16 object-cover inline-block" />
//                   ) : '-'}
//                 </td>
//                 <td className="py-2">{item?.lectureTitle || '-'}</td>
//                 <td className="py-2">{item?.lectureCategoryName || '-'}</td>
//                 <td className="py-2">{item ? `${item.lectureStart} ~ ${item.lectureEnd}` : '-'}</td>
//                 <td className="py-2">
//                   {item && (
//                     <div className="flex justify-center gap-2">
//                       <button
//                         className="border border-gray-400 px-3 py-1 rounded"
//                         onClick={() => openReplaceModal(idx)}
//                       >
//                         교체
//                       </button>
//                       {priorityList.findLastIndex(i => i !== null) === idx && (
//                         <button
//                           className="border border-gray-400 px-3 py-1 rounded"
//                           onClick={() => handleDelete(item)}
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

//         {showModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white rounded shadow p-6 w-[700px] max-h-[80vh] overflow-y-auto">
//               <h2 className="text-lg font-bold mb-4">과정 선택</h2>
//               <table className="w-full text-sm border-t border-b border-gray-300 text-center">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="py-2">이미지</th>
//                     <th className="py-2">과정명</th>
//                     <th className="py-2">우선순위</th>
//                     <th className="py-2">선택</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {modalLectures.map((lecture) => (
//                     <tr key={lecture.lectureId} className="border-t border-gray-300">
//                       <td className="py-2">
//                         {lecture.banner?.bannerImageUrl ? (
//                           <img src={lecture.banner.bannerImageUrl} className="w-32 h-16 object-cover inline-block" />
//                         ) : (
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={e => setImageFile(e.target.files[0])}
//                             className="text-sm"
//                           />
//                         )}
//                       </td>
//                       <td className="py-2">{lecture.lectureTitle}</td>
//                       <td className="py-2">{lecture.banner?.bannerPriority || '-'}</td>
//                       <td className="py-2">
//                         <button
//                           className={`border px-3 py-1 rounded ${selectedLecture?.lectureId === lecture.lectureId ? 'bg-gray-200' : 'border-gray-400'}`}
//                           onClick={() => setSelectedLecture(lecture)}
//                         >
//                           선택
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="flex justify-end mt-4 gap-2">
//                 {selectedLecture && (
//                   <button
//                     className="border border-gray-400 px-4 py-2 rounded"
//                     onClick={handleRegister}
//                   >
//                     등록하기
//                   </button>
//                 )}
//                 <button
//                   className="border border-gray-400 px-4 py-2 rounded"
//                   onClick={() => setShowModal(false)}
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

export default function AdminBanner() {
  const [lectureList, setLectureList] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [priorityList, setPriorityList] = useState([null, null, null, null, null]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mode, setMode] = useState('add');
  const [targetIndex, setTargetIndex] = useState(null);

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
        console.log(`${k}:`, v);
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
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="배너 관리" description="배너 우선순위를 설정합니다." />
        <Header />

        <h1 className="text-2xl font-bold p-3">배너 우선순위 관리</h1>

        {priorityList.some(p => p === null) && (
          <div className="flex justify-end mb-2">
            <button
              className="border border-gray-400 px-4 py-2 rounded"
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

        <table className="w-full border-t border-b border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2">우선순위</th>
              <th className="py-2">배너 이미지</th>
              <th className="py-2">과정명</th>
              <th className="py-2">기간</th>
              <th className="py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {priorityList.map((lec, idx) => (
              <tr key={idx} className="border-t border-gray-300">
                <td className="py-2">{idx + 1}</td>
                <td className="py-2">
                  {lec?.bannerImage ? (
                    // <img src={lec.bannerImage} className="h-12 mx-auto" />
                    // <img src={`http://localhost:8083/upload/banner/image/${lec.bannerImage}`} className="h-12 mx-auto" />
                    <img src={`http://localhost:8083${lec.bannerImage}`} className="h-12 mx-auto" />
                  ) : '-'}
                </td>
                <td className="py-2">{lec?.lectureTitle || '-'}</td>
                <td className="py-2">{lec ? `${lec.lectureStart} ~ ${lec.lectureEnd}` : '-'}</td>
                <td className="py-2">
                  {lec && (
                    <div className="flex justify-center gap-2">
                      <button
                        className="border border-gray-400 px-3 py-1 rounded"
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
                          className="border border-gray-400 px-3 py-1 rounded"
                          onClick={() => handleDelete(lec)}
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

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow p-6 w-[700px] max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">강의 선택</h2>
              <table className="w-full text-sm border-t border-b border-gray-300 text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2">배너 이미지</th>
                    <th className="py-2">과정명</th>
                    <th className="py-2">기간</th>
                    <th className="py-2">선택</th>
                  </tr>
                </thead>
                <tbody>
                  {modalLectures.map((lec) => (
                    <tr key={lec.lectureId} className="border-t border-gray-300">
                      <td className="py-2">
                        {lec.bannerImage ? (
                          // <img src={lec.bannerImage} className="h-12 mx-auto" />
                          <img src={`http://localhost:8083${lec.bannerImage}`} className="h-12 mx-auto" />
                        ) : '없음'}
                      </td>
                      <td className="py-2">{lec.lectureTitle}</td>
                      <td className="py-2">{lec.lectureStart} ~ {lec.lectureEnd}</td>
                      <td className="py-2">
                        <button
                          className={`border px-3 py-1 rounded ${selectedLecture?.lectureId === lec.lectureId ? 'bg-gray-200' : 'border-gray-400'}`}
                          onClick={() => setSelectedLecture(lec)}
                        >
                          선택
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedLecture && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">배너 이미지</h3>
                  {selectedLecture.bannerImage ? (
                    // <img src={selectedLecture.bannerImage} className="h-32 mx-auto mb-2" />
                    <img src={`http://localhost:8083${selectedLecture.bannerImage}`} className="h-32 mx-auto mb-2" />
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                  )}
                </div>
              )}

              <div className="flex justify-end mt-4 gap-2">
                {selectedLecture && (
                  <button
                    className="border border-gray-400 px-4 py-2 rounded"
                    onClick={handleUpload}
                  >
                    등록하기
                  </button>
                )}
                <button
                  className="border border-gray-400 px-4 py-2 rounded"
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
      </main>
    </div>
  );
}