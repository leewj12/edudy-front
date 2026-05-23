// src/pages/admin/AdminMyPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PageMeta from '../../components/PageMeta';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import noImage from '../../assets/noimage.png'; // 기본 이미지

export default function AdminMyPage() {
  const { accessToken } = useAuth();
  const [signature, setSignature] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  let userInfo = {};

  const roleMap = {
    ROLE_ADMIN: '관리자',
    ROLE_INSTRUCTOR: '강사',
  };


  try {
    if (accessToken) {
      userInfo = jwtDecode(accessToken);
    }
  } catch (e) {
    console.warn('토큰 디코딩 실패:', e);
  }
  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignature(file);
    }
  };

  const handleSignatureSubmit = () => {
    if (signature) {
      alert('서명이 등록되었습니다.');
      // 실제 서버 업로드 로직은 여기에 추가 예정
    } else {
      alert('서명을 먼저 선택해주세요.');
    }
  };

  return (
    <AdminLayout>
      
        <PageMeta title="관리자 마이페이지" description="내 정보와 활동 현황을 확인할 수 있습니다." />
        <h1 className="text-2xl font-bold ml-5 mb-6">내 정보</h1>
        <section className="bg-white p-6  max-w-[1300px] mx-auto">
          <div className="space-y-10 text-sm">
            <div className="flex ">
              <label className="text-gray-500 w-28">이름</label>
              <div className="font-medium">{userInfo.name || userInfo.userName || '이름 없음'}</div>
            </div>

            <div className="flex">
              <label className="text-gray-500 w-28">이메일</label>
              <div className="font-medium text-blue-600 underline">{userInfo.sub || '이메일 없음'}</div>
            </div>

            <div className="flex">
              <label className="text-gray-500 w-28">권한</label>
              <div className="font-medium">{roleMap[userInfo.role]}</div>
            </div>

            <div className="flex items-center">
              <label className="text-gray-500 w-28">비밀번호</label>
              <button
                className="border text-xs px-3 py-1 rounded hover:bg-gray-100"
                onClick={() => setShowPasswordModal(true)}
              >
                비밀번호 변경
              </button>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">관리자 서명</label>
              <div className="flex items-center gap-6">
                <img
                  src={signature ? URL.createObjectURL(signature) : noImage}
                  alt="서명 미리보기"
                  className="w-40 h-24 object-contain border rounded"
                />
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureChange}
                    className="border border-gray-300 rounded px-3 py-1"
                  />
                  <button className="text-xs border px-2 py-1 rounded hover:bg-gray-100"
                  onClick={handleSignatureSubmit}>서명 등록/수정</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 비밀번호 변경 모달 */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
              <h2 className="text-lg font-bold mb-4">비밀번호 변경</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">현재 비밀번호</label>
                  <input type="password" className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm mb-1">새 비밀번호</label>
                  <input type="password" className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm mb-1">새 비밀번호 확인</label>
                  <input type="password" className="w-full border px-3 py-2 rounded" />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="border px-4 py-1 rounded">
                    취소
                  </button>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                    변경하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      
    </AdminLayout>
  );
}