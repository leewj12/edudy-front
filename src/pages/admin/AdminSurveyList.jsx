import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import ExcelExportButton from '../../component/admin/ExcelExportButton';
import dayjs from 'dayjs';

export default function AdminSurveyList() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [titleFilter, setTitleFilter] = useState('전체');
  const [filteredList, setFilteredList] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructorMap, setInstructorMap] = useState({});

  const [modalItem, setModalItem] = useState(null);
  const [modalDetail, setModalDetail] = useState(null);

  const printRef = useRef();

  useEffect(() => {
    axios.get('/admin/lecture/list').then(res => {
      const today = dayjs();
      const filtered = res.data.filter(c =>
        dayjs(c.lectureStart).isBefore(today.add(1, 'day')) &&
        dayjs(c.lectureEnd).isAfter(today.subtract(1, 'day'))
      );
      setCourses(filtered);
    });
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchData = async () => {
      try {
        const [surveyRes, studentRes] = await Promise.all([
          axios.get(`/admin/survey/lecture/${selectedCourseId}`),
          axios.get(`/admin/lecture/part/list/${selectedCourseId}`),
        ]);

        console.log('📦 설문 목록:', surveyRes.data);
        console.log('📦 수강생 목록:', studentRes.data);

        const studentMap = {};
        studentRes.data.forEach(part => {
          studentMap[part.lecturePartId] = part.userName;
        });

        const merged = surveyRes.data.map(s => ({
          ...s,
          userName: studentMap[s.lecturePartId] || '이름 없음'
        }));

        setSurveys(merged);
        setFilteredList(merged);
        setStudents(studentRes.data);
      } catch (err) {
        console.error('설문 또는 수강생 조회 실패', err);
      }
    };

    fetchData();
  }, [selectedCourseId]);

  useEffect(() => {
    if (titleFilter === '전체') {
      setFilteredList(surveys);
    } else {
      setFilteredList(surveys.filter(s => s.lectureSurveyTitle === titleFilter));
    }
  }, [titleFilter, surveys]);

  useEffect(() => {
    if (modalItem) {
      axios.get(`/user/survey/${modalItem.lectureSurveyId}`).then(res => {
        console.log('📦 설문 상세 응답:', res.data);
        setModalDetail(res.data);
      });
    }
  }, [modalItem]);

  useEffect(() => {
    if (!modalItem || !selectedCourseId) return;
  
    axios.get(`/admin/staff/lecture/${selectedCourseId}`).then(res => {
      const map = {};
      res.data.forEach(i => {
        map[i.lectureStaffId] = i.userName;
      });
      setInstructorMap(map);
    });
  
    axios.get(`/user/survey/${modalItem.lectureSurveyId}`).then(res => {
      console.log('📦 설문 상세 응답:', res.data);
      setModalDetail(res.data);
    });
  }, [modalItem]);

  const uniqueTitles = ['전체', ...new Set(surveys.map(s => s.lectureSurveyTitle))];

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const calcAvg = (s) => {
    const sum = [s.lectureAnswer1, s.lectureAnswer2, s.lectureAnswer3].reduce((a, b) => a + b, 0);
    return (sum / 3).toFixed(1);
  };

  const excelData = filteredList.map(s => ({
    설문제목: s.lectureSurveyTitle,
    수강생이름: s.userName,
    평균점수: calcAvg(s),
    설문일자: dayjs(s.lectureSurveyCreatedAt).format('YYYY-MM-DD'),
  }));

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        <PageMeta title="만족도 조사 목록" description="등록된 설문 목록을 확인합니다." />
        <Header />

        <h1 className="text-2xl font-bold mb-6">만족도 조사 목록</h1>

        {/* 필터 */}
        <div className="flex gap-4 mb-6">
          <select
            className="border border-gray-400 px-4 py-2 rounded"
            value={selectedCourseId}
            onChange={(e) => {
              const selected = courses.find(c => c.lectureId === Number(e.target.value));
              setSelectedCourseId(e.target.value);
              setSelectedCourseTitle(selected?.lectureTitle || '');
            }}
          >
            <option value="">-- 과정을 선택하세요 --</option>
            {courses.map(c => (
              <option key={c.lectureId} value={c.lectureId}>{c.lectureTitle}</option>
            ))}
          </select>

          <select
            className="border border-gray-400 px-4 py-2 rounded"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          >
            {uniqueTitles.map(title => (
              <option key={title}>{title}</option>
            ))}
          </select>

          <div className="ml-auto flex gap-2">
            <button onClick={handlePrint} className="border border-gray-400 px-4 py-2 rounded">프린트</button>
            <ExcelExportButton
              data={excelData}
              filename={`${selectedCourseTitle}_만족도`}
            />
          </div>
        </div>

        {/* 테이블 */}
        <div ref={printRef} id="print-area">
          {filteredList.length === 0 ? (
            <p className="text-center text-gray-500 py-10">등록된 설문이 없습니다.</p>
          ) : (
            <table className="w-full border-t border-b border-gray-300 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2">설문 제목</th>
                  <th className="py-2">수강생 이름</th>
                  <th className="py-2">평균 점수</th>
                  <th className="py-2">설문일자</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((s, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setModalItem(s)}
                  >
                    <td className="py-2 border-t border-b border-gray-300">{s.lectureSurveyTitle}</td>
                    <td className="py-2 border-t border-b border-gray-300">{s.userName}</td>
                    <td className="py-2 border-t border-b border-gray-300">{calcAvg(s)}</td>
                    <td className="py-2 border-t border-b border-gray-300">{dayjs(s.lectureSurveyCreatedAt).format('YYYY-MM-DD')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {modalDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-center mb-6 border-b pb-3">{modalDetail.lectureSurveyTitle}</h2>

              <div className="space-y-6">
                {[modalDetail.lectureQuestion1, modalDetail.lectureQuestion2, modalDetail.lectureQuestion3].map((q, idx) => (
                  <div key={idx} className="">
                    <p className="font-semibold mb-3 text-gray-800">Q{idx + 1}. {q}</p>
                    <div className="flex justify-between px-4">
                      {[1, 2, 3, 4, 5].map(score => (
                        <label key={score} className="flex flex-col items-center text-sm text-gray-600 px-5">
                          <input
                            type="radio"
                            name={`lecture-${idx}`}
                            value={score}
                            checked={modalDetail[`lectureAnswer${idx + 1}`] === score}
                            readOnly
                            className="mb-1 accent-gray-600"
                          />
                          {['매우 불만족', '불만족', '보통', '만족', '매우 만족'][score - 1]}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {modalDetail.instrSurveys?.map((s, idx) => (
                  <div key={idx} className="">
                    <p className="font-semibold mb-3 text-gray-800">
                      {instructorMap[s.lectureStaffId] || '이름 없음'} 강사님 만족도
                    </p>
                    {[s.instrQuestion1, s.instrQuestion2, s.instrQuestion3].map((q, i) => (
                      <div key={i} className="mb-4">
                        <p className="mb-2 text-gray-800">Q{i + 1}. {q}</p>
                        <div className="flex justify-between px-4">
                          {[1, 2, 3, 4, 5].map(score => (
                            <label key={score} className="flex flex-col items-center text-sm text-gray-600 px-5">
                              <input
                                type="radio"
                                name={`instr-${idx}-${i}`}
                                value={score}
                                checked={s[`instrAnswer${i + 1}`] === score}
                                readOnly
                                className="mb-1 accent-gray-600"
                              />
                              {['매우 불만족', '불만족', '보통', '만족', '매우 만족'][score - 1]}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <button onClick={() => { setModalItem(null); setModalDetail(null); }} className="mt-4 px-6 py-2 border border-gray-400 rounded hover:bg-gray-100">닫기</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}