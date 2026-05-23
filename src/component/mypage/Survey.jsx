import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Survey() {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // 더미 설문 목록
    setSurveys([
      { id: 1, title: "프론트엔드 과정 만족도 조사", date: "2024-06-01", isCompleted: false },
      { id: 2, title: "백엔드 과정 시설 평가", date: "2024-05-25", isCompleted: true },
    ]);
  }, []);

  const handleSurveyClick = (survey) => {
    if (survey.isCompleted) {
      alert("이미 완료된 설문 조사입니다.");
      return;
    }

    // 더미 설문 문항 불러오기
    const dummyQuestions = [
      "해당 과정에 대한 만족도는 어떠십니까?",
      "'더미강사1' 강사님에 대한 만족도는 어떠신가요?",
      "'더미강사2' 강사님에 대한 만족도는 어떠신가요?",
      "강의 시설에 대한 만족도는 어떠신가요?",
    ];
    setSelectedSurvey({ ...survey, questions: dummyQuestions });
    setAnswers({});
  };

  const handleAnswerChange = (qIdx, value) => {
    setAnswers({ ...answers, [qIdx]: value });
  };

  const handleSubmit = () => {
    console.log("제출된 설문:", selectedSurvey.id, answers);
    alert("설문이 제출되었습니다!");
    setSelectedSurvey(null);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6">설문조사</h2>
                    <div className="bg-white p-6 rounded shadow text-sm border border-gray-200">
      <table className="w-full text-sm border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">제목</th>
            <th className="p-2">날짜</th>
            <th className="p-2">완료 여부</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((s) => (
            <tr
              key={s.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSurveyClick(s)}
            >
              <td className="p-2">{s.title}</td>
              <td className="p-2">{s.date}</td>
              <td className={`p-2 font-bold ${s.isCompleted ? "text-green-600" : "text-red-500"}`}>
                {s.isCompleted ? "완료" : "미완료"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* 모달 */}
      {selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded w-full max-w-2xl shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
              onClick={() => setSelectedSurvey(null)}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4">{selectedSurvey.title}</h3>
            <form className="space-y-4">
              {selectedSurvey.questions.map((q, idx) => (
                <div key={idx}>
                  <label className="block font-medium mb-1">
                    {idx + 1}. {q}
                  </label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <label key={v} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          value={v}
                          checked={answers[idx] === String(v)}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="block font-medium mb-1">비고</label>
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  value={answers["memo"] || ""}
                  onChange={(e) => handleAnswerChange("memo", e.target.value)}
                  placeholder="추가 의견을 입력해주세요"
                />
              </div>

              <button
                type="button"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSubmit}
              >
                제출하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}