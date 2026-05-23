// import React, {  useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import Header from '../../components/Header';
// import PageMeta from '../../components/PageMeta';
// import Pagination from '../../components/Pagination';

// export default function AttendanceSetting() {

//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [searchCourse, setSearchCourse] = useState(''); // 실제 조회된 값
//   const [isSearched, setIsSearched] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [isInitialSelect, setIsInitialSelect] = useState(true);

//   const dummyData = [
//     {
//       id: 1,
//       name: '박종원(970505)',
//       lecture: '프로젝트기반 자바&파이썬',
//       riskScore: 38,
//       riskLevel: '고위험',
//       rate: 75,
//       absentCount: 3,
//       lateCount: 5,
//       viewCount: 5,
//       recommendAction: '즉시상담 필요',
//     },
//     {
//       id: 2,
//       name: '오태식(021202)',
//       lecture: '프로젝트기반 자바&파이썬',
//       riskScore: 40,
//       riskLevel: '고위험',
//       rate: 75,
//       absentCount: 2,
//       lateCount: 3,
//       viewCount: 3,
//       recommendAction: '즉시상담 필요',
//     },
//     {
//       id: 3,
//       name: '박종원(970505)',
//       lecture: 'UI/UX 디자인 반응형 웹 앱개발',
//       riskScore: 55,
//       riskLevel: '중위험',
//       rate: 75,
//       absentCount: 1,
//       lateCount: 1,
//       viewCount: 1,
//       recommendAction: '금주상담 필요',
//     },
//     {
//       id: 4,
//       name: '오태식(021202)',
//       lecture: 'UI/UX 디자인 반응형 웹 앱개발',
//       riskScore: 55,
//       riskLevel: '중위험',
//       rate: 75,
//       absentCount: 1,
//       lateCount: 1,
//       viewCount: 1,
//       recommendAction: '금주 상담 필요',
//     },
//     {
//       id: 5,
//       name: '박종원(970505)',
//       lecture: 'UI/UX 디자인 반응형 웹 앱개발',
//       riskScore: 6,
//       riskLevel: '저위험',
//       rate: 75,
//       absentCount: 1,
//       lateCount: 1,
//       viewCount: 1,
//       recommendAction: '주의요망(문자안내)',
//     },
//   ];
//   // 초기 전체조회
//   useEffect(() => {
//     setSearchCourse(''); // 전체과정 조회
//     setIsSearched(true);
//   }, []);

//   const handleSearch = () => {
//     setSearchCourse(selectedCourse); // 검색 기준 확정
//     setIsSearched(true);
//   };

//    const displayData = searchCourse === ''
//     ? dummyData
//     : dummyData.filter((item) => item.lecture === searchCourse);

//   const riskLevelColor = (score) => {
//     if (score >= 40) return 'bg-red-500 text-white';
//     else if (score >= 30) return 'bg-orange-400 text-white';
//     else return 'bg-yellow-300 text-black';
//   };

//   return (
    
//     <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
//       <Sidebar />
//       <main className="flex-1 overflow-y-auto bg-white p-6">
//         <PageMeta title="위험 수강생 관리" description="위험 수강생을 분석합니다." />
//         <Header />
//         <h1 className="text-2xl font-bold p-6">위험 수강생 관리</h1>

//         <section className="bg-white px-6">
//           {/* 검색 필터 */}
//           <div className="flex items-center gap-3 mb-6">
//             <select
//               value={selectedCourse}
//               onChange={(e) => setSelectedCourse(e.target.value)}
//               className="border px-3 py-2 rounded w-[260px] text-sm"
//             >
//               <option value="">전체 과정</option>
//               <option>프로젝트기반 자바&파이썬</option>
//               <option>UI/UX 디자인 반응형 웹 앱개발</option>
//             </select>
//             <button onClick={handleSearch} className="bg-gray-700 text-white px-4 py-2 rounded text-sm">
//               조회
//             </button>
//           </div>

//           <div className="flex justify-between items-center mb-3">
//             <div className="relative inline-block w-48">
//               <select
//                 value={isInitialSelect ? '' : itemsPerPage}
//                 onChange={(e) => {
//                   const value = Number(e.target.value);
//                   setItemsPerPage(value);
//                   setCurrentPage(1);
//                   setIsInitialSelect(false);
//                 }}
//                 className="border border-gray-400 px-1 py-0.5 rounded"
//               >
//                 <option value="" disabled hidden>보기 기준</option>
//                 <option value={5}>개씩</option>
//                 <option value={10}>10개씩</option>
//                 <option value={20}>20개씩</option>
//               </select>
//             </div>

//             <div className="flex gap-2">
//               <button className="border border-gray-300 px-4 py-1 rounded">선택 저장</button>
//               <button className="border border-gray-300 px-4 py-1 rounded">다운로드</button>
//               <button className="border border-gray-300 px-4 py-1 rounded">인쇄</button>
//             </div>
//           </div>

//           {/* 테이블 */}
//           {isSearched && displayData.length === 0 ? (
//             <div className="text-center py-20 text-gray-500">검색 결과가 없습니다.</div>
//           ) : (
//             <>
//             <table className="w-full text-sm -t border-b border-gray-300">
//               <thead className="bg-gray-100">
//                 <tr className="text-center">
//                   <th className="border-t border-b border-gray-300 px-2 py-2 w-10"><input type="checkbox" /></th>
//                   <th className="border-t border-b border-gray-300 px-2 py-2">이름</th>
//                   {searchCourse === '' && <th className="border-t border-b border-gray-300 px-2 py-2">과정명</th>}
//                   <th className="border-t border-b border-gray-300 px-2 py-2">위험도</th>
//                   <th className="border-t border-b border-gray-300 px-2 py-2">출석률</th>
//                   <th className="border-t border-b border-gray-300 px-2 py-2">결석</th>
//                   <th className="border-t border-b border-gray-300 px-2 py-2">지각</th>
//                   <th className="border-t border-b border-gray-300 px-2 py-2">조회</th>
//                   <th className="border-t border-b border-gray-300 px-2 py-2">행동 권고</th>
//                   <th className="border-t border-b border-gray-300 px-2 py-2">조치메모</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayData.map((item) => (
//                   <tr key={item.id} className="text-center">
//                     <td className="border-t border-b border-gray-300 px-2 py-2"><input type="checkbox" /></td>
//                     <td className="border-t border-b border-gray-300 px-2 py-2">{item.name}</td>
//                     {searchCourse === '' && <td className="border-t border-b border-gray-300 px-2 py-2">{item.lecture}</td>}
//                     <td className="border-t border-b border-gray-300  px-2 py-2">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${riskLevelColor(item.riskScore)}`}>
//                         {item.riskScore}점({item.riskLevel})
//                       </span>
//                     </td>
//                     <td className="border-t border-b border-gray-300 px-2 py-2">{item.rate}%</td>
//                     <td className="border-t border-b border-gray-300 px-2 py-2">{item.absentCount}</td>
//                     <td className="border-t border-b border-gray-300 px-2 py-2">{item.lateCount}</td>
//                     <td className="border-t border-b border-gray-300 px-2 py-2">{item.viewCount}</td>
//                     <td className="border-t border-b border-gray-300 px-2 py-2 text-red-600 font-semibold">{item.recommendAction}</td>
//                     <td className="border-t border-b border-gray-300 px-2 py-2">
//                       <select className="border rounded border-gray-300 px-1 py-1 text-sm w-full">
//                         <option>선택</option>
//                         <option>상담요청</option>
//                         <option>문자발송</option>
//                         <option>예외처리</option>
//                         <option>상담완료</option>
//                       </select>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <Pagination
//             currentPage={currentPage}
//             totalPages={Math.ceil(displayData.length / itemsPerPage)}
//             onPageChange={(page) => setCurrentPage(page)}
//           />
//           </>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import Header from '../../components/Header';
// import PageMeta from '../../components/PageMeta';
// import Pagination from '../../components/Pagination';
// import ExcelExportButton from '../../component/admin/ExcelExportButton';

// export default function AttendanceSetting() {
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [searchCourse, setSearchCourse] = useState('');
//   const [isSearched, setIsSearched] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const dummyData = [
//     {
//       id: 1,
//       name: '박종원(970505)',
//       lecture: '프로젝트기반 자바&파이썬',
//       riskScore: 38,
//       riskLevel: '고위험',
//       rate: 75,
//       absentCount: 3,
//       lateCount: 5,
//       viewCount: 5,
//       recommendAction: '즉시상담 필요',
//     },
//     {
//       id: 2,
//       name: '오태식(021202)',
//       lecture: '프로젝트기반 자바&파이썬',
//       riskScore: 40,
//       riskLevel: '고위험',
//       rate: 75,
//       absentCount: 2,
//       lateCount: 3,
//       viewCount: 3,
//       recommendAction: '즉시상담 필요',
//     },
//     {
//       id: 3,
//       name: '박종원(970505)',
//       lecture: 'UI/UX 디자인 반응형 웹 앱개발',
//       riskScore: 55,
//       riskLevel: '중위험',
//       rate: 75,
//       absentCount: 1,
//       lateCount: 1,
//       viewCount: 1,
//       recommendAction: '금주상담 필요',
//     },
//     {
//       id: 4,
//       name: '오태식(021202)',
//       lecture: 'UI/UX 디자인 반응형 웹 앱개발',
//       riskScore: 55,
//       riskLevel: '중위험',
//       rate: 75,
//       absentCount: 1,
//       lateCount: 1,
//       viewCount: 1,
//       recommendAction: '금주 상담 필요',
//     },
//     {
//       id: 5,
//       name: '박종원(970505)',
//       lecture: 'UI/UX 디자인 반응형 웹 앱개발',
//       riskScore: 6,
//       riskLevel: '저위험',
//       rate: 75,
//       absentCount: 1,
//       lateCount: 1,
//       viewCount: 1,
//       recommendAction: '주의요망(문자안내)',
//     },
//   ];

//   useEffect(() => {
//     setSearchCourse('');
//     setIsSearched(true);
//   }, []);

//   const handleSearch = () => {
//     setSearchCourse(selectedCourse);
//     setIsSearched(true);
//   };

//   const displayData = searchCourse === ''
//     ? dummyData
//     : dummyData.filter((item) => item.lecture === searchCourse);

//   const riskLevelColor = (score) => {
//     if (score >= 40) return 'bg-red-500 text-white';
//     else if (score >= 30) return 'bg-orange-400 text-white';
//     else return 'bg-yellow-300 text-black';
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
//       <Sidebar />
//       <main className="flex-1 overflow-y-auto bg-white p-6">
//         <PageMeta title="위험 수강생 관리" description="위험 수강생을 분석합니다." />
//         <Header />
//         <h1 className="text-2xl font-bold p-6">위험 수강생 관리</h1>

//         <section className="bg-white px-6">
//           <div className="flex items-center gap-3 mb-6">
//             <select
//               value={selectedCourse}
//               onChange={(e) => setSelectedCourse(e.target.value)}
//               className="border px-3 py-2 rounded w-[260px] text-sm"
//             >
//               <option value="">전체 과정</option>
//               <option>프로젝트기반 자바&파이썬</option>
//               <option>UI/UX 디자인 반응형 웹 앱개발</option>
//             </select>
//             <button onClick={handleSearch} className="bg-gray-700 text-white px-4 py-2 rounded text-sm">
//               조회
//             </button>
//           </div>

//           <div className="flex justify-end gap-2 mb-3 no-print">
//             <button onClick={handlePrint} className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50 text-sm">프린트</button>
//             <ExcelExportButton
//               data={displayData}
//               filename="위험수강생_리스트"
//               columns={[
//                 { key: 'name', label: '이름' },
//                 { key: 'lecture', label: '과정명' },
//                 { key: 'riskScore', label: '위험 점수' },
//                 { key: 'riskLevel', label: '위험도' },
//                 { key: 'rate', label: '출석률' },
//                 { key: 'absentCount', label: '결석' },
//                 { key: 'lateCount', label: '지각' },
//                 { key: 'viewCount', label: '조회' },
//                 { key: 'recommendAction', label: '행동 권고' },
//               ]}
//             />
//           </div>

//           <div id="print-area">
//             {isSearched && displayData.length === 0 ? (
//               <div className="text-center py-20 text-gray-500">검색 결과가 없습니다.</div>
//             ) : (
//               <>
//                 <table className="w-full text-sm border-t border-b border-gray-300">
//                   <thead className="bg-gray-100">
//                     <tr className="text-center">
//                       <th className="px-2 py-2 w-10"><input type="checkbox" /></th>
//                       <th className="px-2 py-2">이름</th>
//                       {searchCourse === '' && <th className="px-2 py-2">과정명</th>}
//                       <th className="px-2 py-2">위험도</th>
//                       <th className="px-2 py-2">출석률</th>
//                       <th className="px-2 py-2">결석</th>
//                       <th className="px-2 py-2">지각</th>
//                       <th className="px-2 py-2">조회</th>
//                       <th className="px-2 py-2">행동 권고</th>
//                       <th className="px-2 py-2">조치메모</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayData
//                       .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
//                       .map((item) => (
//                         <tr key={item.id} className="text-center">
//                           <td className="px-2 py-2"><input type="checkbox" /></td>
//                           <td className="px-2 py-2">{item.name}</td>
//                           {searchCourse === '' && <td className="px-2 py-2">{item.lecture}</td>}
//                           <td className="px-2 py-2">
//                             <span className={`px-2 py-1 rounded text-xs font-semibold ${riskLevelColor(item.riskScore)}`}>
//                               {item.riskScore}점({item.riskLevel})
//                             </span>
//                           </td>
//                           <td className="px-2 py-2">{item.rate}%</td>
//                           <td className="px-2 py-2">{item.absentCount}</td>
//                           <td className="px-2 py-2">{item.lateCount}</td>
//                           <td className="px-2 py-2">{item.viewCount}</td>
//                           <td className="px-2 py-2 text-red-600 font-semibold">{item.recommendAction}</td>
//                           <td className="px-2 py-2">
//                             <select className="border rounded border-gray-300 px-1 py-1 text-sm w-full">
//                               <option>선택</option>
//                               <option>상담요청</option>
//                               <option>문자발송</option>
//                               <option>예외처리</option>
//                               <option>상담완료</option>
//                             </select>
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </>
//             )}
//           </div>

//           <div className="mt-6 flex items-center justify-between relative">
//             <div className="text-sm">
//               <select
//                 value={itemsPerPage}
//                 onChange={(e) => {
//                   setItemsPerPage(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//                 className="border rounded px-2 py-1 border-gray-400 text-sm"
//               >
//                 <option value={10}>10개씩</option>
//                 <option value={20}>20개씩</option>
//                 <option value={30}>30개씩</option>
//               </select>
//             </div>
//             <div className="absolute left-1/2 transform -translate-x-1/2">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={Math.ceil(displayData.length / itemsPerPage)}
//                 onPageChange={(page) => setCurrentPage(page)}
//               />
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

import React, {  useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import Pagination from '../../components/Pagination';
import ExcelExportButton from '../../component/admin/ExcelExportButton';

export default function AttendanceSetting() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const dummyData = [
    {
      id: 1,
      name: '박종원(970505)',
      lecture: '프로젝트기반 자바&파이썬',
      riskScore: 38,
      riskLevel: '고위험',
      rate: 75,
      absentCount: 3,
      lateCount: 5,
      viewCount: 5,
      recommendAction: '즉시상담 필요',
    },
    {
      id: 2,
      name: '오태식(021202)',
      lecture: '프로젝트기반 자바&파이썬',
      riskScore: 40,
      riskLevel: '고위험',
      rate: 75,
      absentCount: 2,
      lateCount: 3,
      viewCount: 3,
      recommendAction: '즉시상담 필요',
    },
    {
      id: 3,
      name: '박종원(970505)',
      lecture: 'UI/UX 디자인 반응형 웹 앱개발',
      riskScore: 55,
      riskLevel: '중위험',
      rate: 75,
      absentCount: 1,
      lateCount: 1,
      viewCount: 1,
      recommendAction: '금주상담 필요',
    },
    {
      id: 4,
      name: '오태식(021202)',
      lecture: 'UI/UX 디자인 반응형 웹 앱개발',
      riskScore: 55,
      riskLevel: '중위험',
      rate: 75,
      absentCount: 1,
      lateCount: 1,
      viewCount: 1,
      recommendAction: '금주 상담 필요',
    },
    {
      id: 5,
      name: '박종원(970505)',
      lecture: 'UI/UX 디자인 반응형 웹 앱개발',
      riskScore: 6,
      riskLevel: '저위험',
      rate: 75,
      absentCount: 1,
      lateCount: 1,
      viewCount: 1,
      recommendAction: '주의요망(문자안내)',
    },
  ];

  useEffect(() => {
    setSearchCourse('');
    setIsSearched(true);
  }, []);

  const handleSearch = () => {
    setSearchCourse(selectedCourse);
    setIsSearched(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const displayData = searchCourse === ''
    ? dummyData
    : dummyData.filter((item) => item.lecture === searchCourse);

  const riskLevelColor = (score) => {
    if (score >= 40) return 'bg-red-500 text-white';
    else if (score >= 30) return 'bg-orange-400 text-white';
    else return 'bg-yellow-300 text-black';
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="위험 수강생 관리" description="위험 수강생을 분석합니다." />
        <Header />
        <h1 className="text-2xl font-bold p-6">위험 수강생 관리</h1>

        <section className="bg-white px-6">
          <div className="flex items-center gap-3 mb-6">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border px-3 py-2 rounded w-[260px] text-sm"
            >
              <option value="">전체 과정</option>
              <option>프로젝트기반 자바&파이썬</option>
              <option>UI/UX 디자인 반응형 웹 앱개발</option>
            </select>
            <button onClick={handleSearch} className="bg-gray-700 text-white px-4 py-2 rounded text-sm">
              조회
            </button>
          </div>

          <div className="flex justify-end gap-2 mb-3">
            <ExcelExportButton
              data={displayData}
              filename="위험수강생_리스트"
              columns={[
                { key: 'name', label: '이름' },
                { key: 'lecture', label: '과정명' },
                { key: 'riskScore', label: '위험점수' },
                { key: 'riskLevel', label: '위험도' },
                { key: 'rate', label: '출석률', format: (v) => `${v}%` },
                { key: 'absentCount', label: '결석' },
                { key: 'lateCount', label: '지각' },
                { key: 'viewCount', label: '조회' },
                { key: 'recommendAction', label: '행동 권고' },
              ]}
            />
            <button onClick={handlePrint} className="border border-gray-300 px-4 py-1 rounded">인쇄</button>
          </div>

          <div id="print-area">
            {isSearched && displayData.length === 0 ? (
              <div className="text-center py-20 text-gray-500">검색 결과가 없습니다.</div>
            ) : (
              <>
                <table className="w-full text-sm border-t border-b border-gray-400">
                  <thead>
                    <tr className="text-center">
                      <th className="border-t border-b border-gray-400 px-2 py-2">이름</th>
                      {searchCourse === '' && <th className="border-t border-b border-gray-400 px-2 py-2">과정명</th>}
                      <th className="border-t border-b border-gray-400 px-2 py-2">위험도</th>
                      <th className="border-t border-b border-gray-400 px-2 py-2">출석률</th>
                      <th className="border-t border-b border-gray-400 px-2 py-2">결석</th>
                      <th className="border-t border-b border-gray-400 px-2 py-2">지각</th>
                      <th className="border-t border-b border-gray-400 px-2 py-2">조회</th>
                      <th className="border-t border-b border-gray-400 px-2 py-2">행동 권고</th>
                      <th className="border-t border-b border-gray-400 px-2 py-2">조치메모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((item) => (
                        <tr key={item.id} className="text-center">
                          <td className="border-t border-b border-gray-400 px-2 py-2">{item.name}</td>
                          {searchCourse === '' && <td className="border-t border-b border-gray-400 px-2 py-2">{item.lecture}</td>}
                          <td className="border-t border-b border-gray-400  px-2 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${riskLevelColor(item.riskScore)}`}>
                              {item.riskScore}점({item.riskLevel})
                            </span>
                          </td>
                          <td className="border-t border-b border-gray-400 px-2 py-2">{item.rate}%</td>
                          <td className="border-t border-b border-gray-400 px-2 py-2">{item.absentCount}</td>
                          <td className="border-t border-b border-gray-400 px-2 py-2">{item.lateCount}</td>
                          <td className="border-t border-b border-gray-400 px-2 py-2">{item.viewCount}</td>
                          <td className="border-t border-b border-gray-400 px-2 py-2 text-red-600 font-semibold">{item.recommendAction}</td>
                          <td className="border-t border-b border-gray-400 px-2 py-2">
                            <select className="border rounded border-gray-300 px-1 py-1 text-sm w-full">
                              <option>선택</option>
                              <option>상담요청</option>
                              <option>문자발송</option>
                              <option>예외처리</option>
                              <option>상담완료</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 border-gray-400 text-sm"
              >
                <option value={10}>10개씩</option>
                <option value={20}>20개씩</option>
                <option value={30}>30개씩</option>
              </select>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(displayData.length / itemsPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}