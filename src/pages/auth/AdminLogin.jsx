//관리자 로그인 페이지 (관리자,강사 로그인 가능)
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../routes/path';
import { useAuth } from '../../context/AuthContext';
import PageMeta from "../../components/PageMeta";

function Login() {

  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else {
      const isEmailValid = /^\S+@\S+\.\S+$/.test(form.email);
      if (!isEmailValid) {
        newErrors.email = '유효한 이메일 형식을 입력해주세요.';
      }
    }
  
    if (!form.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
  
    // 에러가 하나라도 있으면 서버 요청 안 보냄
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post('/adminLogin', form);
      const { accessToken } = res.data;

      setAccessToken(accessToken);

      alert('로그인 성공!');
      navigate(PATH.AdminDashboard);
    } catch (err) {
      
      const errData = err.response;
      console.log(errData);
      if (errData?.status === 400) {
        setErrors(errData.data);
      } else if (errData?.status === 401) {

        alert(errData.data.message);
      }else if (errData?.status === 403) {

        alert(errData.data.message);
      } else {
        alert("알 수 없는 에러가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <PageMeta title="관리자 로그인 - Edudy" description="관리자 로그인 페이지 입니다"/>
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-6">
        <img src="/logo.png" alt="codeit 로고" className="mx-auto mb-4 h-22" />
         
          <p className="text-sm mt-2">
            Edudy 관리자 센터에 오신것을 환영합니다!
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              name="email"
              placeholder="이메일"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#192a48] text-white py-3 rounded hover:bg-[#00C59E] transition cursor-pointer"
          >
            로그인 하기
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-500">
          <a href="#" className="hover:underline">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
}

export default Login;