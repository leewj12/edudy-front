import React from 'react';

const ConsultTagList = () => {
  const tags = [
    { label: '진로고민', count: 21 },
    { label: '수업 난이도', count: 18 },
    { label: '개인 사정', count: 12 },
    { label: '자격증 문의', count: 8 },
    { label: '취업 연계', count: 6 },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold mb-4">자주 사용되는 상담 태그 TOP5</h2>
      
      <div className="grid grid-cols-5 gap-5">
        {tags.map((tag, i) => (
          <div
            key={i}
            className="flex gap-2 items-center justify-center px-4 py-2 rounded-lg border bg-[#FAFAFA] text-gray-700 border-gray-300 text-sm"
          >
            <span>{tag.label}</span>
            <span className="text-sm text-gray-500">({tag.count}건)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultTagList;
