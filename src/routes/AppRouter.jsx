import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PATH } from './path';

// import Test from '../pages/Test';
// import Login from '../pages/auth/Login';
// import Signup from '../pages/auth/Signup';
// //import Dashboard from '../pages/admin/Dashboard';
// import Home from '../pages/guest/Home';
// import AdminDashboard from '../pages/admin/Dashboard';
// import LectureDetail from '../pages/guest/LectureDetail';
// import AdminLogin from "../pages/auth/AdminLogin";
// import Mypage from '../pages/user/mypage/Mypage';
// import Score from '../pages/user/mypage/Score';
// import Survey from '../pages/user/mypage/Survey';
// import Info from '../pages/user/mypage/Info';
// import LectureList from '../pages/admin/LectureList';
// import LectureForm from '../pages/admin/LectureForm';
// import UserList from '../pages/admin/UserList';
// import LecturePartList from '../pages/admin/LecturePartList';
// import AttendanceStatus from '../pages/admin/AttendanceStatus';
// import AttendanceSetting from '../pages/admin/AttendanceSetting';
// import AdminMyPage from '../pages/admin/AdminMyPage';
// import GuestLectureList from '../pages/guest/LectureList';
// import AttendScanner from '../pages/user/qr/AttendScanner';
// import QRAttendSuccess from '../pages/QRAttendSuccess';
// import AskList from '../pages/admin/AskList';
// import AdminScore from '../pages/admin/Score';
// import AdminInstr from '../pages/admin/AdminInstr';
// import Category from '../pages/admin/Category';
// import NotFound from '../pages/NotFound';
// import TrainList from '../pages/admin/TrainList';
// import TrainDetail from '../pages/admin/TrainDetail';

// lazy import for 코드 스플리팅 (용량 경량화를 위해서 사용)
const Test = lazy(() => import('../pages/Test'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const Home = lazy(() => import('../pages/guest/Home'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const LectureDetail = lazy(() => import('../pages/guest/LectureDetail'));
const AdminLogin = lazy(() => import("../pages/auth/AdminLogin"));
const Mypage = lazy(() => import('../pages/user/mypage/Mypage'));
const Score = lazy(() => import('../pages/user/mypage/Score'));
const Survey = lazy(() => import('../pages/user/mypage/Survey'));
const Info = lazy(() => import('../pages/user/mypage/Info'));
const LectureList = lazy(() => import('../pages/admin/LectureList'));
const LectureEdit = lazy(() => import('../pages/admin/LectureEdit'));
const LectureForm = lazy(() => import('../pages/admin/LectureForm'));
const UserList = lazy(() => import('../pages/admin/UserList'));
const LecturePartList = lazy(() => import('../pages/admin/LecturePartList'));
const AttendanceStatus = lazy(() => import('../pages/admin/AttendanceStatus'));
const AttendanceSetting = lazy(() => import('../pages/admin/AttendanceSetting'));
const AdminMyPage = lazy(() => import('../pages/admin/AdminMyPage'));
const GuestLectureList = lazy(() => import('../pages/guest/LectureList'));
const AttendScanner = lazy(() => import('../pages/user/qr/AttendScanner'));
const QRAttendSuccess = lazy(() => import('../pages/QRAttendSuccess'));
const AskList = lazy(() => import('../pages/admin/AskList'));
const AdminScore = lazy(() => import('../pages/admin/Score'));
const AdminInstr = lazy(() => import('../pages/admin/AdminInstr'));
const Category = lazy(() => import('../pages/admin/Category'));
const TrainList = lazy(() => import('../pages/admin/TrainList'));
const TrainDetail = lazy(() => import('../pages/admin/TrainDetail'));
const NotFound = lazy(() => import('../pages/NotFound'));
const AdminSms = lazy(() => import('../pages/admin/AdminSms'));
const AdminNavigation = lazy(() => import('../pages/admin/AdminNavigation'));
const AdminBanner = lazy(() => import('../pages/admin/AdminBanner'));
const AdminNotice = lazy(()=>import('../pages/admin/AdminNotice'))

function AppRouter() {
  return (
    <BrowserRouter>
    <Suspense fallback={<div className="text-center mt-10">로딩 중...</div>}>
      <Routes>
        <Route path={PATH.NotFound} element={<NotFound />} />
        <Route path={PATH.Test} element={<Test />} />

        {/* Guest */}
        <Route path={PATH.Root} element={<Home />} />
        <Route path={PATH.Login} element={<Login />} />
        <Route path={PATH.AdminLogin} element={<AdminLogin />} />
        <Route path={PATH.Signup} element={<Signup />} />
        <Route path={PATH.LectureDetailPath} element={<LectureDetail />} />
        <Route path={PATH.GuestLectureList} element={<GuestLectureList />} />

        {/* User */}
        <Route path={PATH.Mypage} element={<Mypage />} />
        <Route path={PATH.Score} element={<Score />} />
        <Route path={PATH.Survey} element={<Survey />} />
        <Route path={PATH.Info} element={<Info />} />
        <Route path={PATH.AttendScanner} element={<AttendScanner />} />
        <Route path={PATH.QRAttendSuccess} element={<QRAttendSuccess />} />

        {/* Admin */}
        <Route path={PATH.AdminDashboard} element={<AdminDashboard />} />
        <Route path={PATH.AdminNotice} element={<AdminNotice />} />
        <Route path={PATH.AdminMyPage} element={<AdminMyPage />} />
        <Route path={PATH.TrainList} element={<TrainList />} />
        <Route path={PATH.TrainDetailPath} element={<TrainDetail />} />
        <Route path={PATH.AttendanceStatus} element={<AttendanceStatus />} />
        <Route path={PATH.AttendanceSetting} element={<AttendanceSetting />} />
        <Route path={PATH.LecturePartList} element={<LecturePartList />} />
        <Route path={PATH.LectureList} element={<LectureList />} />
        <Route path={PATH.LectureEditPath} element={<LectureEdit />} />
        <Route path={PATH.LectureForm} element={<LectureForm />} />
        <Route path={PATH.UserList} element={<UserList />} />
        <Route path={PATH.Category} element={<Category />} />
        <Route path={PATH.AdminAsk} element={<AskList />} />
        <Route path={PATH.AdminScore} element={<AdminScore />} />
        <Route path={PATH.AdminInstr} element={<AdminInstr />} />
        <Route path={PATH.AdminSms} element={<AdminSms />} />
        <Route path={PATH.AdminNavigation} element={<AdminNavigation />} />
        <Route path={PATH.AdminBanner} element={<AdminBanner />} />
      </Routes>
    </Suspense>
  </BrowserRouter>

    // <BrowserRouter>
    //   <Routes>
    //     <Route path={PATH.NotFound} element={<NotFound />} /> {/* 404 처리 */}
    //     <Route path={PATH.Test} element={<Test />} />
    //     {/* <Route path={PATH.Dashboard} element={<Dashboard />} /> */}

    //     {/* 홈 페이지 라우트 */}
    //     <Route path={PATH.Root} element={<Home />} />
    //     <Route path={PATH.Login} element={<Login />} />
    //     <Route path={PATH.AdminLogin} element={<AdminLogin />} />
    //     <Route path={PATH.Signup} element={<Signup />} />
    //     <Route path={PATH.LectureDetailPath} element={<LectureDetail />} />
    //     <Route path={PATH.GuestLectureList} element={<GuestLectureList />} />
    //     {/* 유저 페이지 라우트 */}
    //     <Route path={PATH.Mypage} element={<Mypage />} />
    //     <Route path={PATH.Score} element={<Score />} />
    //     <Route path={PATH.Survey} element={<Survey />} />
    //     <Route path={PATH.Info} element={<Info />} />
    //     <Route path={PATH.AttendScanner} element={<AttendScanner />} />
    //     <Route path={PATH.QRAttendSuccess} element={<QRAttendSuccess />} />
    //     {/* 관리자 페이지 라우트 */}
    //       {/* 홈 */}
    //       <Route path={PATH.AdminDashboard} element={<AdminDashboard />} />
    //       {/* 관리자 마이 페이지 */}
    //       <Route path={PATH.AdminMyPage} element={<AdminMyPage />} />
    //       {/* 훈련일지 */}
    //       <Route path={PATH.TrainList} element={<TrainList />} />
    //       <Route path={PATH.TrainDetailPath} element={<TrainDetail />} />
    //       {/* 출결 현황 */}
    //       <Route path={PATH.AttendanceStatus} element={<AttendanceStatus />} />
    //       {/* 위험 수강생 관리 */}
    //       <Route path={PATH.AttendanceSetting} element={<AttendanceSetting />} />
    //       {/* 수강생 */}
    //       <Route path={PATH.LecturePartList} element={<LecturePartList />} />
    //       {/* 강의 */}
    //       <Route path={PATH.LectureList} element={<LectureList />} />
    //       <Route path={PATH.LectureForm} element={<LectureForm/>} />
    //       {/* 회원관리 */}
    //       <Route path={PATH.UserList} element={<UserList />} />
    //       {/* 카테고리 관리 */}
    //       <Route path={PATH.Category} element={<Category />} />
    //       {/* 과정 신청 목록 */}
    //       <Route path={PATH.AdminAsk} element={<AskList />} />
    //       {/* 관리자 점수 등록  */}
    //       <Route path={PATH.AdminScore} element={<AdminScore />} />
    //       {/* 담당자 등록 */}
    //       <Route path={PATH.AdminInstr} element={<AdminInstr />} />

    //   </Routes>
    // </BrowserRouter>
  );
}

export default AppRouter;