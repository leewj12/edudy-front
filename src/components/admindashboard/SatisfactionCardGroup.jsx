// src/components/SatisfactionCardGroup.jsx
import React from 'react';

const cards = [
  { course: 'UX 디자인 실무과정', rate: 93, attendance: 89, like:4.7 ,assignment: 96 },
  { course: 'AI 플랫폼 구축 운영관리 과정', rate: 93, attendance: 89, like:4.7 ,assignment: 96 },
  { course: '프론트엔드 개발자 과정', rate: 93, attendance: 89, like:4.7 ,assignment: 96 },
  { course: '빅데이터 서비스 분석 개발자 과정', rate: 93, attendance: 89, like:4.7 ,assignment: 96 },
];

const SatisfactionCardGroup = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {cards.map((c, i) => (
        <div key={i} className="border border-gray-300 rounded-lg p-4 text-sm text-gray-700 bg-[#FAFAFA]">
          <div className="font-semibold mb-4">{c.course}</div>
            <div className="flex justify-center gap-8 text-sm mb-2">
                {/* 윗줄: 수료율, 출석률 */}
                <div className="flex flex-col items-start gap-[2px]">
                    <span>• 수료율: {c.rate}%</span>
                    <span>• 만족도: {c.like}</span>
                </div>

                {/* 아랫줄: 만족도, 과제 제출율 */}
                <div className="flex flex-col items-start gap-[2px]">
                    <span>• 출석률 평균: {c.attendance}%</span>
                    <span>• 과제 제출율: {c.assignment}%</span>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
};

export default SatisfactionCardGroup;
