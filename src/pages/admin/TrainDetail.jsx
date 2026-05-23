import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import TrainModal from '../../components/admintrain/TrainModal';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext'; 


export default function TrainDetail() {
  const { lectureId } = useParams();
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create'); // ← 모드 상태 추가
  const [subjectList, setSubjectList] = useState([]);
  const [instructorList, setInstructorList] = useState([]);
  const { userInfo } = useAuth(); 

  const [fromDate, setFromDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [filteredTrains, setFilteredTrains] = useState([]);

  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureStart, setLectureStart] = useState('');
  const [lectureEnd, setLectureEnd] = useState('');


  // 권한 확인
  const isAdmin = userInfo?.role === 'ROLE_ADMIN';
  const isInstructor = userInfo?.role === 'ROLE_INSTR';

  const handleSearch = () => {
    const from = dayjs(fromDate);
    const to = dayjs(toDate);
    const result = trains.filter(t => {
      const date = dayjs(t.trainDate);
      return date.isAfter(from.subtract(1, 'day')) && date.isBefore(to.add(1, 'day'));
    });
    setFilteredTrains(result);
  };
  
  const handleSearchToday = () => {
    const today = dayjs().format('YYYY-MM-DD');
    setFromDate(today);
    setToDate(today);
    setFilteredTrains(trains.filter(t => t.trainDate === today));
  };
  
  const handleSearchAll = () => {
    setFilteredTrains(trains);
  };
  

  const fetchTrainingList = async () => {
    try {
      const res = await axios.get(`/admin/train/lecture/${lectureId}`);
      setTrains(res.data);

      if (res.data.length > 0) {
        const firstItem = res.data[0];
        setLectureTitle(firstItem.lectureTitle || '');
        setLectureStart(firstItem.lectureStart || '');
        setLectureEnd(firstItem.lectureEnd || '');
      }
    } catch (err) {
      console.error("훈련일지 목록 불러오기 실패", err);
    }
  };
  const fetchLectureMeta = async () => {
    try {
      const subjectRes = await axios.get(`/admin/subject/list/${lectureId}`);
      const staffRes = await axios.get(`/admin/staff/lecture/${lectureId}`);
      setSubjectList(subjectRes.data.map(s => s.subjectTitle));
      setInstructorList(staffRes.data.map(s => ({ userId: s.userId, userName: s.userName })));
    } catch (err) {
      console.error("과목/강사 불러오기 실패", err);
    }
  };

  const handleDeleteTrain = async (trainId) => {
    const confirm = window.confirm("정말 이 훈련일지를 삭제하시겠습니까?");
    if (!confirm) return;
  
    try {
      await axios.delete(`/admin/train/${trainId}`);
      alert("삭제되었습니다.");
      await fetchTrainingList(); // 목록 다시 불러오기
    } catch (err) {
      console.error("훈련일지 삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleOpenModal = async (train = null, openMode = 'create') => {
    if (openMode === 'view' || openMode === 'edit') {
      try {
        const res = await axios.get(`/admin/train/${train.trainId}`); // 상세 조회 API
        setSelectedTrain(res.data); // ← 여기엔 {date, lessons, notes, etc} 구조가 들어가야 함
      } catch (err) {
        console.error("훈련일지 상세 조회 실패", err);
        return; 
      }
    } else {
      setSelectedTrain(null);
    }
  
    setMode(openMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTrain(null);
    setIsModalOpen(false);
  };

  const handleSaveTrain = async (payload) => {
    try {
      if (mode === 'edit' && payload.trainId) {
        // 수정 요청
        await axios.put(`/admin/train/${payload.trainId}`, payload);
      } else {
        // 등록 요청
        await axios.post(`/admin/train`, payload);
      }
      await fetchTrainingList(); // 목록 새로고침
      handleCloseModal();        // 모달 닫기
    } catch (err) {
      console.error("훈련일지 저장 실패", err);
    }
  };

  useEffect(() => {
    fetchTrainingList();
    fetchLectureMeta();
  }, [lectureId]);

  return (
    <div className="flex w-screen min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 bg-white p-6">
        <PageMeta title="훈련일지 목록" description="선택한 과정의 훈련일지를 관리합니다." />
        <Header />
        <h1 className="text-2xl font-bold mb-2">훈련일지 목록</h1>
        <p className="text-gray-600 ml-1 mb-4">
          {lectureTitle} ({lectureStart} ~ {lectureEnd})
        </p>

        <div className="flex items-center gap-4 mb-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-400 rounded px-3 py-1 w-[200px] h-[38px] text-sm"
        />
        <span>~</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-400 rounded px-3 py-1 w-[200px] h-[38px] text-sm"
        />
        <button onClick={handleSearch} className="bg-gray-700 text-white px-4 py-2 rounded text-sm cursor-pointer">조회</button>
        <button onClick={handleSearchToday} className="border px-4 py-2 rounded text-sm cursor-pointer">오늘</button>
        <button onClick={handleSearchAll} className="border px-4 py-2 rounded text-sm cursor-pointer">전체기간 조회</button>
      </div>

        <div className="flex justify-end gap-2 mb-6">
          <button onClick={() => handleOpenModal(null, 'create')} className="border border-gray-400 px-4 py-1 rounded cursor-pointer">추가</button>
          <button className="border border-gray-400 px-4 py-1 rounded cursor-pointer">선택 삭제</button>
          <button className="border border-gray-400 px-4 py-1 rounded cursor-pointer">다운로드</button>
          <button className="border border-gray-400 px-4 py-1 rounded cursor-pointer">인쇄</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-y border-gray-300 text-center">
            <thead className="bg-[#FAFAFA] h-10">
              <tr>
                <td className="border-y border-gray-300 px-2 py-1 ">
                  <input type="checkbox" />
                </td>
                <td className="border-y border-gray-300 px-2 py-1 ">일자</td>
                <td className="border-y border-gray-300 px-2 py-1">상태</td>
                <td className="border-y border-gray-300 px-2 py-1"></td>
                <td className="border-y border-gray-300 px-2 py-1"></td>
              </tr>
            </thead>
            <tbody className="h-10">
            {(filteredTrains.length > 0 ? filteredTrains : trains).map((item) => (
                <tr key={item.trainId} className="text-center">
                  <td className="border-y border-gray-300 px-2 py-1">
                    <input type="checkbox" value={item.trainId} />
                  </td>
                  <td
                    className="border-y border-gray-300 px-2 py-1 cursor-pointer text-blue-700 underline"
                    onClick={() => handleOpenModal(item, 'view')}
                  >
                    {item.trainDate}
                  </td>
                  <td className="border-y border-gray-300 px-2 py-1">
                    {item.trainInstrSign && item.trainAdminSign
                      ? '양쪽 서명 완료'
                      : item.trainInstrSign
                      ? '담당자 서명 완료'
                      : item.trainAdminSign
                      ? '책임자 서명 완료'
                      : '미작성'}
                  </td>
                  <td className='border-y border-gray-300 px-2 py-1'>
                    <button onClick={() => handleOpenModal(item, 'edit')} className="border border-gray-400 px-4 py-1 rounded">
                     수정
                    </button>
                  </td>
                  <td className='border-y border-gray-300 px-2 py-1'>
                    <button onClick={() => handleDeleteTrain(item.trainId)} className="border border-gray-400 px-4 py-1 rounded">
                    삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <TrainModal
            data={selectedTrain}
            mode={mode}
            key={`${mode}-${selectedTrain?.id || 'new'}`}
            onClose={handleCloseModal}
            onSave={handleSaveTrain}
            subjects={subjectList}
            instructors={instructorList}
            instructorSignUrl={isInstructor ? userInfo?.sign : ''}
            managerSignUrl={isAdmin ? userInfo?.sign : ''}
            lectureId={lectureId}
          />
        )}
      </main>
    </div>
  );
}
