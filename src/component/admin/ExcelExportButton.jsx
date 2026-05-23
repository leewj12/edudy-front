// // component/admin/ExcelExportButton.jsx
// import React from 'react';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// export default function ExcelExportButton({ data, filename = 'data', columns = null }) {
//   const handleDownload = () => {
//     const formatted = data.map((item) => {
//       if (columns) {
//         const filtered = {};
//         columns.forEach((col) => {
//           filtered[col.label] =
//             typeof col.format === 'function' ? col.format(item[col.key]) : item[col.key];
//         });
//         return filtered;
//       }
//       return item;
//     });

//     const ws = XLSX.utils.json_to_sheet(formatted);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, `${filename}.xlsx`);
//   };

//   return (
//     <button
//       onClick={handleDownload}
//       className="border border-gray-400 bg-white px-4 py-1 rounded hover:bg-gray-50 text-sm"
//     >
//       엑셀 다운로드
//     </button>
//   );
// }

// component/admin/ExcelExportButton.jsx
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs'; // 📌 추가 필요

export default function ExcelExportButton({ data, filename = 'data', columns = null }) {
  const handleDownload = () => {
    const formatted = data.map((item) => {
      if (columns) {
        const filtered = {};
        columns.forEach((col) => {
          filtered[col.label] =
            typeof col.format === 'function' ? col.format(item[col.key]) : item[col.key];
        });
        return filtered;
      }
      return item;
    });

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const today = dayjs().format('YYMMDD');
    saveAs(blob, `${today}_${filename}.xlsx`);
  };

  return (
    <button
      onClick={handleDownload}
      className="border border-gray-400 bg-white px-3 py-1 rounded hover:bg-gray-50 text-sm cursor-pointer"
    >
      Excel 다운로드
    </button>
  );
}