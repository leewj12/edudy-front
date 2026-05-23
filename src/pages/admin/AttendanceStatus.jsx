// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import Header from '../../components/Header';
// import PageMeta from '../../components/PageMeta';
// import Pagination from '../../components/Pagination';
// import axios from '../../api/axiosInstance';

// export default function AttendanceStatus() {
//   const [lectures, setLecture] = useState([]);
//   const [courseList, setCourseList] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState('');

//   const [searchFromDate, setSearchFromDate] = useState(null);
//   const [searchToDate, setSearchToDate] = useState(null);
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());

//   const [filteredData, setFilteredData] = useState([]);
//   const [isSearched, setIsSearched] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [isInitialSelect, setIsInitialSelect] = useState(true);

//   useEffect(() => {
//     fetchLecture();
//     fetchCourses();
//   }, []);

//   const fetchLecture = async () => {
//     try {
//       const res = await axios.get('/admin/attendance/sheet/all');
//       setLecture(res.data);
//     } catch (err) {
//       console.error("출결 목록 불러오기 실패", err);
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const res = await axios.get('/admin/lecture/list');
//       setCourseList(res.data);
//     } catch (err) {
//       console.error("과정 목록 불러오기 실패", err);
//     }
//   };

//   const getDateRange = (start, end) => {
//     const dates = [];
//     const cur = new Date(start);
//     while (cur <= end) {
//       dates.push(new Date(cur));
//       cur.setDate(cur.getDate() + 1);
//     }
//     return dates;
//   };

//   const paddedDateRange = () => {
//     if (!searchFromDate || !searchToDate) return [];
//     const MAX_DATES = 7;
//     const range = getDateRange(searchFromDate, searchToDate);
//     while (range.length < MAX_DATES) range.push(null);
//     return range;
//   };

//   const applyFilter = async () => {
//     try {
//       const res = await axios.get(`/admin/lecture/part/list/${selectedCourseId}`);
//       const participantList = res.data;

//       const dateKeys = searchFromDate && searchToDate
//         ? getDateRange(searchFromDate, searchToDate).map((d) => d.toISOString().split('T')[0])
//         : [];

//       const isSingleDay = searchFromDate && searchToDate &&
//         searchFromDate.toDateString() === searchToDate.toDateString();
        
//         const statusMap = {
//           ENTRY: () =>  '입실' ,
//           ABSENT: () => '결석',
//           OUTING: () => '외출',
//           EXIT: (r) => (r.attLate || r.attLeave || r.attEarlyLeave ? '퇴실' : '출석'),
//           RECOGNIZED: () => '인정',
//         };
  
//         const merged = participantList.map((student, index) => {
//           const matched = lectures.find(
//             (a) => a.lecturePartId === student.lecturePartId
//           );
          
//           if (!matched) {
//             console.warn(`❌ 출결 데이터 없음: ${student.userName}, partId=${student.lecturePartId}`);
//           } else {
//             console.log(`✅ 병합 성공: ${student.userName}`, matched);
//           }
        
//           const attendanceMap = {};
//           dateKeys.forEach(date => {
//             const record = matched?.attendanceRecords?.find(r => r.date === date);
//             let statusText = '미입실';
//             if (record) {
//               const mapper = statusMap[record.attStatus];
//               statusText = mapper ? mapper(record) : '미입실';
//             }
//             attendanceMap[date] = statusText;
//           });
        
//           const status = isSingleDay ? attendanceMap[dateKeys[0]] ?? '미입실' : undefined;

        
//           return {
//             id: index + 1,
//             name: student.userName,
//             lecturePartId: student.lecturePartId,
//             rate: matched?.currentAttendanceRate || 0,
//             attendances: attendanceMap,
//             status,
//             reason: '해당없음',
//             detail: '',
//           };
//         });

//       setFilteredData(merged);
//     } catch (err) {
//       console.error("참가자 + 출결 병합 실패", err);
//     }
//   };

//   useEffect(() => {
//     if (isSearched && searchFromDate && searchToDate) {
//       applyFilter();
//     }
//   }, [searchFromDate, searchToDate]);

//   const handleSearch = () => {
//     setSearchFromDate(fromDate);
//     setSearchToDate(toDate);
//     setIsSearched(true);
//     applyFilter();
//     setCurrentPage(1);
//   };

//   const handleSearchToday = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     setSearchFromDate(today);
//     setSearchToDate(today);
//     setIsSearched(true);
//     applyFilter();
//     setCurrentPage(1);
//   };

//   const handleSearchAll = () => {
//     setSearchFromDate(null);
//     setSearchToDate(null);
//     setIsSearched(true);
//     applyFilter();
//     setCurrentPage(1);
//   };

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
//   const dateHeaders = paddedDateRange();
//   const isSingleDay = searchFromDate && searchToDate &&
//     searchFromDate.toDateString() === searchToDate.toDateString();

//   return (
//     <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
//       <Sidebar />
//       <main className="flex-1 overflow-y-auto bg-white p-6">
//         <PageMeta title="출결 현황" description="수강생 출석 현황을 확인합니다." />
//         <Header />
//         <h1 className="text-2xl font-bold p-6">출결 현황</h1>

//         <section className="bg-white p-6">
//           <div className="flex items-center gap-7 mb-12">
//             <select
//               value={selectedCourseId}
//               onChange={(e) => setSelectedCourseId(Number(e.target.value))}
//               className="border rounded w-[280px] h-[38px] text-sm"
//             >
//               <option value="">과정명 선택</option>
//               {courseList.map(course => (
//                 <option key={course.lectureId} value={course.lectureId}>
//                   {course.lectureTitle}
//                 </option>
//               ))}
//             </select>

//             <div className="flex items-center gap-2">
//               <input
//                 type="date"
//                 value={fromDate.toISOString().split('T')[0]}
//                 onChange={(e) => setFromDate(new Date(e.target.value))}
//                 className="border border-gray-300 rounded px-3 py-1 w-[140px] h-[38px] text-sm"
//               />
//               <span className="text-gray-500 w-[10px] text-center">~</span>
//               <input
//                 type="date"
//                 value={toDate.toISOString().split('T')[0]}
//                 onChange={(e) => setToDate(new Date(e.target.value))}
//                 className="border border-gray-300 rounded px-3 py-1 w-[140px] h-[38px] text-sm"
//               />
//             </div>

//             <div className="flex items-center gap-3">
//               <button onClick={handleSearch} className="bg-gray-700 text-white px-4 py-2 rounded text-sm cursor-pointer">조회</button>
//               <button onClick={handleSearchToday} className="border px-4 py-2 rounded text-sm cursor-pointer">오늘</button>
//               <button onClick={handleSearchAll} className="border px-4 py-2 rounded text-sm cursor-pointer">전체기간 조회</button>
//             </div>
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
//                 <option value={5}>5개씩</option>
//                 <option value={10}>10개씩</option>
//                 <option value={20}>20개씩</option>
//               </select>
//             </div>
//           </div>

//           {!isSearched ? (
//             <div className="text-center py-20 text-gray-500">검색 결과가 없습니다.</div>
//           ) : filteredData.length === 0 ? (
//             <div className="text-center py-20 text-gray-500">해당 조건에 맞는 데이터가 없습니다.</div>
//           ) : isSingleDay ? (
//             <table className="w-full text-sm border-t mt-4">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-2 py-2 w-[40px]"><input type="checkbox" /></th>
//                   <th className="border px-2 py-2">이름</th>
//                   <th className="border px-2 py-2">출석률</th>
//                   <th className="border px-2 py-2">출석상태</th>
//                   <th className="border px-2 py-2">사유</th>
//                   <th className="border px-2 py-2">상세 사유</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((item) => {
//                   const status = item.status || '미입실';
//                   let statusStyle = "text-gray-700";
//                   if (status === "지각") statusStyle = "text-orange-500 font-semibold";
//                   else if (status === "결석") statusStyle = "text-red-500 font-semibold";
//                   else if (status === "출석") statusStyle = "text-green-600 font-semibold";
//                   else if (status === "미입실") statusStyle = "text-gray-400 font-semibold";

//                   return (
//                     <tr key={item.id} className="text-center">
//                       <td className="border px-2 py-2"><input type="checkbox" /></td>
//                       <td className="border px-2 py-2">{item.name}</td>
//                       <td className="border px-2 py-2">{item.rate}%</td>
//                       <td className="border px-2 py-2"><span className={statusStyle}>{status}</span></td>
//                       <td className="border px-2 py-2">
//                         <select defaultValue={item.reason} className="border rounded px-1 py-1 text-sm w-full">
//                           <option>해당없음</option>
//                           <option>지각 사유</option>
//                           <option>외출 사유</option>
//                           <option>기타</option>
//                         </select>
//                       </td>
//                       <td className="border px-2 py-2">
//                         <input type="text" defaultValue={item.detail} className="border rounded px-1 py-1 text-sm w-full" />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           ) : (
//             <table className="w-full text-sm border-t mt-4">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-2 py-2">이름</th>
//                   <th className="border px-2 py-2">출석률</th>
//                   {dateHeaders.map((d, i) => (
//                     <th key={i} className="border px-2 py-2 text-center">
//                       {d ? `${d.getMonth() + 1}/${d.getDate()}` : ''}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((item) => (
//                   <tr key={item.id}>
//                     <td className="border px-2 py-2 text-center">{item.name}</td>
//                     <td className="border px-2 py-2 text-center">{item.rate}%</td>
//                     {dateHeaders.map((d, i) => {
//                       const dateKey = d ? d.toISOString().split('T')[0] : '';
//                       const status = item.attendances?.[dateKey];
//                       let display = '';
//                       if (status === '퇴실') display = '○';
//                       else if (status === '결석') display = 'X';
//                       else if (status) display = status;
//                       return (
//                         <td key={i} className="border px-2 py-2 text-center">
//                           {d ? display : ''}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           <Pagination
//             totalPages={totalPages}
//             currentPage={currentPage}
//             onPageChange={setCurrentPage}
//             pagesPerGroup={5}
//           />
//         </section>
//       </main>
//     </div>
//   );
// }



// AttendanceStatus.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import Pagination from '../../components/Pagination';
import axios from '../../api/axiosInstance';

export default function AttendanceStatus() {
  const [lectures, setLecture] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [searchFromDate, setSearchFromDate] = useState(null);
  const [searchToDate, setSearchToDate] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const [filteredData, setFilteredData] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const MAX_COLS = 12; // 이름, 출석률 포함 고정 열 수

  useEffect(() => {
    fetchLecture();
    fetchCourses();
  }, []);

  const fetchLecture = async () => {
    try {
      const res = await axios.get('/admin/attendance/sheet/all');
      setLecture(res.data);
    } catch (err) {
      console.error("출결 목록 불러오기 실패", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/admin/lecture/list');
      setCourseList(res.data);
    } catch (err) {
      console.error("과정 목록 불러오기 실패", err);
    }
  };

  const getDateRange = (start, end) => {
    const dates = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const paginatedDateRange = () => {
    if (!searchFromDate || !searchToDate) return [];
    const allDates = getDateRange(searchFromDate, searchToDate);
    const dateOnly = allDates.map(d => new Date(d));
    return dateOnly.slice((currentPage - 1) * (MAX_COLS - 2), currentPage * (MAX_COLS - 2));
  };

  const applyFilter = async () => {
    try {
      const res = await axios.get(`/admin/lecture/part/list/${selectedCourseId}`);
      const participantList = res.data;

      const dateKeys = searchFromDate && searchToDate
        ? getDateRange(searchFromDate, searchToDate).map((d) => d.toISOString().split('T')[0])
        : [];

      const isSingleDay = searchFromDate && searchToDate &&
        searchFromDate.toDateString() === searchToDate.toDateString();

      const statusMap = {
        ENTRY: () => '○',
        ABSENT: () => '지각',
        OUTING: () => '외출',
        EXIT: (r) => (r.attLate || r.attLeave || r.attEarlyLeave ? '퇴실' : 'O'),
        RECOGNIZED: () => '인정',
      };

      const merged = participantList.map((student, index) => {
        const matched = lectures.find(
          (a) => a.lecturePartId === student.lecturePartId
        );

        const attendanceMap = {};
        dateKeys.forEach(date => {
          const record = matched?.attendanceRecords?.find(r => r.date === date);
          let statusText = '';
          if (record) {
            const mapper = statusMap[record.attStatus];
            statusText = mapper ? mapper(record) : '미입실';
          }
          attendanceMap[date] = statusText;
        });

        const status = isSingleDay ? attendanceMap[dateKeys[0]] ?? '미입실' : undefined;

        return {
          id: index + 1,
          name: student.userName,
          lecturePartId: student.lecturePartId,
          rate: matched?.currentAttendanceRate || 0,
          attendances: attendanceMap,
          status,
          reason: '해당없음',
          detail: '',
        };
      });

      setFilteredData(merged);
      setCurrentPage(1);
    } catch (err) {
      console.error("참가자 + 출결 병합 실패", err);
    }
  };

  useEffect(() => {
    if (isSearched && searchFromDate && searchToDate) {
      applyFilter();
    }
  }, [searchFromDate, searchToDate]);

  const handleSearch = () => {
    setSearchFromDate(fromDate);
    setSearchToDate(toDate);
    setIsSearched(true);
    applyFilter();
  };

  const handleSearchToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSearchFromDate(today);
    setSearchToDate(today);
    setFromDate(today);
    setToDate(today);
    setIsSearched(true);
    applyFilter();
  };

  const handleSearchAll = () => {
    const course = courseList.find(c => c.lectureId === selectedCourseId);
    if (!course) return;

    const start = new Date(course.lectureStart);
    const end = new Date(course.lectureEnd);

    setSearchFromDate(start);
    setSearchToDate(end);
    setFromDate(start);
    setToDate(end);
    setIsSearched(true);
    applyFilter();
  };

  const isSingleDay = searchFromDate && searchToDate &&
    searchFromDate.toDateString() === searchToDate.toDateString();

  const dateRange = getDateRange(searchFromDate, searchToDate);
  const totalPages = Math.ceil(dateRange.length / (MAX_COLS - 2));
  const dateHeaders = paginatedDateRange();

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="출결 현황" description="수강생 출석 현황을 확인합니다." />
        <Header />
        <h1 className="text-2xl font-bold p-6">출결 현황</h1>

        <section className="bg-white p-6">
          {/* 검색 필터 */}
          <div className="flex items-center gap-7 mb-12">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              className="border rounded w-[280px] h-[38px] text-sm"
            >
              <option value="">과정명 선택</option>
              {courseList.map(course => (
                <option key={course.lectureId} value={course.lectureId}>
                  {course.lectureTitle}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate.toISOString().split('T')[0]}
                onChange={(e) => setFromDate(new Date(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 w-[140px] h-[38px] text-sm"
              />
              <span className="text-gray-500 w-[10px] text-center">~</span>
              <input
                type="date"
                value={toDate.toISOString().split('T')[0]}
                onChange={(e) => setToDate(new Date(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 w-[140px] h-[38px] text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleSearch} className="bg-gray-700 text-white px-4 py-2 rounded text-sm">조회</button>
              <button onClick={handleSearchToday} className="border px-4 py-2 rounded text-sm">오늘</button>
              <button onClick={handleSearchAll} className="border px-4 py-2 rounded text-sm">전체기간 조회</button>
            </div>
          </div>

          {/* 테이블 렌더링 */}
          {!isSearched ? (
            <div className="text-center py-20 text-gray-500">검색 결과가 없습니다.</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-20 text-gray-500">해당 조건에 맞는 데이터가 없습니다.</div>
          ) : isSingleDay ? (
            <table className="w-full text-sm border-t border-b border-gray-400 mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2">이름</th>
                  <th className="px-2 py-2">출석률</th>
                  <th className="px-2 py-2">출석상태</th>
                  <th className="px-2 py-2">사유</th>
                  <th className="px-2 py-2">상세 사유</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id} className="text-center">
                    <td className="px-2 py-2">{item.name}</td>
                    <td className="px-2 py-2">{item.rate}%</td>
                    <td className="px-2 py-2">{item.status}</td>
                    <td className="px-2 py-2">{item.reason}</td>
                    <td className="px-2 py-2">{item.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm border-t border-b border-gray-400 mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2">이름</th>
                  <th className="px-2 py-2">출석률</th>
                  {dateHeaders.map((d, i) => (
                    <th key={i} className="px-2 py-2 text-center">
                      {d ? `${d.getMonth() + 1}/${d.getDate()}` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id} className="text-center">
                    <td className="px-2 py-2">{item.name}</td>
                    <td className="px-2 py-2">{item.rate}%</td>
                    {dateHeaders.map((d, i) => {
                      const dateKey = d ? d.toISOString().split('T')[0] : '';
                      const status = item.attendances?.[dateKey];
                      let display = '';
                      if (status === '퇴실') display = '○';
                      else if (status === '결석') display = 'X';
                      else display = status || '';
                      return <td key={i} className="px-2 py-2">{display}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-6">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              pagesPerGroup={5}
            />
          </div>
        </section>
      </main>
    </div>
  );
}