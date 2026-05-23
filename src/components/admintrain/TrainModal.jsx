import React, { useState,useEffect } from 'react';
import dayjs from 'dayjs';

export default function TrainModal({
  data,
  onClose,
  onSave,
  subjects,
  instructorSignUrl,
  managerSignUrl,
  instructors,
  mode = 'create', // 'create' | 'edit' | 'view'
  lectureId, 
}) {
  console.log('모달 모드:', mode);
  const isViewMode = mode === 'view';

  const [date, setDate] = useState('');
  const [lessons, setLessons] = useState([]);
  const [notes, setNotes] = useState({ absent: '', late: '', leave: '', etc: '' });
  const [etc, setEtc] = useState('');
  const [instructorList, setInstructorList] = useState([]);

  useEffect(() => {
    setInstructorList(instructors || []);
  }, [instructors]);

  const getUserIdByInstructor = (name) => {
    const found = instructorList.find((inst) => inst.userName === name);
    return found?.userId || null;
  };

  useEffect(() => {
    
    if (mode === 'create') {
      setDate(dayjs().format('YYYY-MM-DD'));
      setLessons(Array.from({ length: 8 }, () => ({
        subject: '',
        instructor: '',
        content: '',
      })));
      setNotes({ absent: '', late: '', leave: '', etc: '' });
      setEtc('');
      return;
    }

    if (!data) return;
  
    // 날짜
    setDate(data.trainDate || dayjs().format('YYYY-MM-DD'));
  
    // 교시별 내용 매핑
    setLessons(
      data.timeList?.map((time) => ({
        subject: time.trainTitle || '',
        instructor: time.instructorName || '',
        content: time.trainContent || '',
      })) || Array.from({ length: 8 }, () => ({
        subject: '',
        instructor: '',
        content: '',
      }))
    );
  
    // 특이사항
    setNotes({
      absent: data.trainAbsentees || '',
      late: data.trainLatecomers || '',
      leave: data.trainEarlyLeavers || '',
      etc: data.trainOutingStudents || '',
    });
  
    // 비고
    setEtc(data.trainSpecial || '');
  
  }, [data, mode]);
  

  const handleLessonChange = (index, field, value) => {
    if (isViewMode) return;
    const updated = [...lessons];
    updated[index] = { ...updated[index], [field]: value };
    setLessons(updated);
  };

  const handleSave = () => {
    const payload = {
      ...(mode === 'edit' && data?.trainId ? { trainId: data.trainId } : {}),
      lectureId: Number(lectureId),
      trainDate: date,
      trainSpecial: etc,
      trainAbsentees: notes.absent,
      trainEarlyLeavers: notes.leave,
      trainLatecomers: notes.late,
      trainOutingStudents: notes.etc,
      trainInstrSign: instructorSignUrl,
      trainAdminSign: managerSignUrl,
      timeRequests: lessons.map((lesson, index) => ({
        userId: getUserIdByInstructor(lesson.instructor),
        lectureTime: index + 1,
        trainTitle: lesson.subject,
        trainContent: lesson.content,
      })),
    };
  
    console.log("보내는 payload", payload);
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 ">
      <div className="bg-white w-[1000px] max-h-[90vh] overflow-y-auto p-6 rounded-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-4xl">&times;</button>
        <h2 className="text-xl font-bold ml-12 p-5">훈련 일지 {mode === 'edit' ? '수정' : mode === 'view' ? '조회' : '작성'}</h2>

        {/* 1. 상단 정보 테이블 */}
        <table className="w-[800px] mx-auto border border-l-0 border-r-0 border-b-0 border-gray-400 border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border-b-0 border-gray-400 bg-[#FAFAFA] w-[100px] text-center px-2 py-1">훈련일자</td>
              <td className="border border-gray-400 border-b-0 w-[300px] px-2 py-1">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => !isViewMode && setDate(e.target.value)}
                  className="w-[140px] px-2 py-1 border border-gray-400"
                  readOnly={isViewMode}
                />
              </td>
              <td className="border border-b-0 border-gray-400 bg-[#FAFAFA] w-[140px] text-center px-2 py-1">담당강사 서명</td>
              <td className="border border-b-0 border-gray-400 w-[150px] px-2 py-1">
                <div className="flex items-center h-10">
                  {instructorSignUrl && (
                    <img src={instructorSignUrl} alt="강사 서명" className="h-8 object-contain mx-auto" />
                  )}
                </div>
              </td>
              <td className="border border-b-0 border-gray-400 bg-[#FAFAFA] w-[130px] text-center px-2 py-1">책임자 서명</td>
              <td className="border-b-0 border-gray-400 w-[150px] px-2 py-1">
                {managerSignUrl && (
                  <img src={managerSignUrl} alt="책임자 서명" className="h-8 object-contain mx-auto" />
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 2. 훈련 내용 테이블 */}
        <table className="w-[800px] mx-auto border border-t-0 border-l-0 border-r-0 border-b-0 border-gray-400 border-collapse text-sm">
          <thead className="bg-[#FAFAFA] text-center h-10">
            <tr>
              <td className="border border-l-0 border-gray-400 px-2 py-1 w-[60px]">교시</td>
              <td className="border px-2 border-gray-400 py-1 w-[250px]">훈련과목</td>
              <td className="border px-2 border-gray-400 py-1 w-[180px]">담당강사</td>
              <td className="border border-r-0 border-gray-400 px-2 py-1">훈련내용</td>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson, i) => (
              <tr key={i}>
                <td className="border border-l-0 border-gray-400 text-center px-2 py-1">{i + 1}</td>
                <td className="border border-gray-400 px-2 py-1">
                  
                {isViewMode ? (
                      <div className="px-2 py-1 min-h-[32px] text-center">{lesson.subject || '-'}</div>
                    ) : (
                      <select
                        value={lesson.subject}
                        onChange={(e) => handleLessonChange(i, 'subject', e.target.value)}
                        className="w-full border border-gray-400 px-2 py-1"
                      >
                        <option value="">선택</option>
                        {subjects.map((subj) => (
                          <option key={subj} value={subj}>{subj}</option>
                        ))}
                      </select>
                    )}
                </td>
                <td className="border border-gray-400 px-2 py-1">
                {isViewMode ? (
                      <div className="px-2 py-1 min-h-[32px] text-center">{lesson.instructor || '-'}</div>
                    ) : (
                      <select
                        value={lesson.instructor}
                        onChange={(e) => handleLessonChange(i, 'instructor', e.target.value)}
                        className="w-full border border-gray-400 px-2 py-1"
                      >
                       <option value="">담당강사 선택</option>
                        {instructorList.map((staff) => (
                          <option key={staff.userId} value={staff.userName}>
                            {staff.userName}
                          </option>
                        ))}
                      </select>
                    )}
                </td>
                <td className="border border-r-0 border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={lesson.content}
                    onChange={(e) => handleLessonChange(i, 'content', e.target.value)}
                    className="w-full border border-gray-400 px-2 py-1"
                    readOnly={isViewMode}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3. 특이사항 테이블 */}
        <table className="w-[800px] mx-auto border border-l-0 border-t-0 border-r-0 border-gray-400 border-collapse text-sm mb-4">
          <tbody>
            <tr>
              <td className="border border-t-0 border-l-0 border-gray-400 bg-[#FAFAFA] font-semibold text-center align-middle whitespace-nowrap w-[100px]" rowSpan="4">
                특이사항
              </td>
              <td className="border border-t-0 border-gray-400 bg-[#FAFAFA] px-2 py-1 text-sm font-medium text-center whitespace-nowrap w-[80px]">결석자</td>
              <td className="border border-t-0 border-gray-400 border-r-0 px-2 py-1">
                <input
                  type="text"
                  value={notes.trainAbsentees}
                  onChange={(e) => !isViewMode && setNotes({ ...notes, absent: e.target.value })}
                  className="w-full border border-gray-400 px-2 py-1"
                  readOnly={isViewMode}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-[#FAFAFA] px-2 py-1 text-sm font-medium text-center whitespace-nowrap">지각자</td>
              <td className="border border-gray-400 border-r-0 px-2 py-1">
                <input
                  type="text"
                  value={notes.late}
                  onChange={(e) => !isViewMode && setNotes({ ...notes, late: e.target.value })}
                  className="w-full border border-gray-400 px-2 py-1"
                  readOnly={isViewMode}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-[#FAFAFA] px-2 py-1 text-sm font-medium text-center whitespace-nowrap">조퇴자</td>
              <td className="border border-gray-400 border-r-0 px-2 py-1">
                <input
                  type="text"
                  value={notes.leave}
                  onChange={(e) => !isViewMode && setNotes({ ...notes, leave: e.target.value })}
                  className="w-full border border-gray-400 px-2 py-1"
                  readOnly={isViewMode}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-r-0 border-gray-400 bg-[#FAFAFA] px-2 py-1 text-sm font-medium text-center whitespace-nowrap">외출자</td>
              <td className="border border-gray-400 border-r-0 px-2 py-1">
                <input
                  type="text"
                  value={notes.etc}
                  onChange={(e) => !isViewMode && setNotes({ ...notes, etc: e.target.value })}
                  className="w-full border border-gray-400 px-2 py-1"
                  readOnly={isViewMode}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-l-0 border-gray-400 bg-[#FAFAFA] font-semibold text-center px-2 py-1">기타사항</td>
              <td className="border border-r-0 border-gray-400 px-2 py-1" colSpan="2">
                <textarea
                  value={etc}
                  onChange={(e) => !isViewMode && setEtc(e.target.value)}
                  className="w-full h-24 border border-gray-400 px-2 py-1 mt-1"
                  readOnly={isViewMode}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4 mt-6">
          {!isViewMode && (
            <button type="button" onClick={handleSave} className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer">저장</button>
          )}
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded cursor-pointer">목록</button>
        </div>
      </div>
    </div>
  );
}
