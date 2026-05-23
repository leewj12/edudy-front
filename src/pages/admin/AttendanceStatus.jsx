import React, { useEffect ,useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import Pagination from '../../components/Pagination';
import axios from '../../api/axiosInstance';

export default function AttendanceStatus() {
  const [lectures, setLecture] = useState([]);

  useEffect(() => {
    fetchLecture();
  }, []);

  const fetchLecture = async () => {
    try {
      const res = await axios.get('/admin/attendance/sheet/all');
      console.log("불러온 데이터",res.data);
      setLecture(res.data);
      
    } catch (err) {
      console.error("강의 목록 불러오기 실패", err);
    }
  };
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [searchFromDate, setSearchFromDate] = useState(null);  // 조회 시점 날짜
  const [searchToDate, setSearchToDate] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isInitialSelect, setIsInitialSelect] = useState(true);

  const dummyData = [
  //  { id: 1,lecture:'AI 서비스 교육과정',attDate, name: '박호철(970505)', rate: 75, attStatus: '정상', attLate,attLeave,attEarlyLeave,attReasonCode: '해당없음', attReasonDetail: '' },
    { id: 2,lecture:'AI 서비스 교육과정', name: '오태식(0121202)', rate: 80, reason: '해당없음', detail: '' ,attendances: {
    '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
  }},
    { id: 3,lecture:'AI 서비스 교육과정', name: '박호철(970505)', rate: 75, reason: '해당없음', detail: '' ,attendances: {
    '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    }},
    { id: 4,lecture:'AI 서비스 교육과정', name: '오태식(0121202)', rate: 80, reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '출석',
      '2025-06-19': '결석',
      '2025-06-20': '지각',
      '2025-06-21': '외출'
    } },
    { id: 5,lecture:'개발자 과정', name: '박호철(970505)', rate: 75, reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    } },
    { id: 6,lecture:'개발자 과정', name: '오태식(0121202)', rate: 80, reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    } },
    { id: 7,lecture:'개발자 과정', name: '박호철(970505)', rate: 75, reason: '해당없음', detail: '' ,attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    }},
    { id: 8,lecture:'실무 프로젝트 과정', name: '오태식(0121202)', rate: 80, reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    } },
    { id: 9,lecture:'실무 프로젝트 과정', name: '박호철(970505)', rate: 75, reason: '해당없음', detail: '' ,attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    }},
    { id: 10,lecture:'실무 프로젝트 과정', name: '오태식(0121202)', rate: 80, reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    } },
    { id: 11,lecture:'실무 프로젝트 과정', name: '박호철(970505)', rate: 75,  reason: '해당없음', detail: '' ,attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    }},
    { id: 12,lecture:'실무 프로젝트 과정', name: '오태식(0121202)', rate: 80,  reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    } },
    { id: 13,lecture:'실무 프로젝트 과정', name: '박호철(970505)', rate: 75,  reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    } },
    { id: 14,lecture:'취업보장 과정', name: '오태식(0121202)', rate: 80, reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    } },
    { id: 15,lecture:'취업보장 과정', name: '박호철(970505)', rate: 75, reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '출석',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    } },
    { id: 16,lecture:'취업보장 과정', name: '오태식(0121202)', rate: 80, reason: '해당없음', detail: '',attendances: {
      '2025-06-18': '퇴실',
    '2025-06-19': '결석',
    '2025-06-20': '지각',
    '2025-06-21': '외출'
    } },
  ];
  

  const getDateRange = (start, end) => {
    const dates = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const paddedDateRange = () => {
    if (!searchFromDate || !searchToDate) return [];
    const MAX_DATES = 7;
    const range = getDateRange(searchFromDate, searchToDate);
    while (range.length < MAX_DATES) range.push(null);
    return range;
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };
  
  const applyFilter = () => {
    const result = dummyData.filter((item) => item.lecture === selectedCourse);
    setFilteredData(result);
  };

  const handleSearch = () => {
    setSearchFromDate(fromDate);
    setSearchToDate(toDate);
    setIsSearched(true);
    applyFilter();
    setCurrentPage(1);
  };

  const handleSearchToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSearchFromDate(today);
    setSearchToDate(today);
    setIsSearched(true);
    applyFilter();
    setCurrentPage(1);
  };

  const handleSearchAll = () => {
    setSearchFromDate(null);
    setSearchToDate(null);
    setIsSearched(true);
    applyFilter();
    setCurrentPage(1);
  };
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const dateHeaders = paddedDateRange();

  const isSingleDay = searchFromDate && searchToDate &&
    searchFromDate.toDateString() === searchToDate.toDateString();

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="출결 현황" description="수강생 출석 현황을 확인합니다." />
        <Header />
        <h1 className="text-2xl font-bold p-6">출결 현황</h1>

        {/* 필터 영역 */}
        <section className="bg-white p-6">
          <div className="flex items-center gap-7 mb-12">

            <select value={selectedCourse} onChange={handleCourseChange} className="border rounded w-[280px] h-[38px] text-sm">
              <option value="">과정명 선택</option>
              <option>AI 서비스 교육과정</option>
              <option>개발자 과정</option>
              <option>실무 프로젝트 과정</option>
              <option>취업보장 과정</option>
            </select>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-start">
                <input
                  type="date"
                  value={fromDate.toISOString().split('T')[0]}
                  onChange={(e) => setFromDate(new Date(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 w-[140px] h-[38px] text-sm"
                />
              </div>

              <span className="text-gray-500 w-[10px] text-center">~</span>

              <div className="flex flex-col items-start">
                <input
                  type="date"
                  value={toDate.toISOString().split('T')[0]}
                  onChange={(e) => setToDate(new Date(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 w-[140px] h-[38px] text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleSearch} className="bg-gray-700 text-white px-4 py-2 rounded text-sm cursor-pointer">조회</button>
              <button onClick={handleSearchToday} className="border px-4 py-2 rounded text-sm cursor-pointer">오늘</button>
              <button onClick={handleSearchAll} className="border px-4 py-2 rounded text-sm cursor-pointer">전체기간 조회</button>
            </div>
          </div>

          {/* 보기 기준 + 기능 버튼 */}
          <div className="flex justify-between items-center mb-3">
            <div className="relative inline-block w-48">
              <select
                value={isInitialSelect ? '' : itemsPerPage}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setItemsPerPage(value);
                  setCurrentPage(1);
                  setIsInitialSelect(false);
                }}
                className="border border-gray-400 px-1 py-0.5 rounded"
              >
                <option value="" disabled hidden>보기 기준</option>
                <option value={5}>5개씩</option>
                <option value={10}>10개씩</option>
                <option value={20}>20개씩</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button className="border border-gray-300 px-4 py-1 rounded">선택 저장</button>
              <button className="border border-gray-300 px-4 py-1 rounded">다운로드</button>
              <button className="border border-gray-300 px-4 py-1 rounded">인쇄</button>
            </div>
          </div>

          {/* 처음화면 : 검색조건이 없을때 화면 : 하루단위 화면 : 기간단위 화면 */}
          {!isSearched ? (
            <div className="text-center py-20 text-gray-500">검색 결과가 없습니다.</div>
          ) : 
          filteredData.length === 0 ? (
            <div className="text-center py-20 text-gray-500">해당 조건에 맞는 데이터가 없습니다.</div>
          ) : isSingleDay ? (
            <table className="w-full text-sm border-t mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2 w-[40px]">
                    <input type="checkbox" />
                  </th>
                  <th className="border px-2 py-2">이름</th>
                  <th className="border px-2 py-2">출석률</th>
                  <th className="border px-2 py-2">출석상태</th>
                  <th className="border px-2 py-2">사유</th>
                  <th className="border px-2 py-2">상세 사유</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => {
                  const dateKey = searchFromDate?.toISOString().split('T')[0]; // 단일 날짜 키
                  const status = item.attendances?.[dateKey]; // 출석 정보 찾기

                  // 스타일 지정
                  let statusStyle = "text-gray-700";
                  if (status === "지각") statusStyle = "text-orange-500 font-semibold";
                  else if (status === "결석") statusStyle = "text-red-500 font-semibold";
                  else if (status === "출석") statusStyle = "text-green-600 font-semibold";
                  else if (status) statusStyle = "text-blue-500 font-semibold";

                  return (
                    <tr key={item.id} className="text-center">
                      <td className="border px-2 py-2">
                        <input type="checkbox" />
                      </td>
                      <td className="border px-2 py-2 text-center">{item.name}</td>
                      <td className="border px-2 py-2 text-center">{item.rate}%</td>
                      <td className="border px-2 py-2 text-center">{status}</td>
                      <td className="border px-2 py-2">
                        <select defaultValue={item.reason} className="border rounded px-1 py-1 text-sm w-full">
                          <option>해당없음</option>
                          <option>지각 사유</option>
                          <option>외출 사유</option>
                          <option>기타</option>
                        </select>
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          type="text"
                          defaultValue={item.detail}
                          placeholder=""
                          className="border rounded px-1 py-1 text-sm w-full"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm border-t mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2">이름</th>
                  <th className="border px-2 py-2">출석률</th>
                  {dateHeaders.map((d, i) => (
                    <th key={i} className="border px-2 py-2 text-center">
                      {d ? `${d.getMonth() + 1}/${d.getDate()}` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-2 py-2 text-center">{item.name}</td>
                    <td className="border px-2 py-2 text-center">{item.rate}%</td>
                    {dateHeaders.map((d, i) => {
                      const dateKey = d ? d.toISOString().split('T')[0] : '';
                      const status = item.attendances?.[dateKey];
                      let display = '';
                      if (status === '퇴실') {
                        display = '○';
                      } else if (status === '결석') {
                        display = 'X';
                      } else if (status) {
                        display = status; // 입실, 퇴실, 지각 등 그대로 표시
                      }
                
                      return (
                        <td key={i} className="border px-2 py-2 text-center">
                          {d ? display : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}


          {/* 페이지네이션 */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pagesPerGroup={5}
          />
        </section>
      </main>
    </div>
  );
}
