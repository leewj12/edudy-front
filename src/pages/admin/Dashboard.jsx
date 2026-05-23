import React, { useEffect,useState } from 'react';
{/* 사이드바 컴포넌트 */}
import Sidebar from '../../components/Sidebar';
{/* 물음표 툴팁 컴포넌트 */}
import TooltipLabel from '../../components/TooltipLabel';
{/* head변경 가능한 컴포넌트 */}
import PageMeta from '../../components/PageMeta';
{/* 헤더 컴포넌트 */}
import Header from '../../components/Header';
{/* 현황요약 컴포넌트 */}
import StatCard from '../../components/admindashboard/StatCard';
{/* 운영 일정 관리탭에 들어가는 컴포넌트*/}
import CalendarSection from '../../components/admindashboard/CalendarSection';
import NoticeTable from '../../components/admindashboard/Noticetable';
//import Calendar from '../components/Calendar';
import WeeklySchedule from '../../components/admindashboard/WeeklySchedule';
{/* 출결 현황 탭에 들어가는 컴포넌트*/}
import AttendanceLineChart from '../../components/admindashboard/AttendanceLineChart';
import DropoutAlertCard from '../../components/admindashboard/DropoutAlertCard';
import AttendanceBarChart from '../../components/admindashboard/AttendanceBarChart';
{/* 모집강의 현황탭에 들어가는 컴포넌트*/}
import InquiryTable from '../../components/admindashboard/InquiryTable';
import CourseRecruitmentTable from '../../components/admindashboard/CourseRecruitmentTable';

import ConsultTagList from '../../components/admindashboard/ConsultTagList';
import EmploymentBarChart from '../../components/admindashboard/EmploymentBarChart';
import SatisfactionCardGroup from '../../components/admindashboard/SatisfactionCardGroup';

export default function Dashboard() {

  const [activeTab, setActiveTab] = useState(0); //처음 화면일때 탭 디폴트 값 
  const [stats, setStats] = useState(null);

  useEffect(() => {
  // 추후 백엔드 연동을 대비한 더미 데이터
  const dummyStats = {
    totalCourses: 4,   
    averageAttendance: '90%',
    dangerStudents: 6,
    recruitingCourses: 3,
    satisfaction: 4.7
  };

  // 테스트용 딜레이
  setTimeout(() => {
    setStats(dummyStats);
  }, 500);
}, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });


  const tabs = ['운영 일정 관리', '출결 현황', '모집강의 현황', '수강생 주요 지표'];

  return (
    <div className="flex w-screen h-screen overflow-hidden min-w-[1400px]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-white p-6">
        
      {/* 페이지 헤더정보 */}
      <PageMeta title="관리자 대시보드" description="관리자 대시보드 입니다." />

       <Header /> 

        {/* 오늘 현황 요약 */}
        <section className="mb-8">
          <section className="bg-white p-6 rounded-lg border border-gray-200 mb-6 min-w-[1200px]"
          style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-xl font-bold">
                오늘 현황 요약 
              </h1>
              <span className="text-xs text-gray-400">{formattedDate}</span>
            </div>
          <div className="grid grid-cols-5 gap-4">

            <StatCard 
            label="운영 강의" 
            value={stats?.totalCourses ?? "-"}
            color="bg-blue-50"
            valueColor="text-blue-600"/>

            <StatCard 
            label="운영 강의 평균 출석률" 
            value={stats?.averageAttendance ?? "-"}
            color="bg-blue-50"
            valueColor="text-blue-600"/>

            <StatCard 
            label={
              <TooltipLabel
                  label="위험 수강생"
                  tooltipId="danger-tooltip"
                  tooltipText="출석률이 낮거나 상담이 필요한 학생을 의미합니다"
              />              
            }
            value={stats?.dangerStudents ?? "-"}
            color="bg-pink-50"
            valueColor="text-pink-600"
            highlight />

            <StatCard label="모집 중 강의" 
            value={stats?.recruitingCourses ?? "-"}
            color="bg-gray-50"
            valueColor="text-black"
            />

            <StatCard label={
             <TooltipLabel
                label="평균 만족도"
                tooltipId="satisfaction-tooltip"
                tooltipText="강의 평균 만족도 입니다"
              />          
            } 
            value={stats?.satisfaction ?? "-"} 
            color="bg-gray-50"
            valueColor="text-black"/>

          </div>
          </section>
        </section>

        {/* 탭 메뉴 */}
        <section 
        className="bg-white p-6 rounded-lg border border-gray-200 mb-6 min-w-[1200px]"
        style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
          <div className="flex space-x-4 text-base font-bold">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`pb-5 px-22 border-b-2 ${
                  activeTab === index
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 운영 일정 관리 탭 내용 */}
          {activeTab === 0 && (
          <div className="flex gap-8">

            <div className="w-1/2 h-[400px]">
              <CalendarSection />
            </div>

            {/* 오른쪽: 일정 + 공지사항 */}
            <div className="w-1/2 flex flex-col gap-7">
              
              {/* 이번주 주요 일정 */}
              <WeeklySchedule />

              {/* 운영 공지사항 테이블 */}          
              <NoticeTable />
            </div>
          </div>  
        )}

          {/* 출결현황 탭 내용 */}
          {activeTab === 1 && (
          <div>
            <div className="mt-4 grid grid-cols-9 gap-7">
              {/* 좌측 2칸 */}
              <div className="col-span-4">
              {/* 이탈자 예측 알림 카드 영역 */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold mb-4">이탈자 예측 알림
                <TooltipLabel
                  tooltipId="dropout-tooltip"
                  tooltipText="가장 예의주시 해야하는 두명을 나타냅니다"
                />      
                </h2> 
                <DropoutAlertCard
                  rank="1순위"
                  name="김지은"
                  course="빅데이터 분석 개발자 과정"
                  probability="70%"
                  status="상담 요청 필요"
                  attendance="82%"
                  assignments="2회"
                  lastDate="6/19(목)"
                  color="pink"
                />
                <DropoutAlertCard
                  rank="2순위"
                  name="박상호"
                  course="파이썬 프로그래밍 기초"
                  probability="50%"
                  status="주의 관찰 요망"
                  attendance="87%"
                  assignments="1회"
                  lastDate="6/19(목)"
                  color="blue"
                />
              </div>

              {/* 최근 4주 출석률 추이 요약 차트 위치 */}
              <div className="bg-white mt-8 p-4 border-gray-200">
                <h2 className="text-sm font-semibold mb-2">최근 4주 출석률 추이 요약</h2>
                <div className="h-[133px]">
                  {/* 추후 라인 차트 또는 영역 차트 컴포넌트 삽입 위치 */}
                  <AttendanceLineChart />
                </div>
              </div>
            </div>

              {/* 우측: 상담 태그 + 모집 현황 테이블 */}
              <div className="col-span-5 min-w-[600px] flex flex-col mt-2">
              <AttendanceBarChart />
                
              </div>
            </div>
          </div>
          )}
          
          {/* 모집강의 현황 탭 내용 */}
          {activeTab === 2 && (
          <div className="mt-6 text-sm text-gray-600">
            <CourseRecruitmentTable />
            <div>
              <InquiryTable />
            </div>
          </div>
          )}
          {/* 수강생 주요 지표 탭 내용 */}
          {activeTab === 3 && (
             <div className="mt-6 text-sm text-gray-600">
    
              {/* 상담 태그: 상단 전체 */}
              <ConsultTagList />
         
              {/* 하단 2단 레이아웃 (좌: 취업률, 우: 수료율카드) */}
              <div className="grid grid-cols-9 gap-10 mt-10">
                
                {/* 왼쪽: 취업률 그래프 */}
                <div className="col-span-4">
                  <h2 className="text-sm font-semibold mb-2">강의별 취업률</h2>
                  <EmploymentBarChart />
                </div>

                {/* 오른쪽: 수료율 카드 */}
                <div className="col-span-5">
                  <h2 className="text-sm font-semibold mb-2">강의별 수료율 카드</h2>
                  <SatisfactionCardGroup />
                </div>

              </div>
            </div> 
          )}  
        </section>
      </main>
    </div>
  );
}
