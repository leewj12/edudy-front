// src/components/InquiryTable.jsx
import React from 'react';

const InquiryTable = () => {
  const inquiries = [
    {
      date: '2025-06-23',
      course: '빅데이터 분석 개발자 과정',
      content: '비전공자도 신청 가능한가요?',
      status: '미처리',
      handlerDate: '-',
    },
    {
      date: '2025-07-03',
      course: '프로젝트기반 자바&파이썬 풀스택 웹 개발자 양성과정',
      content: '국민내일배움카드가 없는데 일단 신청해두고...',
      status: '답변완료',
      handlerDate: '2025-06-17',
    },
  ];

  return (
    <div>
      <h3 className="text-base font-semibold mb-2">문의 리스트</h3>
      <table className="w-full text-sm ">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-center p-2 w-[150px] p-2 border-b border-gray-300">요청일자</th>
            <th className="text-center p-2 border-b border-gray-300">과정명</th>
            <th className="text-center p-2 border-b border-gray-300">문의 내용</th>
            <th className="text-center p-2 border-b border-gray-300">처리상태</th>
            <th className="text-center p-2 border-b border-gray-300">처리일자</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((q, i) => (
            <tr key={i} className="text-gray-700">
              <td className="text-center p-2 w-[150px] border-b border-gray-300">{q.date}</td>
              <td className="text-center p-2  border-b border-gray-300">{q.course}</td>
              <td className="text-center p-2  border-b border-gray-300">
                {q.status === '미처리' ? (
                    <>
                    <span className="text-red-400">● </span>
                    <span className="text-gray-800">{q.content}</span>
                    </>
                    ):(
                    q.content)
                    }</td>
              <td className="text-center p-2 border-b border-gray-300">
                {q.status === '미처리' ? (
                  <span className="text-red-400">{q.status}</span>
                ) : (
                  q.status
                )}
              </td>
              <td className="text-center p-2  border-b border-gray-300">{q.handlerDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InquiryTable;
