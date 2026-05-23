import React from "react";

export default function QRCodeModal({ open, onClose, qrUrl }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-xl font-bold mb-4">QR 코드 스캔</h2>
        <p className="text-sm text-gray-600 mb-2">핸드폰으로 QR을 스캔해 출석을 인증하세요</p>

        {/* QR 코드 이미지: 외부 API를 사용 */}
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=200x200`}
          alt="출석 QR 코드"
          className="mx-auto mb-4"
        />

        {/* QR이 담고 있는 URL도 텍스트로 표시 */}
        <p className="text-xs break-all text-gray-500">{qrUrl}</p>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
}