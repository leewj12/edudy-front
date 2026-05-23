// 설명 툴팁 컴포넌트
import React from 'react';
import { Tooltip } from 'react-tooltip';

const TooltipLabel = ({ label, tooltipId, tooltipText }) => {
  return (
    <span className="inline-flex items-center">
      {label}
      <span
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipText}
        className="ml-2 w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center cursor-pointer"
      >
        ?
      </span>
      <Tooltip id={tooltipId} place="top" />
    </span>
  );
};

export default TooltipLabel;