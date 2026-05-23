// 전체 코드: 성적 관리 페이지 (3스텝 포함 전부 수정 반영)
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';
import ExcelExportButton from '../../component/admin/ExcelExportButton';
import styles from '../../css/PrintOnly.module.css';

export default function Score() {
  const [step, setStep] = useState(1);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [average, setAverage] = useState(null);
  const [checkedScores, setCheckedScores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [form, setForm] = useState({
    type: '',
    subject: '',
    score: '',
    comment: '',
    day: dayjs().format('YYYY-MM-DD')
  });

  useEffect(() => {
    axios.get('/admin/lecture/list').then(res => {
      const filtered = res.data.filter(
        (c) => dayjs().isAfter(c.lectureStart) && dayjs().isBefore(c.lectureEnd)
      );
      setCourses(filtered);
    });
  }, []);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    axios.get(`/admin/lecture/part/list/${course.lectureId}`).then(res => {
      setStudents(res.data);
      setStep(2);
    });
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    axios.get(`/admin/score/list/${student.lecturePartId}`).then(res => {
      setScores(res.data);
      calculateAverage(res.data);
      setStep(3);
    });
  };

  const calculateAverage = (data) => {
    if (!data || data.length === 0) return setAverage(null);
    const valid = data.map(d => d.lectureProjectScore).filter(n => typeof n === 'number');
    const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
    setAverage(Math.round(avg));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const payload = {
      lectureProjectDay: form.day,
      lectureProjectCategory: form.type,
      lectureProject: form.subject,
      lectureProjectScore: parseInt(form.score),
      lectureProjectComment: form.comment
    };
    if (modalMode === 'create') {
      axios.post('/admin/score', {
        ...payload,
        lectureId: selectedCourse.lectureId,
        lecturePartId: selectedStudent.lecturePartId
      }).then(() => handleStudentClick(selectedStudent));
    } else {
      axios.patch(`/admin/score/${editingScoreId}`, payload).then(() => handleStudentClick(selectedStudent));
    }
    setForm({ type: '', subject: '', score: '', comment: '', day: dayjs().format('YYYY-MM-DD') });
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    Promise.all(checkedScores.map((id) => axios.delete(`/admin/score/${id}`))).then(() => handleStudentClick(selectedStudent));
  };

  const toggleCheck = (id) => {
    setCheckedScores((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAllCheck = () => {
    if (checkedScores.length === scores.length) setCheckedScores([]);
    else setCheckedScores(scores.map(s => s.lectureScoreId));
  };

  return (
    <AdminLayout>
      <PageMeta title="성적 관리" description="과정/수강생/성적을 단계적으로 관리합니다." />

      <div className="text-sm">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">진행 중인 과정</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-t border-gray-200 text-left min-w-[500px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-2 px-3">과정명</th>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">인원</th>
                    <th className="py-2 px-3">기간</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.lectureId} className="border-b hover:bg-gray-50 cursor-pointer border-gray-200" onClick={() => handleCourseClick(c)}>
                      <td className="py-2 px-3 font-semibold">{c.lectureTitle}</td>
                      <td className="py-2 px-3">{c.lectureId}</td>
                      <td className="py-2 px-3">{c.lectureEnrolled}명</td>
                      <td className="py-2 px-3 whitespace-nowrap">{c.lectureStart} ~ {c.lectureEnd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">[{selectedCourse.lectureTitle}] 수강생 목록</h2>
            {students.length === 0 ? (
              <p className="text-gray-500">등록된 수강생이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-t border-gray-200 text-left min-w-[400px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">이름</th>
                      <th className="py-2 px-3">전화번호</th>
                      <th className="py-2 px-3">생년월일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.lecturePartId} className="border-b hover:bg-gray-50 cursor-pointer border-gray-200" onClick={() => handleStudentClick(s)}>
                        <td className="py-2 px-3 font-semibold">{s.userName}</td>
                        <td className="py-2 px-3">{s.userPhone}</td>
                        <td className="py-2 px-3">{dayjs(s.userBirth).format('YYMMDD')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-center mt-6">
              <button onClick={() => setStep(1)} className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm">과정 목록으로</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
              <h2 className="text-xl font-semibold">[{selectedStudent.userName}] 성적 관리</h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setIsModalOpen(true)} className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">+ 추가</button>
                <button onClick={handleDelete} className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">삭제</button>

                <ExcelExportButton
                  data={scores} // ✅ 이거였지 scoreList 아님
                  filename={`${selectedStudent?.userName}_성적`}
                  columns={[
                    { key: 'lectureProjectDay', label: '시험일자' },
                    { key: 'lectureProjectCategory', label: '구분' },
                    { key: 'lectureProject', label: '시험과목' },
                    { key: 'lectureProjectScore', label: '점수' },
                    { key: 'lectureProjectComment', label: '비고' },
                  ]}
                />

                <button onClick={() => window.print()} className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">프린트</button>
              </div>
            </div>

            {scores.length > 0 ? (
              <>
                <div id="print-area" className="overflow-x-auto">
                  <table className="w-full border-t border-gray-200 text-center min-w-[600px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="print:hidden"><input type="checkbox" checked={scores.length > 0 && checkedScores.length === scores.length} onChange={(e) => {
                          if (e.target.checked) {
                            setCheckedScores(scores.map(s => s.lectureScoreId));
                          } else {
                            setCheckedScores([]);
                          }
                        }} /></th>
                        <th className="py-2 px-3">시험일자</th>
                        <th className="py-2 px-3">구분</th>
                        <th className="py-2 px-3">과제명</th>
                        <th className="py-2 px-3">점수</th>
                        <th className="py-2 px-3">비고</th>
                        <th className="py-2 px-3 print:hidden">수정</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((s) => (
                        <tr key={s.lectureScoreId} className="border-b border-gray-200">
                          <td className="px-2 print:hidden">
                            <input
                              type="checkbox"
                              checked={checkedScores.includes(s.lectureScoreId)}
                              onChange={() => toggleCheck(s.lectureScoreId)}
                            />
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">{s.lectureProjectDay}</td>
                          <td className="py-2 px-3">{s.lectureProjectCategory}</td>
                          <td className="py-2 px-3">{s.lectureProject}</td>
                          <td className="py-2 px-3">{s.lectureProjectScore != null ? `${s.lectureProjectScore}점` : '-'}</td>
                          <td className="py-2 px-3">{s.lectureProjectComment || '-'}</td>
                          <td className="py-2 px-3 print:hidden">
                            <button
                              onClick={() => {
                                setModalMode('edit');
                                setEditingScoreId(s.lectureScoreId);
                                setForm({
                                  type: s.lectureProjectCategory,
                                  subject: s.lectureProject,
                                  score: s.lectureProjectScore,
                                  comment: s.lectureProjectComment,
                                  day: s.lectureProjectDay
                                });
                                setIsModalOpen(true);
                              }}
                              className="text-blue-600 hover:underline cursor-pointer"
                            >수정</button>
                          </td>
                        </tr>
                      ))}

                      {/* 웹용 평균 점수 */}
                      <tr className="bg-gray-50 font-semibold no-print">
                        <td colSpan="4" className="py-2 px-3 text-right">평균 점수</td>
                        <td className="py-2 px-3 text-center">{average != null ? `${average}점` : '-'}</td>
                        <td colSpan="2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 프린트 전용 평균 점수 */}
                <div className="hidden print:block text-sm mt-4 text-right">
                  평균 점수: {average ?? '-'}점
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-500">등록된 시험/과제가 없습니다.</div>
            )}

            <div className="flex justify-center mt-6">
              <button onClick={() => setStep(2)} className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">수강생 목록으로</button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">{modalMode === 'create' ? '성적 추가' : '성적 수정'}</h3>
              <form onSubmit={handleModalSubmit} className="space-y-3">
                <input type="date" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full border px-3 py-2 rounded" required />
                <input type="text" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="구분*" className="w-full border px-3 py-2 rounded" required />
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="과목명*" className="w-full border px-3 py-2 rounded" required />
                <input
                type="number"
                min="0"
                max="100"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                placeholder="점수*"
                className="w-full border px-3 py-2 rounded"
                required
              />
                <input type="text" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="비고 (선택)" className="w-full border px-3 py-2 rounded" />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm">닫기</button>
                  <button type="submit" className="bg-[#192a48] text-white px-4 py-1 rounded hover:bg-[#142033] text-sm">{modalMode === 'create' ? '등록' : '수정'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
