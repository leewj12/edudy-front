// src/components/AskModal.jsx
import React, { useState } from 'react';
import useAxios from '../api/useAxios';
import axios from '../api/axiosInstance';
import dayjs from 'dayjs';

export default function AskModal({ onClose }) {
  const [form, setForm] = useState({
    askName: '',
    askPhone: '',
    lectureId: '',
    askCard: false,
    askMemo: ''
  });

  // 🔹 비회원 강의 목록 조회 (GET)
  const { data: lectures } = useAxios('/guest/lecture/list');

  // 🔹 오늘 이후 시작 강의만 필터링
  const filteredLectures = lectures?.filter(item =>
    dayjs(item.lectureStart).isAfter(dayjs())
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    const { askName, askPhone, lectureId, askCard, askMemo } = form;

    if (!askName || !askPhone || !lectureId) {
      return alert('이름, 연락처, 관심 과정은 필수입니다.');
    }
    if (!/^\d{11}$/.test(askPhone)) {
      return alert('휴대전화 번호는 11자리 숫자만 입력해주세요.');
    }
    if (!askCard) {
      return alert('개인정보 수집 동의가 필요합니다.');
    }

    try {
      await axios.post('/ask', {
        lectureId: Number(lectureId),
        askName,
        askPhone,
        askCard,
        askMemo
      });
      alert('상담 신청이 완료되었습니다.');
      onClose();
    } catch (err) {
      console.error(err);
      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.includes('이미')
      ) {
        alert('이미 신청하신 수강내역이 존재합니다.');
      } else {
        alert('신청 실패');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">신청문의</h2>
          <button onClick={onClose} className="text-4xl cursor-pointer">&times;</button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          궁금하신 사항을 보내주세요. 확인 후 빠른 시간 내에 상담을 도와드립니다.
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <input
            type="text"
            name="askName"
            value={form.askName}
            onChange={handleChange}
            placeholder="이름*"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="tel"
            name="askPhone"
            value={form.askPhone}
            onChange={handleChange}
            placeholder="연락처* (숫자만 입력)"
            className="w-full border px-3 py-2 rounded"
            maxLength={11}
          />
          <select
            name="lectureId"
            value={form.lectureId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded cursor-pointer"
          >
            <option value="">관심 과정 선택*</option>
            {filteredLectures?.map(item => (
              <option key={item.lectureId} value={item.lectureId}>
                {item.lectureTitle}
              </option>
            ))}
          </select>
          <textarea
            name="askMemo"
            value={form.askMemo}
            onChange={handleChange}
            placeholder="상담 내용 (선택)"
            className="w-full border px-3 py-2 rounded h-28"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              name="askCard"
              checked={form.askCard}
              onChange={handleChange}
              className="mr-2 cursor-pointer"
            />
            개인정보수집동의*
          </label>
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded cursor-pointer"
          >
            상담신청
          </button>
        </div>
      </div>
    </div>
  );
}