// src/components/NoticeTable.jsx
import React, { useEffect, useState } from 'react';

export default function NoticeTable() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('notices');
    if (saved) {
      setNotices(JSON.parse(saved).slice(0, 3)); // 최근 3개만
    }
  }, []);

  return (
    <div className="mb-4">
    <h3 className="text-base font-semibold mb-3">운영 공지사항</h3>
    <table className="w-full border-collapse mt-0">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="p-2 text-[12px] border-b border-gray-300 text-gray-500 w-[80px]">분류</th>
            <th className="p-2 text-[12px] border-b border-gray-300 text-gray-500" >과정명</th>
            <th className="p-2 text-[12px] border-b border-gray-300 text-gray-500">공지일자</th>
          </tr>
        </thead>
        <tbody>
         {notices.length > 0 ? (
            notices.map(([type, title, date], idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              <td className="p-2 text-[12px] border-b border-gray-300 text-center text-gray-500 w-[80px]">{type}</td>
              <td className="p-2 text-[12px] border-b border-gray-300 text-center text-gray-500"> 
                <div className="truncate overflow-hidden whitespace-nowrap max-w-[290px] text-center mx-auto">
                  {title}
                </div>
              </td>
              <td className="p-2 text-[12px] border-b border-gray-300 text-center text-gray-500">{date}</td>
            </tr>
             ))
           ) : (
            <tr>
              <td colSpan="3" className="text-center text-gray-400 py-4">
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
  );
}
