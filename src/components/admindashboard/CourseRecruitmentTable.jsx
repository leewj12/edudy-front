// src/components/CourseRecruitmentTable.jsx
import React from 'react';

const CourseRecruitmentTable = () => {
  const data = [
    {
      course: '인공지능 데이터분석 및 예측을 활용한 웹서비스 개발과정',
      current: 18,
      capacity: 20,
      rate: '90%',
      start: 'D-3',
      dropout: 2,
    },
    {
      course: '프로젝트기반 자바&파이썬 풀스택 웹 개발자 양성과정',
      current: 10,
      capacity: 25,
      rate: '40%',
      start: '2025-07-03',
      dropout: 1,
    },
    {
      course: 'UI/UX 디자인 반응형 웹 양성과정',
      current: 3,
      capacity: 20,
      rate: '15%',
      start: '2025-08-01',
      dropout: 0,
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold mb-2">모집 중 강의 리스트</h3>
      <table className="w-full text-sm ">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-center p-2 border-b border-gray-300">과정명</th>
            <th className="text-center p-2 border-b border-gray-300">현재인원</th>
            <th className="text-center p-2 border-b border-gray-300">정원</th>
            <th className="text-center p-2 border-b border-gray-300">모집율</th>
            <th className="text-center p-2 border-b border-gray-300">개강일자</th>
            <th className="text-center p-2 border-b border-gray-300">탈락자</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr
              key={i}
              className={`text-gray-700 ${i === 0 ? 'bg-pink-50 font-bold' : ''}`}
            >
              <td className="text-center p-2 border-b border-gray-300">{d.course}</td>
              <td className="text-center p-2 border-b border-gray-300">{d.current}</td>
              <td className="text-center p-2 border-b border-gray-300">{d.capacity}</td>
              <td className="text-center p-2 border-b border-gray-300">{d.rate}</td>
              <td className={`text-center p-2 border-b border-gray-300 ${d.start.includes('D-') ? 'text-pink-500' : ''}`}>{d.start}</td>
              <td className="text-center p-2 border-b border-gray-300">{d.dropout}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseRecruitmentTable;
