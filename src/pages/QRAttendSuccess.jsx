// src/pages/qr/QRAttendSuccess.jsx

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function QRAttendSuccess() {
  const [params] = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
        axios.post(`/qr/confirm?token=${token}`)
        .then(() => {
          localStorage.setItem(`qr_token_${token}`, "CHECKED");
          setTimeout(() => {
            alert("출석 처리 완료! 창을 닫아주세요.");
            window.close();
          }, 1000);
        })
        .catch((err) => {
          alert("출석 처리 실패!");
          console.error(err);
        });
    }
  }, [token]);

  return (
    <div className="p-10 text-center">
      ✅ 출석 처리 완료<br />
      <span className="text-sm text-gray-500">(잠시 후 창이 닫힙니다)</span>
    </div>
  );
}
