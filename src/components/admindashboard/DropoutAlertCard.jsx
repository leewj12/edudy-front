import React from 'react';
const DangerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#FF4A5F" />
    <text x="10" y="15" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">!</text>
  </svg>
);

const DownTriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFC04D" xmlns="http://www.w3.org/2000/svg">
  <polygon points="12,18 4,6 20,6" />
</svg>
);

export default function DropoutAlertCard({
  rank,
  name,
  course,
  probability,
  status,
  attendance,
  assignments,
  lastDate,
  color,
}) {
  const styles = {
    pink: {
      border: 'border-[#FF4A5F]',
      bg: 'bg-[#FEF6FB]',
      text: 'text-[#FF4A5F]',
      icon: <DangerIcon />,
      badge: 'bg-[#FF4A5F] text-white',
    },
    blue: {
      border: 'border-[#FFC16B]',
      bg: 'bg-[#FFC16B]/10',
      icon: <DownTriangleIcon />,
      badge: 'bg-[#FFC16B] text-white',
    },
  };

  const style = styles[color] || styles.blue;

  return (
    <div className={`border ${style.border} ${style.bg} rounded-lg p-4`}>  
      <div className="flex items-center gap-2 text-sm font-semibold mb-1">
        <span className="text-lg">{style.icon}</span>
        <span>{rank}</span>
        <span className={`ml-2 font-bold ${style.text}`}>
          {name} ({course}) 이탈 확률 {probability}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${style.badge}`}>
          {status}
        </span>
        <span className="text-gray-500">출석률 {attendance}</span>
        <span className="text-gray-400">/ 과제 미제출 {assignments}</span>
        <span className="text-gray-400">/ 마지막 출석일: {lastDate}</span>
      </div>
    </div>
  );
}