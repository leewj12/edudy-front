// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import catGif from '../assets/cat-404.gif'; // 이미지 경로

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffe8aa] text-gray-800 text-center p-6">
        <h1 className="text-3xl font-bold  text-[#966b2d] mb-2 font-[Jua]">404 - 페이지를 찾을 수 없다냥!</h1>
      <p className="text-lg mb-6">어딘가 길을 잃은 것 같다냥 ≽^•⩊•^≼</p>
      <img src={catGif} alt="404 고양이" className="w-120 max-w-full mb-6" />
      <button
        onClick={() => navigate('/')}
        className="bg-[#966b2d] hover:bg-[#eeaa45] text-white font-semibold py-2 px-4 rounded shadow"
      >
        집으로 돌아가자냥
      </button>
    </div>
  );
}
