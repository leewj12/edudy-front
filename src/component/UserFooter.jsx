import React from "react";

export default function UserFooter() {
  return (
    <footer className="mt-auto bg-gray-50 py-8 text-sm text-gray-500 border-t border-gray-200 px-4 md:px-[128px]">
      <div className="space-y-2 leading-relaxed">
        <div className="flex items-center space-x-3 mb-3">
          <div>
            <p className="text-gray-800 font-bold text-base">(주) 에듀디</p>
            <p className="text-gray-500">대표: 박형배</p>
          </div>
          <img src="/hb.png" alt="박형배인" className="h-12" />
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-4 text-gray-400 text-xs">
          <p>이메일: support@edudy.com</p>
          <p>사업자 번호: 123-45-67890</p>
        </div>
        <p className="text-gray-400 text-xs">주소: 서울 서초구 동작대로 132 안석빌딩 9층</p>
      </div>
    </footer>
  );
}