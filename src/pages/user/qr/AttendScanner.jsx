//import { useEffect } from 'react';
//import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';

export default function AttendScanner() {
  //const [searchParams] = useSearchParams();
  //const userId = searchParams.get('userId');

  useEffect(() => {

     // 실제 출석처리 대신 임시 메시지
     alert("출석 성공!");
     // 필요시 자동 창 닫기
     setTimeout(() => {
       window.close(); // 브라우저 팝업이면 닫힘
     }, 1000);
   }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-bold">출석 처리 중입니다...</p>
    </div>
  );
}
