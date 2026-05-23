import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PATH } from './path';
import PrivateRoute from '../routes/PrivateRoute';


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
const GuestLectureList = lazy(() => import('../pages/guest/GuestLectureList'));
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
const AdminConsult = lazy(()=>import('../pages/admin/AdminConsult'))
const AdminSurvey = lazy(()=>import('../pages/admin/AdminSurvey'))
const AdminSurveyList = lazy(()=>import('../pages/admin/AdminSurveyList'))
const AdminLectureDetail = lazy(()=>import('../pages/admin/LectureDetail'))
const TestQR = lazy(()=>import('../pages/user/qr/TestQR'))


function AppRouter() {
  return (
    <BrowserRouter>
    <Suspense fallback={<div className="text-center mt-10">로딩 중...</div>}>
      <Routes>
        <Route path={PATH.NotFound} element={<NotFound />} />
        <Route path={PATH.None} element={<NotFound />} />

        {/* Guest */}
        <Route path={PATH.Root} element={<Home />} />
        <Route path={PATH.Login} element={<Login />} />
        <Route path={PATH.AdminLogin} element={<AdminLogin />} />
        <Route path={PATH.Signup} element={<Signup />} />
        <Route path={PATH.LectureDetailPath} element={<LectureDetail />} />
        <Route path={PATH.GuestLectureList} element={<GuestLectureList />} />
        <Route path={PATH.TestQR} element={<TestQR />} />

        {/* User */}
        <Route path={PATH.Mypage} element={<PrivateRoute allowedRoles={["ROLE_USER","ROLE_INSTRUCTOR","ROLE_ADMIN"]}><Mypage /></PrivateRoute>} />
        <Route path={PATH.Score} element={<PrivateRoute allowedRoles={["ROLE_USER","ROLE_INSTRUCTOR","ROLE_ADMIN"]}><Score /></PrivateRoute>} />
        <Route path={PATH.Survey} element={<PrivateRoute allowedRoles={["ROLE_USER","ROLE_INSTRUCTOR","ROLE_ADMIN"]}><Survey /></PrivateRoute>} />
        <Route path={PATH.Info} element={<PrivateRoute allowedRoles={["ROLE_USER","ROLE_INSTRUCTOR","ROLE_ADMIN"]}><Info /></PrivateRoute>} />
        <Route path={PATH.AttendScanner} element={<PrivateRoute allowedRoles={["ROLE_USER","ROLE_INSTRUCTOR","ROLE_ADMIN"]}><AttendScanner /></PrivateRoute>} />
        <Route path={PATH.QRAttendSuccess} element={<PrivateRoute allowedRoles={["ROLE_USER","ROLE_INSTRUCTOR","ROLE_ADMIN"]}><QRAttendSuccess /></PrivateRoute>} />

        {/* Admin */}
          <Route path={PATH.AdminDashboard} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><AdminDashboard /></PrivateRoute>} />

          <Route path={PATH.AdminNotice} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><AdminNotice /></PrivateRoute>} />
          <Route path={PATH.AdminMyPage} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><AdminMyPage /></PrivateRoute>} />
          <Route path={PATH.TrainList} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><TrainList /></PrivateRoute>} />
          <Route path={PATH.TrainDetailPath} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><TrainDetail /></PrivateRoute>} />
          <Route path={PATH.AttendanceStatus} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><AttendanceStatus /></PrivateRoute>} />
          <Route path={PATH.AttendanceSetting} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><AttendanceSetting /></PrivateRoute>} />
          <Route path={PATH.LecturePartList} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><LecturePartList /></PrivateRoute>} />
          <Route path={PATH.LectureList} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><LectureList /></PrivateRoute>} />
          <Route path={PATH.LectureEditPath} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><LectureEdit /></PrivateRoute>} />
          <Route path={PATH.LectureForm} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><LectureForm /></PrivateRoute>} />
          <Route path={PATH.UserList} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><UserList /></PrivateRoute>} />
          <Route path={PATH.Category} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><Category /></PrivateRoute>} />
          <Route path={PATH.AdminAsk} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><AskList /></PrivateRoute>} />
          <Route path={PATH.AdminScore} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><AdminScore /></PrivateRoute>} />
          <Route path={PATH.AdminInstr} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><AdminInstr /></PrivateRoute>} />
          <Route path={PATH.AdminSms} element={<PrivateRoute allowedRoles={["ROLE_ADMIN","ROLE_INSTRUCTOR"]}><AdminSms /></PrivateRoute>} />
          <Route path={PATH.AdminNavigation} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><AdminNavigation /></PrivateRoute>} />
          <Route path={PATH.AdminBanner} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><AdminBanner /></PrivateRoute>} />
          <Route path={PATH.AdminConsult} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><AdminConsult /></PrivateRoute>} />
          <Route path={PATH.AdminSurvey} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><AdminSurvey /></PrivateRoute>} />
          <Route path={PATH.AdminSurveyList} element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]}><AdminSurveyList /></PrivateRoute>} />
          <Route path={PATH.AdminLectureDetail} element={<PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_INSTRUCTOR"]}><AdminLectureDetail /></PrivateRoute>} />
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