// 상담 관리 페이지 전체 코드 (토큰 제거 버전)
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import PageMeta from '../../components/PageMeta';
import axios from '../../api/axiosInstance';
import dayjs from 'dayjs';
import ExcelExportButton from '../../component/admin/ExcelExportButton';
import styles from '../../css/PrintOnly.module.css';

export default function AdminConsult() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [consults, setConsults] = useState([]);
  const [checkedConsults, setCheckedConsults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingConsultId, setEditingConsultId] = useState(null);
  const [staffs, setStaffs] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [form, setForm] = useState({
    consultTitle: '',
    consultDate: dayjs().format('YYYY-MM-DD'),
    consultContent: '',
    consultSpecial: '',
    consultType: 'ACADEMIC',
    consultKeyword: 'LECTURE_DIFFICULTY',
    lecturePartId: '',
    lectureStaffId: '', 
  });

  const typeMap = {
    ACADEMIC: '학습 관련',
    CAREER: '진로 및 경력',
    PERSONAL: '개인',
    RISK_GROUP: '위험군'
  };
  const keywordMap = {
    ACADEMIC: [
      { value: 'LECTURE_DIFFICULTY', label: '수업 난이도' },
      { value: 'LECTURE_COMPLAINT', label: '수업 불만' },
      { value: 'ASSIGNMENT_BURDEN', label: '과제 부담' }
    ],
    CAREER: [
      { value: 'CAREER_CONCERN', label: '진로 고민' },
      { value: 'JOB_LINKAGE', label: '취업 연계' },
      { value: 'CAREER_BREAK', label: '경력 단절' }
    ],
    PERSONAL: [
      { value: 'CERTIFICATE', label: '자격증' },
      { value: 'PERSONAL_REASON', label: '개인 사정' },
      { value: 'LACK_OF_TIME', label: '시간 부족' }
    ],
    RISK_GROUP: [
      { value: 'FINANCIAL_DIFFICULTY', label: '경제적 어려움' },
      { value: 'EMOTIONAL_DIFFICULTY', label: '정서적 어려움' },
      { value: 'DROPOUT_SIGN', label: '중도 탈락 암시' }
    ]
  };

const getTypeLabel = (type) => typeMap[type] || type;

// 태그 변환
const getKeywordLabel = (type, keyword) => {
  const list = keywordMap[type] || [];
  const found = list.find(item => item.value === keyword);
  return found ? found.label : keyword;
};

  useEffect(() => {
    axios.get('/admin/lecture/list').then((res) => {
      const filtered = res.data.filter(c => dayjs().isSame(c.lectureStart) || dayjs().isAfter(c.lectureStart));
      setCourses(filtered);
    });
  }, []);

  const fetchConsults = (lectureId) => {
    axios.get(`/admin/consult/list/${lectureId}`).then(res => {
      console.log('📥 상담 리스트 응답:', res.data); // 👈 추가
      setConsults(res.data);
    });
  };
  const handleConsultView = (consult) => {
    setModalMode('view'); // 조회 모드
    setEditingConsultId(consult.lectureConsultId);
    setForm({
      consultTitle: consult.consultTitle || '',
      consultDate: consult.consultDate,
      consultContent: consult.consultContent,
      consultSpecial: consult.consultSpecial || '',
      consultType: consult.consultType,
      consultKeyword: consult.consultKeyword,
      lecturePartId: consult.lecturePartId?.toString() || '',
      lectureStaffId: consult.lectureStaffId?.toString() || '',
    });
    setIsModalOpen(true);
  };
  const handleConsultEdit = (consult) => {
    setModalMode('edit'); //수정 모드
    setEditingConsultId(consult.lectureConsultId);
    setForm({
      consultTitle: consult.consultTitle || '',
      consultDate: consult.consultDate,
      consultContent: consult.consultContent,
      consultSpecial: consult.consultSpecial || '',
      consultType: consult.consultType,
      consultKeyword: consult.consultKeyword,
      lecturePartId: consult.lecturePartId?.toString() || '',
      lectureStaffId: consult.lectureStaffId?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    axios.get(`/admin/lecture/part/list/${course.lectureId}`).then((res) => {
      setStudents(res.data);
      fetchConsults(course.lectureId);
    });
    axios.get(`/admin/staff/lecture/${course.lectureId}`).then((res) => {
      console.log("🔍 강사 목록 데이터:", res.data);  // 🔍 확인 포인트
      setStaffs(res.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('💬 저장 시 consultId:', editingConsultId);
    if (!form.lecturePartId || !form.lectureStaffId) {
      alert('학생과 담당자를 모두 선택해주세요.');
      return;
    }
    try {
      const payload = { ...form };
      if (modalMode === 'create') {
        await axios.post('/admin/consult', payload);
      } else {
        await axios.patch(`/admin/consult/${editingConsultId}`, payload);
      }
      setIsModalOpen(false);
      fetchConsults(selectedCourse.lectureId);
    } catch (err) {
      console.error('상담 저장 오류:', err);
    }
  };

  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
  
    Promise.all(checkedConsults.map(id => axios.delete(`/admin/consult/${id}`)))
      .then(() => {
        fetchConsults(selectedCourse.lectureId);
        setCheckedConsults([]);
        setIsAllChecked(false);
      });
  };
  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6 text-sm">
        <PageMeta title="상담 관리" description="과정별 수강생의 상담 목록을 관리합니다." />
        <Header />

        {!selectedCourse && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">진행 중인 과정</h2>
            <table className="w-full border-t border-gray-200 text-center">
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
                  <tr key={c.lectureId} 
                  className="border-b hover:bg-gray-50 cursor-pointer border-gray-200" 
                  onClick={() => handleCourseClick(c)}>
                    <td className="py-2 px-3 font-semibold">{c.lectureTitle}</td>
                    <td className="py-2 px-3">{c.lectureId}</td>
                    <td className="py-2 px-3">{c.lectureEnrolled}명</td>
                    <td className="py-2 px-3">{c.lectureStart} ~ {c.lectureEnd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedCourse && (
          <div>
            <h1 className="text-2xl font-bold mb-2">상담일지 목록</h1>
            <p className="text-gray-600 ml-1 mb-4">
                {selectedCourse.lectureTitle}
              </p>
            <div className="flex justify-end mb-4">
              <div className="space-x-2">
              <button
                onClick={() => {
                  setModalMode('create'); 
                  setEditingConsultId(null); 
                  setForm({
                    consultTitle: '',
                    consultDate: dayjs().format('YYYY-MM-DD'),
                    consultContent: '',
                    consultSpecial: '',
                    consultType: 'ACADEMIC',
                    consultKeyword: 'LECTURE_DIFFICULTY',
                    lecturePartId: '',
                    lectureStaffId: '',
                  });
                  setIsModalOpen(true);
                }}  
                className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">+ 등록</button>
               <button
                onClick={handleDelete}
                disabled={checkedConsults.length === 0}
                className={`border border-gray-400 px-4 py-1 rounded text-sm ${checkedConsults.length === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
              >
                삭제
              </button>
                <ExcelExportButton
                  data={consults}
                  filename={`${selectedCourse.lectureTitle}_상담일지`}
                  columns={[
                    { key: 'consultDate', label: '상담일자' },
                    { key: 'userName', label: '학생명' },
                    { key: 'consultType', label: '분류' },
                    { key: 'consultKeyword', label: '상담태그' },
                    { key: 'staffName', label: '담당자' }
                  ]}
                />
                <button onClick={() => window.print()} 
                className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">프린트</button>
              </div>
            </div>

            <table className="w-full border-t border-gray-200 text-center">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="print:hidden">
                    <input type="checkbox" 
                    checked={isAllChecked}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsAllChecked(checked);
                      if (checked) {
                        const allIds = consults.map(c => c.lectureConsultId);
                        setCheckedConsults(allIds);
                      } else {
                        setCheckedConsults([]);
                      }
                    }} />
                    </th>
                  <th className="py-2 px-3">상담일자</th>       
                  <th className="py-2 px-3">분류</th>
                  <th className="py-2 px-3">상담태그</th>
                  <th className="py-2 px-3">학생명</th>
                  <th className="py-2 px-3">담당자</th>
                  <th className="py-2 print:hidden"></th>  
                  <th className="py-2 print:hidden"></th>   
                </tr>
              </thead>
              <tbody>
                {consults.map((c) => (
                  <tr key={c.lectureConsultId} 
                  className="border-b border-gray-200"
                  >
                    <td className="px-2 print:hidden">
                      <input
                        type="checkbox"
                        checked={checkedConsults.includes(c.lectureConsultId)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          let newChecked = [];

                          if (isChecked) {
                            newChecked = [...checkedConsults, c.lectureConsultId];
                          } else {
                            newChecked = checkedConsults.filter(id => id !== c.lectureConsultId);
                          }

                          setCheckedConsults(newChecked);
                          setIsAllChecked(newChecked.length === consults.length); // 전체 선택 상태 업데이트
                        }}
                      />
                    </td>
                    <td className="py-2 px-3">{c.consultDate}</td>
                    <td className="py-2 px-3">{getTypeLabel(c.consultType)}</td>
                    <td className="py-2 px-3">{getKeywordLabel(c.consultType, c.consultKeyword)}</td>
                    <td className="py-2 px-3">{c.lecturePartName}</td>
                    <td className="py-2 px-3">{c.lectureStaffName}</td>
                    <td className="py-2 print:hidden">
                      <button
                        className="border border-gray-400 px-4 py-1 rounded cursor-pointer"
                        onClick={() => handleConsultView(c)}
                      >
                        조회
                      </button>
                    </td>
                    <td className="py-2 print:hidden">
                      <button
                        className="border border-gray-400 px-4 py-1 rounded cursor-pointer"
                        onClick={() => handleConsultEdit(c)}
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-6">
              <button onClick={() => setSelectedCourse(null)} 
              className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer">과정 목록으로</button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:block print:bg-white">
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl print:w-full print:max-w-none print:p-0" id="print-area">
              <h3 className="text-xl font-bold mb-3 text-left pb-2 print:mt-10">상담 일지</h3>
              <form className="text-sm w-full print:w-full print:mt-[30mm]" id="print-area"onSubmit={handleSubmit}>
                {/* 🔷 상단 테이블 */}
                <table className="w-full border border-l-0 border-r-0 border-gray-400 text-sm table-fixed">
                  <tbody>
                    {/* 첫 줄: 상담일자 / 분류 / 태그 */}
                    <tr className="border-gray-400 border-b border-t">
                      <td className="bg-[#FAFAFA] p-2 w-[12%] text-center">상담일자</td>
                      <td className="p-2 w-[20%] border border-gray-400">
                        <input
                          type="date"
                          value={form.consultDate}
                          onChange={(e) => setForm({ ...form, consultDate: e.target.value })}
                          className="w-full border border-gray-300 px-2 py-1 rounded"
                          disabled={modalMode === 'view'}
                        />
                      </td>
                      <td className="bg-[#FAFAFA] p-2 w-[12%] border border-gray-400 text-center">상담분류</td>
                      <td className="p-2 w-[20%]">
                        <select
                          value={form.consultType}
                          onChange={(e) => {
                            const newType = e.target.value;
                            setForm({ ...form, consultType: newType, consultKeyword: keywordMap[newType][0].value });
                          }}
                          className="w-full border border-gray-300 px-2 py-1 rounded"
                          disabled={modalMode === 'view'}
                        >
                          {Object.entries(typeMap).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="bg-[#FAFAFA] border border-gray-400 p-2 w-[12%] text-center">상담태그</td>
                      <td className="p-2 w-[20%]">
                        <select
                          value={form.consultKeyword}
                          onChange={(e) => setForm({ ...form, consultKeyword: e.target.value })}
                          className="w-full border border-gray-300 px-2 py-1 rounded"
                          disabled={modalMode === 'view'}
                        >
                          {(keywordMap[form.consultType] || []).map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {/* 둘째 줄: 과정명 / 학생명 / 담당자명 */}
                    <tr>
                      <td className="bg-[#FAFAFA] p-2 text-center">과정명</td>
                      <td className="p-2 border border-gray-400" colSpan={1}>
                        <div className="truncate ">{selectedCourse?.lectureTitle || '-'}</div>
                      </td>
                      <td className="bg-[#FAFAFA] p-2 border border-gray-400 text-center">학생명</td>
                      <td className="p-2">
                        <select
                          value={form.lecturePartId}
                          onChange={(e) => setForm({ ...form, lecturePartId: e.target.value })}
                          className="w-full border border-gray-300 px-2 py-1 rounded"
                          disabled={modalMode === 'view'}
                        >
                          <option value="">선택</option>
                          {students.map((s) => (
                            <option key={s.lecturePartId} value={s.lecturePartId}>{s.userName}</option>
                          ))}
                        </select>
                      </td>
                      <td className="bg-[#FAFAFA] p-2 border border-gray-400 text-center">담당자명</td>
                      <td className="p-2">
                      <select
                          value={form.lectureStaffId}
                          onChange={(e) => setForm({ ...form, lectureStaffId: e.target.value })}
                          className="w-full border border-gray-300 px-2 py-1 rounded"
                          disabled={modalMode === 'view'}
                        ><option value="">선택</option>
                        {staffs.map((s) => (
                          <option key={s.lectureStaffId} value={s.lectureStaffId}>
                            {s.userName}
                          </option>
                        ))}
                      </select>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 🔻 하단: 상담내용 + 특이사항 */}
                <table className="w-full border border-l-0 border-r-0 border-t-0 border-gray-400 text-sm table-fixed mb-6">
                <tbody>
                  {/* 상담내용 */}
                  <tr className="border-b border-gray-400">
                    <td colSpan={6} className="bg-[#FAFAFA] p-2 text-center">상담내용</td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="p-2">
                      <textarea
                        value={form.consultContent}
                        onChange={(e) => setForm({ ...form, consultContent: e.target.value })}
                        className="w-full px-2 py-1 rounded h-40"
                        disabled={modalMode === 'view'}
                      />
                    </td>
                  </tr>

                  {/* 특이사항 및 비고 */}
                  <tr className="border-b border-t border-gray-400">
                    <td colSpan={6} className="bg-[#FAFAFA] p-2 text-center">특이사항 및 비고</td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="p-2">
                      <textarea
                        value={form.consultSpecial}
                        onChange={(e) => setForm({ ...form, consultSpecial: e.target.value })}
                        className="w-full px-2 py-1 rounded h-40"
                        disabled={modalMode === 'view'}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
                <div className="flex justify-between items-center print:hidden mt-4">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm"
                  >
                    프린트
                  </button>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm"
                    >
                      목록
                    </button>
                    {modalMode !== 'view' && (
                      <button
                        type="submit"
                        className="border border-gray-400 bg-gray-200 px-4 py-1 rounded hover:bg-gray-300 text-sm"
                      >
                        저장
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
  </main>
</div>
);
}
