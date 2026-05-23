// import React, { useState , useEffect  } from 'react';
// import Sidebar from '../../components/Sidebar';
// import Header from '../../components/Header';
// import PageMeta from '../../components/PageMeta';
// import axios from '../../api/axiosInstance';
// import { useNavigate } from 'react-router-dom';

// export default function LectureForm() {
//   const navigate = useNavigate();
//   const [categoryList, setCategoryList] = useState([]); //카테고리 목록 

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get('/admin/category/list'); // ← API 경로 맞게 조정
//         console.log(res.data);
//         setCategoryList(res.data);
//       } catch (err) {
//         console.error("카테고리 목록 불러오기 실패", err);
//       }
//     };
  
//     fetchCategories();
//   }, []);

//   const [form, setForm] = useState({
//     lectureCategory: '',
//     lectureTitle: '',
//     lectureShortTitle: '', 
//     lecturePostcode: '',
//     lectureAddress: '',
//     lectureAddressDetail: '',
//     lectureCapacity: '',
//     lectureStart: '',
//     lectureEnd: '',
//     lectureStartTime: '',
//     lectureEndTime: '',
//     lectureDescription: '',
//     lectureCurriculum: [''],
//   });

//   const [LectureThumbnail, setLectureThumbnail] = useState(null);
//   const [LectureContentImage, setLectureContentImage] = useState(null);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handlePostcode = () => {
//     new window.daum.Postcode({
//       oncomplete: function (data) {
//         setForm((prev) => ({
//           ...prev,
//           lecturePostcode: data.zonecode,
//           lectureAddress: data.roadAddress,
//         }));
//       },
//     }).open();
//   };

//   const handleCurriculumChange = (index, value) => {
//     const updated = [...form.lectureCurriculum];
//     updated[index] = value;
//     setForm({ ...form, lectureCurriculum: updated });
//   };

//   const addCurriculumRow = () => {
//     setForm({ ...form, lectureCurriculum: [...form.lectureCurriculum, ''] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.lecturePostcode || !form.lectureAddress || !form.lectureAddressDetail.trim()) {
//       alert('주소 정보를 모두 입력해주세요.');
//       return;
//     }

//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (key === 'lectureCategory') {
//         formData.append('lectureCategoryId', value); // ✅ lectureCategory 대신 lectureCategoryId로 명시적 추가
//         return; // 이 항목은 처리했으니 아래 append는 생략
//       }
//       if (Array.isArray(value)) {
//         value.forEach((v) => formData.append(`${key}[]`, v));
//       } else {
//         formData.append(key, value);
//       }
//     });
//     if (LectureThumbnail) formData.append('LectureThumbnail', LectureThumbnail);
//     if (LectureContentImage) formData.append('LectureContentImage', LectureContentImage);

//     try {
//       for (let [key, value] of formData.entries()) {
//         console.log(`${key}:`, value); // <-- 여기가 중요!
//       }
    
//       await axios.post('/admin/lecture', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       console.log(formData);
//       alert('과정이 성공적으로 등록되었습니다.');
//       navigate('/admin/lecture/list');
//     } catch (err) {
//       console.error('등록 실패', err);
//       alert('과정 등록 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
//       <Sidebar />
//       <main className="flex-1 overflow-y-auto bg-white p-6">
//         <PageMeta title="과정 등록" description="새로운 과정를 등록할 수 있습니다." />
//         <Header />

//         <section className="bg-white p-6 rounded-lg min-w-[1200px]">
//           <h1 className="text-2xl font-bold mb-6">과정 등록</h1>

//           <form onSubmit={handleSubmit} className="w-full">

//             <table className="w-full border border-gray-300 text-sm">
//               <tbody>
//                 <tr>
//                   <td className="w-40 font-medium border border-gray-300 px-3 py-2">
//                     카테고리<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <select 
//                       name="lectureCategory" 
//                       value={form.lectureCategory} 
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2"
//                       required
//                     >
//                       <option value="">선택하세요</option>
//                       {categoryList.map((category) => (
//                         <option key={category.lectureCategoryId} value={category.lectureCategoryId}>
//                           {category.lectureCategoryName}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="w-40 font-medium border border-gray-300 px-3 py-2">
//                     과정명<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <input
//                       type="text"
//                       name="lectureTitle"
//                       value={form.lectureTitle}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2"
//                       required
//                     />
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     요약 과정명<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <input
//                       type="text"
//                       name="lectureShortTitle"
//                       value={form.lectureShortTitle || ''}
//                       onChange={(e) => {
//                         if (e.target.value.length <= 8) {
//                           setForm({ ...form, lectureShortTitle: e.target.value });
//                         }
//                       }}
//                       placeholder="최대 8자"
//                       className="w-full border border-gray-300 rounded px-3 py-2"
//                       required
//                     />
//                   </td>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     최대 인원<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <input
//                       type="number"
//                       name="lectureCapacity"
//                       value={form.lectureCapacity}
//                       onChange={handleChange}
//                       min="1"
//                       className="w-full border border-gray-300 rounded px-3 py-2"
//                       required
//                     />
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium border border-gray-300 px-3 py-2">과정 내용 이미지</td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <input type="file" accept="image/*" onChange={(e) => setLectureContentImage(e.target.files[0])}
//                       className="w-full border border-gray-300 rounded px-3 py-2" />
//                   </td>
//                   <td className="font-medium border border-gray-300 px-3 py-2">썸네일 이미지</td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <input type="file" accept="image/*" onChange={(e) => setLectureThumbnail(e.target.files[0])}
//                       className="w-full border border-gray-300 rounded px-3 py-2" />
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     시작 시간<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <input type="time" name="lectureStartTime" value={form.lectureStartTime} onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2" required />
//                   </td>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     종료 시간<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <input type="time" name="lectureEndTime" value={form.lectureEndTime} onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2" required />
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     시작일<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <input type="date" name="lectureStart" value={form.lectureStart} onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2" required />
//                   </td>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     종료일<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     <input type="date" name="lectureEnd" value={form.lectureEnd} onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2" required />
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     우편번호<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2" colSpan="3">
//                     <div className="relative w-full">
//                       <input
//                         type="text"
//                         name="lecturePostcode"
//                         value={form.lecturePostcode}
//                         readOnly
//                         className="w-full border border-gray-300 rounded px-3 py-2 pr-[100px]"
//                         required
//                       />
//                       <button
//                         type="button"
//                         onClick={handlePostcode}
//                         className="absolute top-0 right-0 h-full bg-gray-500 text-white px-4 text-sm rounded-r hover:bg-gray-600"
//                       >
//                         주소 찾기
//                       </button>
//                     </div>
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     주소<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2" colSpan="3">
//                     <input type="text" name="lectureAddress" value={form.lectureAddress} readOnly
//                       className="w-full border border-gray-300 rounded px-3 py-2" required />
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     상세 주소<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2" colSpan="3">
//                     <input type="text" name="lectureAddressDetail" value={form.lectureAddressDetail} onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2" required />
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium border border-gray-300 px-3 py-2">
//                     과정 설명
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2" colSpan="3">
//                     <input type="text" name="lectureDescription" value={form.lectureDescription} onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2" />
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium border border-gray-300 px-3 py-2 align-top">
//                     과목<span className="text-red-500">*</span>
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2" colSpan="3">
//                     {form.lectureCurriculum.map((curr, idx) => (
//                       <div key={idx} className="flex items-center gap-2 mb-2">
//                         <input
//                           type="text"
//                           value={curr}
//                           onChange={(e) => handleCurriculumChange(idx, e.target.value)}
//                           className="w-full border border-gray-300 rounded px-3 py-2"
//                           placeholder={`과목 ${idx + 1}`}
//                           required
//                         />
//                         {form.lectureCurriculum.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => {
//                               const updated = form.lectureCurriculum.filter((_, i) => i !== idx);
//                               setForm({ ...form, lectureCurriculum: updated });
//                             }}
//                             className="text-red-500 text-sm border border-red-400 px-2 py-1 rounded hover:bg-red-100 min-w-13"
//                           >
//                             삭제
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setForm({ ...form, lectureCurriculum: [...form.lectureCurriculum, ''] })
//                       }
//                       className="mt-2 text-blue-600 underline text-sm"
//                     >
//                       + 과목 추가
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             <div className="pt-6 flex justify-end gap-3">
//               <button type="button" onClick={() => navigate('/admin/lecture/list')}
//                 className="px-4 py-2 border border-gray-400 rounded">취소</button>
//               <button type="submit"
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">등록</button>
//             </div>
//           </form>
//         </section>
//       </main>
//     </div>
//   );
// }

import React, { useState , useEffect  } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function LectureForm() {
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]); //카테고리 목록 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/admin/category/list'); // ← API 경로 맞게 조정
        setCategoryList(res.data);
      } catch (err) {
        console.error("카테고리 목록 불러오기 실패", err);
      }
    };
  
    fetchCategories();
  }, []);

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

  const addCurriculumRow = () => {
    setForm({ ...form, lectureCurriculum: [...form.lectureCurriculum, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.lecturePostcode || !form.lectureAddress || !form.lectureAddressDetail.trim()) {
      alert('주소 정보를 모두 입력해주세요.');
      return;
    }
  
    const requestBody = {
      lecture: {
        lectureTitle: form.lectureTitle,
        lectureShortTitle: form.lectureShortTitle,
        lectureDescription: form.lectureDescription,
        lecturePrice: 0, // 가격 필드 없으면 0 처리하거나 필요한 경우 input 추가
        lectureCapacity: Number(form.lectureCapacity),
        lecturePostcode: form.lecturePostcode,
        lectureAddress: form.lectureAddress,
        lectureAddressDetail: form.lectureAddressDetail,
        lectureStart: form.lectureStart,
        lectureEnd: form.lectureEnd,
        // lectureStartTime: form.lectureStartTime,
        // lectureEndTime: form.lectureEndTime,
        // lectureLayoutStart: `${form.lectureStart}T${form.lectureStartTime}`,
        // lectureLayoutEnd: `${form.lectureEnd}T${form.lectureEndTime}`,
        lectureStartTime:
          form.lectureStartTime.length === 5
            ? `${form.lectureStartTime}:00`
            : form.lectureStartTime,
        lectureEndTime:
          form.lectureEndTime.length === 5
            ? `${form.lectureEndTime}:00`
            : form.lectureEndTime,
        lectureLayoutStart: `${form.lectureStart}T${
          form.lectureStartTime.length === 5
            ? `${form.lectureStartTime}:00`
            : form.lectureStartTime
        }`,
        lectureLayoutEnd: `${form.lectureEnd}T${
          form.lectureEndTime.length === 5
            ? `${form.lectureEndTime}:00`
            : form.lectureEndTime
        }`,
        lectureCategoryId: Number(form.lectureCategory),
      },
      subjectTitles: form.lectureCurriculum.filter(Boolean),
    };
  
    const formData = new FormData();
    formData.append(
      'request',
      new Blob([JSON.stringify(requestBody)], { type: 'application/json' })
    );
  
    if (LectureThumbnail) formData.append('thumbnailFile', LectureThumbnail);
    if (LectureContentImage) formData.append('contentImageFile', LectureContentImage);
  
    try {
      for (let [key, value] of formData.entries()) {
      }
  
      await axios.post('/admin/lecture/subjects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      alert('과정이 성공적으로 등록되었습니다.');
      navigate('/admin/lecture/list');
    } catch (err) {
      console.error('등록 실패', err);
      alert('과정 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="과정 등록" description="새로운 과정를 등록할 수 있습니다." />
        <Header />

        <section className="bg-white p-6 rounded-lg min-w-[1200px]">
          <h1 className="text-2xl font-bold mb-6">과정 등록</h1>

          <form onSubmit={handleSubmit} className="w-full">

            <table className="w-full border border-gray-300 text-sm">
              <tbody>
                <tr>
                  <td className="w-40 font-medium border border-gray-300 px-3 py-2">
                    카테고리<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <select 
                      name="lectureCategory" 
                      value={form.lectureCategory} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    >
                      <option value="">선택하세요</option>
                      {categoryList.map((category) => (
                        <option key={category.lectureCategoryId} value={category.lectureCategoryId}>
                          {category.lectureCategoryName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="w-40 font-medium border border-gray-300 px-3 py-2">
                    과정명<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      name="lectureTitle"
                      value={form.lectureTitle}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    요약 과정명<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      name="lectureShortTitle"
                      value={form.lectureShortTitle || ''}
                      onChange={(e) => {
                        if (e.target.value.length <= 8) {
                          setForm({ ...form, lectureShortTitle: e.target.value });
                        }
                      }}
                      placeholder="최대 8자"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </td>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    최대 인원<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      name="lectureCapacity"
                      value={form.lectureCapacity}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2">과정 내용 이미지</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="file" accept="image/*" onChange={(e) => setLectureContentImage(e.target.files[0])}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                  <td className="font-medium border border-gray-300 px-3 py-2">썸네일 이미지</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="file" accept="image/*" onChange={(e) => setLectureThumbnail(e.target.files[0])}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    시작 시간<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="time" name="lectureStartTime" value={form.lectureStartTime} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    종료 시간<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="time" name="lectureEndTime" value={form.lectureEndTime} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    시작일<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="date" name="lectureStart" value={form.lectureStart} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    종료일<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="date" name="lectureEnd" value={form.lectureEnd} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    우편번호<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <div className="relative w-full">
                      <input
                        type="text"
                        name="lecturePostcode"
                        value={form.lecturePostcode}
                        readOnly
                        className="w-full border border-gray-300 rounded px-3 py-2 pr-[100px]"
                        required
                      />
                      <button
                        type="button"
                        onClick={handlePostcode}
                        className="absolute top-0 right-0 h-full bg-gray-500 text-white px-4 text-sm rounded-r hover:bg-gray-600"
                      >
                        주소 찾기
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    주소<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <input type="text" name="lectureAddress" value={form.lectureAddress} readOnly
                      className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    상세 주소<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <input type="text" name="lectureAddressDetail" value={form.lectureAddressDetail} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" required />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2">
                    과정 설명
                  </td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
                    <input type="text" name="lectureDescription" value={form.lectureDescription} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </td>
                </tr>

                <tr>
                  <td className="font-medium border border-gray-300 px-3 py-2 align-top">
                    과목<span className="text-red-500">*</span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="3">
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
                      onClick={() =>
                        setForm({ ...form, lectureCurriculum: [...form.lectureCurriculum, ''] })
                      }
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">등록</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}