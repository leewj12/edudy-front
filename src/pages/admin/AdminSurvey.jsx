import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';

const DEFAULT_COURSE_QUESTIONS = [
  '강의 내용이 실제 업무·현장에 도움이 된다고 느꼈다.',
  '제공된 학습 자료(교재·슬라이드 등)가 이해하기 쉽고 체계적이었다.',
  '강의 진행 속도와 난이도가 나에게 적절했다.',
];

const DEFAULT_INSTRUCTOR_QUESTIONS = [
  '해당 강사는 핵심 개념을 명확하고 이해하기 쉽게 설명했다.',
  '해당 강사는 학습자의 질문·의견에 친절하고 신속하게 응답했다.',
  '해당 강사는 수업 참여를 적극적으로 유도해 학습 동기를 높여주었다.',
];

export default function AdminSurvey() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [questions, setQuestions] = useState([...DEFAULT_COURSE_QUESTIONS]);
  const [editCourseMode, setEditCourseMode] = useState(false);
  const [editInstructorMode, setEditInstructorMode] = useState({});
  const [instructorQuestions, setInstructorQuestions] = useState({});

  useEffect(() => {
    axios.get('/admin/lecture/list').then(res => {
      const today = dayjs();
      const ongoing = res.data.filter(c =>
        dayjs(c.lectureStart).isBefore(today.add(1, 'day')) &&
        dayjs(c.lectureEnd).isAfter(today.subtract(1, 'day'))
      );
      setCourses(ongoing);
    });
  }, []);

  const fetchInstructors = async (lectureId) => {
    try {
      const res = await axios.get(`/admin/staff/lecture/${lectureId}`);
      setInstructors(res.data);
      const init = {};
      const edit = {};
      res.data.forEach(i => {
        init[i.lectureStaffId] = [...DEFAULT_INSTRUCTOR_QUESTIONS];
        edit[i.lectureStaffId] = false;
      });
      setInstructorQuestions(init);
      setEditInstructorMode(edit);
    } catch (err) {
      console.error(err);
      setInstructors([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCourse) return alert('과정을 선택하세요');
    if (!window.confirm('만족도 조사를 등록한 이후에는 설문을 수정할 수 없습니다. 진행하시겠습니까?')) return;

    if (questions.some(q => !q.trim())) return alert('과정 문항을 모두 입력하세요');
    for (const q of Object.values(instructorQuestions)) {
      if (q.some(item => !item.trim())) return alert('강사 문항을 모두 입력하세요');
    }

    const payload = {
      lectureId: selectedCourse.lectureId,
      lectureSurveyTitle: surveyTitle,
      lectureQuestion1: questions[0],
      lectureQuestion2: questions[1],
      lectureQuestion3: questions[2],
      instrSurveys: Object.entries(instructorQuestions).map(([lectureStaffId, qs]) => ({
        lectureStaffId,
        instrQuestion1: qs[0],
        instrQuestion2: qs[1],
        instrQuestion3: qs[2],
      })),
    };

    try {
      await axios.post(`/admin/survey/${selectedCourse.lectureId}`, payload);
      alert('설문이 등록되었습니다.');
    } catch (err) {
      alert('등록 중 오류 발생');
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      
        <PageMeta title="만족도 조사" description="만족도 조사 등록" />
        <h1 className="text-2xl font-bold mb-6">만족도 조사</h1>

        {/* <div className="mb-4">
          <label className="block mb-1 font-semibold">과정 선택</label>
          <select
            className="border border-gray-400 p-2 rounded w-full max-w-md"
            onChange={(e) => {
              const course = courses.find(c => c.lectureId === Number(e.target.value));
              setSelectedCourse(course);
              setSurveyTitle(`${course.lectureTitle} 만족도 조사`);
              setQuestions([...DEFAULT_COURSE_QUESTIONS]);
              fetchInstructors(course.lectureId);
            }}
            value={selectedCourse?.lectureId || ''}
          >
            <option value="">-- 진행 중인 과정을 선택하세요 --</option>
            {courses.map(c => (
              <option key={c.lectureId} value={c.lectureId}>{c.lectureTitle}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">설문 제목</label>
          <input
            type="text"
            className="border border-gray-400 p-2 rounded w-full max-w-md"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            placeholder="설문 제목을 입력하세요"
          />
        </div> */}

        <div className="flex gap-4 items-end mb-6">
          {/* 과정 선택 */}
          <div className="flex-1">
            <label className="block mb-1 font-semibold">과정 선택</label>
            <select
              className="border border-gray-400 p-2 rounded w-full"
              onChange={(e) => {
                const course = courses.find(c => c.lectureId === Number(e.target.value));
                setSelectedCourse(course);
                setSurveyTitle(`${course.lectureTitle} 만족도 조사`);
                setQuestions([...DEFAULT_COURSE_QUESTIONS]);
                fetchInstructors(course.lectureId);
              }}
              value={selectedCourse?.lectureId || ''}
            >
              <option value="">-- 진행 중인 과정을 선택하세요 --</option>
              {courses.map(c => (
                <option key={c.lectureId} value={c.lectureId}>{c.lectureTitle}</option>
              ))}
            </select>
          </div>

          {/* 설문 제목 */}
          <div className="flex-1">
            <label className="block mb-1 font-semibold">설문 제목</label>
            <input
              type="text"
              className="border border-gray-400 p-2 rounded w-full"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="설문 제목을 입력하세요"
            />
          </div>
        </div>

        {/* 과정 설문 */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <label className="text-lg font-bold">과정 설문</label>
            <button onClick={() => setEditCourseMode(!editCourseMode)} className="border px-3 py-1 rounded">{editCourseMode ? '완료' : '수정'}</button>
          </div>
          {questions.map((q, idx) => (
            <div key={idx} className="border border-gray-400 rounded p-2 my-1">
              <p><strong>Q{idx + 1}.</strong> {editCourseMode ? (
                <input
                  value={q}
                  onChange={(e) => {
                    const newQs = [...questions];
                    newQs[idx] = e.target.value;
                    setQuestions(newQs);
                  }}
                  className="w-full border p-1 mt-1 rounded"
                />
              ) : q}</p>
            </div>
          ))}
        </div>

        {/* 강사 설문 */}
        {instructors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">강사 설문</h2>
            {instructors.map(instr => (
              <div key={instr.lectureStaffId} className="mb-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">강사명: {instr.userName}</p>
                  <button
                    className="border px-3 py-1 rounded"
                    onClick={() => setEditInstructorMode(prev => ({ ...prev, [instr.lectureStaffId]: !prev[instr.lectureStaffId] }))}
                  >{editInstructorMode[instr.lectureStaffId] ? '완료' : '수정'}</button>
                </div>
                {instructorQuestions[instr.lectureStaffId]?.map((q, i) => (
                  <div key={i} className="border border-gray-400 rounded p-2 my-1">
                    <p><strong>Q{i + 1}.</strong> {editInstructorMode[instr.lectureStaffId] ? (
                      <input
                        value={q}
                        onChange={(e) => {
                          setInstructorQuestions(prev => ({
                            ...prev,
                            [instr.lectureStaffId]: prev[instr.lectureStaffId].map((qq, ii) => ii === i ? e.target.value : qq)
                          }));
                        }}
                        className="w-full border p-1 mt-1 rounded"
                      />
                    ) : q}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* 등록 버튼 */}
        <div className="text-center">
          <button onClick={handleSubmit} className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            등록
          </button>
        </div>
      
    </AdminLayout>
  );
}