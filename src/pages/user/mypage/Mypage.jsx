// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Attendance from '../../../component/mypage/Attendance';
// import Grade from '../../../component/mypage/Grade';
// import Survey from '../../../component/mypage/Survey';
// import Info from '../../../component/mypage/Info';
// import UserHeaderSimple from '../../../component/UserHeaderSimple';
// import UserQa from '../../../component/UserQa';

// export default function Mypage() {
//   const [tab, setTab] = useState('출석부');
//   const [user, setUser] = useState({ userName: '', lectureName: '' });

//   // 더미 유저 정보
//   useEffect(() => {
//     // axios.get('/api/userinfo')
//     //   .then(res => setUser(res.data))
//     //   .catch(err => console.error(err));

//     setUser({
//       userName: '김현진',
//       lectureName: '프론트엔드 개발자 과정',
//     });
//   }, []);

//   const renderTab = () => {
//     switch (tab) {
//       case '출석부':
//         return <Attendance />;
//       case '성적 조회':
//         return <Grade />;
//       case '설문하기':
//         return <Survey />;
//       case '내 정보':
//         return <Info />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <UserHeaderSimple />

//       <div className="relative flex">
//         {/* 고정 사이드바 */}
//         <aside className="fixed top-[120px] left-0 w-85 h-[calc(100vh-80px)] bg-gray-50 p-6 overflow-y-auto z-40 pl-[128px]">
//           <div className="my-5">
//             <p className="text-lg font-bold">{user.userName}님</p>
//             <p className="text-sm text-gray-500 mt-1">{user.lectureName}</p>
//             <hr className="my-4 border-gray-300" />
//           </div>
//           <ul className="space-y-5">
//             {['출석부', '성적 조회', '설문하기', '내 정보'].map((item) => (
//               <li
//               key={item}
//               onClick={() => setTab(item)}
//               className={`flex justify-between items-center cursor-pointer pr-2 transition-colors duration-150
//                 ${tab === item
//                   ? 'text-black font-bold hover:text-[#00C59E] hover:bg-gray-100 rounded px-2'
//                   : 'text-gray-400 hover:text-[#00C59E] hover:bg-gray-100 rounded px-2'
//                 }`}
//             >
//               <span>{item}</span>
//               <span className="text-xs">&gt;</span>
//             </li>
//             ))}
//           </ul>
//         </aside>

//         {/* 콘텐츠 영역 */}
//         <main className="ml-85 flex-1 p-10">
//           {renderTab()}

//         </main>
//       </div>

//       <UserQa />
//     </>
//   );
// }
// src/pages/user/Mypage.jsx
import React from 'react';
import MyLayout from '../../../component/mypage/MyLayout';
import Attendance from '../../../component/mypage/Attendance';

export default function Mypage() {
  return (
    <MyLayout>
      <Attendance />
    </MyLayout>
  );
}