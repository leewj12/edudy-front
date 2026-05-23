// 라우트 경로 정의
export const PATH = {
    Test: '/test',
    Root: '/', 

    NotFound: "/notfound",
    // guest
    AdminLogin: '/adminLogin',
    Login: '/login',
    Signup: '/signup',
    LectureDetail: (id) => `/lecture/${id}`, // 함수
    LectureDetailPath: '/lecture/:lectureId', // 라우터에 쓸 path 문자열은 따로
    GuestLectureList: '/lectureList',

    // user
    Mypage: '/user/mypage', 
    Score: '/user/score',
    Survey: '/user/survey',
    Info: '/user/info',
    AttendScanner: '/qr/attendt',
    QRAttendSuccess : '/qr/attend',

    // admin
    AdminDashboard: '/admin/dashboard',
    AdminMyPage: '/admin/mypage',
    AttendanceStatus:'/admin/att/status',
    AttendanceSetting:'/admin/attendance/setting',
    LecturePartList: '/admin/lecture/part/list',
    LectureList : '/admin/lecture/list',
    LectureEdit: (id) => `/admin/lecture/edit/${id}`, // 링크 생성용
    LectureEditPath: '/admin/lecture/edit/:lectureId', // 라우터에서 사용할 path
    LectureForm : '/admin/lecture/new',
    UserList :'/admin/users/list', 
    Category: '/admin/category',
    AdminAsk: '/admin/ask',
    AdminScore: '/admin/score',
    AdminInstr: '/admin/instr',
    TrainList: '/admin/train/list',
    TrainDetail: (id) => `/admin/trainList/${id}`,
    TrainDetailPath: '/admin/trainList/:lectureId',
    AdminSms: '/admin/sms',
    AdminNavigation: '/admin/navigation',
    AdminBanner: '/admin/banner',
    AdminNotice: '/admin/notice/list',
  };