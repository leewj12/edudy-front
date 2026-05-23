import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

export default function ScoreC() {
  const { userInfo } = useAuth();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        if (!userInfo?.partId) return;
        const res = await axios.get(`/user/score/list/${userInfo.partId}`);
        console.log("불러온데이터",res.data)
        if (Array.isArray(res.data)) {
          setScores(res.data);
        } else {
          setScores([]);
        }
      } catch (err) {
        console.error("성적 조회 실패:", err);
        setScores([]);
      }
    };

    fetchScores();
  }, [userInfo?.partId]);

  const validScores = scores.filter(s => typeof s.lectureProjectScore === 'number');
  const average = validScores.length > 0
    ? Math.round(validScores.reduce((acc, s) => acc + s.lectureProjectScore, 0) / validScores.length)
    : '-';

  return (
    <div className="w-full">
      {/* 제목은 박스 바깥 */}
      <h2 className="text-xl font-semibold mb-4">성적 조회</h2>

      {/* 테이블 박스 */}
      <div className="bg-white p-6 rounded shadow text-sm border border-gray-200">
        <table className="w-full border-t border-gray-200 text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-2 px-3">시험일자</th>
              <th className="py-2 px-3">구분</th>
              <th className="py-2 px-3">과제명</th>
              <th className="py-2 px-3 text-right">점수</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3">{s.lectureProjectDay}</td>
                <td className="py-2 px-3">{s.lectureProjectCategory}</td>
                <td className="py-2 px-3">{s.lectureProject}</td>
                <td className="py-2 px-3 text-right">
                  {typeof s.lectureProjectScore === 'number' ? `${s.lectureProjectScore}점` : '-'}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td colSpan={3} className="py-2 px-3 text-left">평균 점수</td>
              <td className="py-2 px-3 text-right">
                {typeof average === 'number' ? `${average}점` : '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}