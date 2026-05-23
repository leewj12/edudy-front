import React, { useEffect, useState ,useRef } from 'react';
import axios from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext'; 
import dayjs from 'dayjs';

export default function Survey() {
  const { userInfo } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [lecturePartId, setLecturePartId] = useState(userInfo?.partId || null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [answers, setAnswers] = useState({});

  const lectureRefs = [useRef(null), useRef(null), useRef(null)];
  const instrRefs = useRef([]);

  useEffect(() => {
    if (!userInfo?.partId) return;
  
    setLecturePartId(userInfo.partId);
  
    axios.get(`/user/survey/list/${userInfo.partId}`)
      .then(res => {
        setSurveys(res.data);
      })
      .catch(err => {
        console.error('❌ 설문 목록 조회 실패:', err);
      });
  }, [userInfo]);
  
  // ✅ 설문 완료 여부 판단 함수
  const isSurveyCompleted = (survey) => {
    const lectureDone =
      survey.lectureAnswer1 >= 1 &&
      survey.lectureAnswer2 >= 1 &&
      survey.lectureAnswer3 >= 1;

    const instrDone = survey.instrSurveys?.every(s =>
      s.instrAnswer1 >= 1 &&
      s.instrAnswer2 >= 1 &&
      s.instrAnswer3 >= 1
    ) ?? true;

    return lectureDone && instrDone;
  };

    const handleSurveyClick = (survey) => {
      if (isSurveyCompleted(survey)) {
        alert('이미 완료한 설문입니다.');
        return;
      }

      axios.get(`/user/survey/${survey.lectureSurveyId}`)
      .then(res => {
        setSelectedSurvey(res.data);
        setAnswers({});
      })
      .catch(() => {
        alert('설문 정보를 불러오는 중 오류가 발생했습니다.');
      });
  };


  const handleAnswerChange = (section, qIdx, value) => {
    const key = `${section}-${qIdx}`;
    setAnswers(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };


  const handleSubmit = () => {
    // 🔍 강의 설문 미응답 체크
    for (let i = 0; i < 3; i++) {
      if (!(answers[`lecture-${i}`] >= 1 && answers[`lecture-${i}`] <= 5)) {
        alert(`강의 Q${i + 1}에 답변을 선택해주세요.`);
        lectureRefs[i].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        lectureRefs[i].current?.focus?.();  // input은 아니지만 scroll 유도
        return;
      }
    }
  
    // 🔍 강사 설문 미응답 체크
    for (let i = 0; i < (selectedSurvey.instrSurveys?.length || 0); i++) {
      for (let j = 0; j < 3; j++) {
        const key = `instr-${i}-${j}`;
        if (!(answers[key] >= 1 && answers[key] <= 5)) {
          alert(`${selectedSurvey.instrSurveys[i].instructorName} 강사님의 Q${j + 1} 항목을 선택해주세요.`);
          const targetRef = instrRefs.current?.[`${i}-${j}`];
          targetRef?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetRef?.focus?.();
          return;
        }
      }
    }
  
    // ✅ 통과 후 payload 구성
    const payload = {
      lectureSurveyId: Number(selectedSurvey.lectureSurveyId),
      lectureAnswer1: Number(answers['lecture-0']),
      lectureAnswer2: Number(answers['lecture-1']),
      lectureAnswer3: Number(answers['lecture-2']),
      instrSurveys: selectedSurvey.instrSurveys?.map((s, idx) => ({
        instrSurveyId: s.instrSurveyId,
        lectureStaffId: Number(s.lectureStaffId),
        instrAnswer1: Number(answers[`instr-${idx}-0`]),
        instrAnswer2: Number(answers[`instr-${idx}-1`]),
        instrAnswer3: Number(answers[`instr-${idx}-2`])
      })) || []
    };
  
    axios.patch(`/user/survey/answers/${payload.lectureSurveyId}`, payload)
      .then(() => {
        alert('설문이 제출되었습니다.');
        setSelectedSurvey(null);
        axios.get(`/user/survey/list/${lecturePartId}`).then(res => {
          setSurveys(res.data);
        });
      })
      .catch(err => {
        console.error('❌ 제출 중 오류:', err);
        alert('제출 중 오류가 발생했습니다.');
      });
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6">설문조사</h2>

      {surveys.length === 0 ? (
        <p className="text-center text-gray-500 py-10">참여 가능한 설문이 없습니다.</p>
      ) : (
        <table className="w-full border-t border-b border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2">설문 제목</th>
              <th className="py-2">설문일자</th>
              <th className="py-2">상태</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((s, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSurveyClick(s)}
              >
                <td className="py-2 border-t border-b border-gray-300">{s.lectureSurveyTitle}</td>
                <td className="py-2 border-t border-b border-gray-300">{dayjs(s.lectureSurveyCreatedAt).format('YYYY-MM-DD')}</td>
                <td className={`py-2 border-t border-b border-gray-300 font-bold ${
                  isSurveyCompleted(s) ? 'text-green-600' : 'text-red-500'
                }`}>
                  {isSurveyCompleted(s) ? '완료' : '미완료'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedSurvey && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button className="absolute top-2 right-3 text-gray-500 hover:text-black" onClick={() => setSelectedSurvey(null)}>✕</button>

            <h3 className="text-xl font-bold text-center mb-6">{selectedSurvey.lectureSurveyTitle}</h3>
            <form className="space-y-6">
              {[selectedSurvey.lectureQuestion1, selectedSurvey.lectureQuestion2, selectedSurvey.lectureQuestion3].map((q, idx) => (
                <div key={idx} ref={lectureRefs[idx]}>
                  <p className="mb-2 text-gray-800">Q{idx + 1}. {q}</p>
                  <div className="flex justify-between px-5">
                    {[1, 2, 3, 4, 5].map(score => (
                      <label key={score} className="flex flex-col items-center text-sm text-gray-600 px-5">
                        <input
                          type="radio"
                          name={`lecture-${idx}`}
                          value={score}
                          checked={answers[`lecture-${idx}`] === score}
                          onChange={(e) => handleAnswerChange('lecture', idx, e.target.value)}
                          className="mb-1 accent-gray-600"
                        />
                        {['매우 불만족', '불만족', '보통', '만족', '매우 만족'][score - 1]}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {selectedSurvey.instrSurveys?.map((s, idx) => (
                <div key={idx}>
                  <p className="font-semibold mb-3 text-gray-800">{s.instructorName} 강사님 만족도</p>
                  {[s.instrQuestion1, s.instrQuestion2, s.instrQuestion3].map((q, i) => (
                     <div key={i} className="mb-4" ref={(el) => {
                      instrRefs.current[`${idx}-${i}`] = el;
                    }}>
                      <p className="mb-2 text-gray-800">Q{i + 1}. {q}</p>
                      <div className="flex justify-between px-5">
                        {[1, 2, 3, 4, 5].map(score => (
                          <label key={score} className="flex flex-col items-center text-sm text-gray-600 px-5">
                            <input
                              type="radio"
                              name={`instr-${idx}-${i}`}
                              value={score}
                              checked={answers[`instr-${idx}-${i}`] === score}
                              onChange={(e) => handleAnswerChange(`instr-${idx}`, i, e.target.value)}
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

              <div className="text-center mt-6">
                <button
                  type="button"
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleSubmit}
                >
                  제출하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}