import React from "react";

export default function UserFooter() {
  return (
    <footer className="px-[128px] mt-auto bg-white py-6 text-sm text-gray-500 border-t px-8 border-gray-200">
      {/* <div className="space-y-1 leading-relaxed">
        <p>(주) 에듀디</p>
        <p>대표: 박형배</p>
        <p>이메일: support@edudy.com</p>
        <p>사업자 번호: 123-45-67890</p>
        <p>주소: 서울 서초구 동작대로 132 안석빌딩 9층</p>
      </div> */}
      <div className="space-y-1 leading-relaxed">
      <div className="flex items-center space-x-2">
        <div>
          <p>(주) 에듀디</p>
          <p>대표: 박형배</p>
        </div>
        <img src="/hb.png" alt="박형배인" className="h-12" />
      </div>

      <p>이메일: support@edudy.com</p>
      <p>사업자 번호: 123-45-67890</p>
      <p>주소: 서울 서초구 동작대로 132 안석빌딩 9층</p>
    </div>
    </footer>
  );
}