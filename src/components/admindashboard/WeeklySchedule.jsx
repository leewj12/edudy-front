// src/components/WeeklySchedule.jsx
import React from 'react';

export default function WeeklySchedule() {
  const schedules = [
    { date: '6/24(월)', text: '빅데이터 분석 개발자 과정 수료증 발급', color: '#22c55e' },
    { date: '6/26(수)', text: '만족도 조사 발송', color: '#60a5fa' },
    { date: '6/27(목)', text: 'AI과정 모집 마감', color: '#f472b6' },
  ];

  return (
    <div className="mt-7">   
    <h3 className="text-base font-semibold mb-3">이번주 주요 일정</h3> 
      <ul className="text-sm space-y-2 p-4 rounded shadow border border-gray-200">
        {schedules.map(({ date, text, color }, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {/* 색상 점 */}
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>

            {/* 날짜 */}
            <span className="text-gray-500 font-medium w-[80px]">{date}</span>

            {/* 설명 */}
            <span className="text-gray-800">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
