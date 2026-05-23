import React, { useState, useRef} from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../routes/path';
import { Link } from "react-router-dom";
import PageMeta from '../../components/PageMeta';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    birth: '',
    birthBack: '',
    phone: '',
    postcode: '',
    address: '',
    addressDetail: '',
    grade: '',
    marketing: false,
    privacy: false,
  });

  const [valid, setValid] = useState({
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
    birth: null,
    birthBack: null,
    phone: null,
    postcode: null,
    address: null,
    addressDetail: null,
    grade: null,
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  // refs
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const birthRef = useRef();
  const birthBackRef = useRef();
  const phoneRef = useRef();
  const gradeRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };


  const convertToDateString = (birth6) => {
    // 주민번호 앞자리 YYMMDD → 19/20세기 구분 후 yyyy-MM-dd 반환
    const yearPrefix = parseInt(birth6.substring(0, 2)) >= 50 ? '19' : '20';
    const year = yearPrefix + birth6.substring(0, 2);
    const month = birth6.substring(2, 4);
    const day = birth6.substring(4, 6);
    return `${year}-${month}-${day}`;
  };

  //우편번호 api 사용
  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm(prev => ({ ...prev, postcode: data.zonecode, address: data.address }));
        setValid(prev => ({ ...prev, postcode: true, address: true }));
      },
    }).open();
  };


  //이메일 중복 확인
  const handleEmailCheck = async () => {
    const email = form.email.trim();
    if (!email) {
      alert("이메일을 먼저 입력해주세요.");
      emailRef.current?.focus();
      return;
    }
    const isValidFormat = /^\S+@\S+\.\S+$/.test(email);
    if (!isValidFormat) {
      alert("올바른 이메일 형식이 아닙니다.");
      emailRef.current?.focus();
      return;
    }
    try {
      const res = await axios.get(`/emailAlreadyExists?email=${email}`);
      if (res.data) {
        alert('이미 사용 중인 이메일입니다.');
        setEmailChecked(false);
        emailRef.current?.focus();
      } else {
        alert('사용 가능한 이메일입니다.');
        setEmailChecked(true);
      }
    } catch (err) {
      console.error("이메일 중복 확인 오류:", err);
      alert("이메일 확인 중 오류가 발생했습니다.");
      setEmailChecked(false);
      emailRef.current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      { key: 'name', ref: nameRef, label: '이름' },
      { key: 'email', ref: emailRef, label: '이메일' },
      { key: 'password', ref: passwordRef, label: '비밀번호' },
      { key: 'confirmPassword', ref: confirmPasswordRef, label: '비밀번호 확인' },
      { key: 'birth', ref: birthRef, label: '주민번호 앞자리' },
      { key: 'birthBack', ref: birthBackRef, label: '주민번호 뒷자리' },
      { key: 'phone', ref: phoneRef, label: '전화번호' },
      { key: 'grade', ref: gradeRef, label: '최종 학력' },
    ];

    for (const field of requiredFields) {
      const value = field.key === 'confirmPassword' ? confirmPassword : form[field.key];
      if (!value || value.trim() === '') {
        alert(`${field.label}을(를) 입력해주세요.`);
        field.ref.current?.focus();
        return;
      }
      if (valid[field.key] === false) {
        alert(`${field.label} 형식을 다시 확인해주세요.`);
        field.ref.current?.focus();
        return;
      }
    }

    if (!form.privacy) {
      alert('개인정보 수집에 동의해주세요.');
    return;
    }

    if (!emailChecked) {
      alert('이메일 중복 확인을 해주세요.');
    return;
    }
    try {
      const payload = {
        ...form,
        birth: convertToDateString(form.birth), // LocalDate 전송용
      };

      const res = await axios.post('/signup', payload);

      const { accessToken } = res.data;
      setAccessToken(accessToken); //전역 로그인 상태 설정
      toast.success('🎉 회원가입이 완료되었습니다!');
      navigate(PATH.Root);

    // } catch (err) {
    //   alert('회원가입 실패');
    //   console.error(err);
    // }

      } catch (err) {
        console.error(err);
      
        // 휴대전화 중복 메시지 처리
        if (err.response?.status === 400 && err.response?.data?.message?.includes('휴대폰')) {
          alert('이미 등록된 휴대전화 번호입니다.');
          phoneRef.current?.focus();
        } else {
          alert('회원가입 실패');
        }
      }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 mt-18 mb-8">
      <PageMeta title="회원가입" description="회원가입 페이지 입니다." />
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div className="text-center mb-4">
          <Link to="/">
            <img src="/logo.png" alt="logo" className="mx-auto mb-4 h-22" />
          </Link>
          <p className="mt-2 text-sm">
            이미 회원이신가요? <a href={PATH.Login} className="text-[#00C59E] font-semibold hover:underline cursor-pointer">로그인 하기</a>
          </p>
        </div>
  
        {/* 이름 */}
        <div>
          <label className="block mb-1 font-medium">이름 <span className="text-red-500">*</span></label>
          <input
            ref={nameRef}
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => {
              handleChange(e);
              setValid({ ...valid, name: e.target.value.trim().length > 0 });
            }}
            className={`w-full border p-3 rounded ${valid.name === false ? 'border-red-500' : valid.name === true ? 'border-green-500' : ''}`}
          />
          {valid.name === false && <p className="text-red-500 text-sm mt-1">이름을 입력해주세요.</p>}
        </div>
  
        {/* 이메일 */}
        <div>
          <label className="block mb-1 font-medium">이메일 <span className="text-red-500">*</span></label>
          <div className="flex space-x-2">
            <input
              ref={emailRef}
              type="text"
              name="email"
              value={form.email}
              onChange={(e) => {
                handleChange(e);
                setEmailChecked(false); // 변경 시 초기화
                const isValidFormat = /^\S+@\S+\.\S+$/.test(e.target.value);
                setValid({ ...valid, email: isValidFormat });
              }}
              className={`flex-1 border p-3 rounded ${
                emailChecked ? 'border-green-500'
                : valid.email === false ? 'border-red-500'
                : ''
              }`}
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              className={`px-3 py-2 rounded text-sm text-white ${
                emailChecked ? 'bg-green-200 hover:bg-green-300' : 'bg-gray-700 hover:bg-gray-600'
              } cursor-pointer`}
            >
              중복 확인
            </button>
          </div>
          {!emailChecked && valid.email === true && (
            <p className="text-yellow-600 text-sm mt-1">중복 확인이 필요합니다.</p>
          )}
          {valid.email === false && <p className="text-red-500 text-sm mt-1">올바른 이메일 형식이 아닙니다.</p>}
        </div>
  
        {/* 비밀번호 */}
        <div>
          <label className="block mb-1 font-medium">비밀번호 <span className="text-red-500">*</span></label>
          <input
            ref={passwordRef}
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => {
              handleChange(e);
              setValid({
                ...valid,
                password: e.target.value.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(e.target.value),
              });
            }}
            className={`w-full border p-3 rounded ${valid.password === false ? 'border-red-500' : valid.password === true ? 'border-green-500' : ''}`}
            placeholder="비밀번호 (8자 이상 + 특수문자)"
          />
          {valid.password === false && <p className="text-red-500 text-sm mt-1">비밀번호는 8자 이상이며 특수문자를 포함해야 합니다.</p>}
        </div>
  
        {/* 비밀번호 확인 */}
        <div>
          <label className="block mb-1 font-medium">비밀번호 확인 <span className="text-red-500">*</span></label>
          <input
            ref={confirmPasswordRef}
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setValid({ ...valid, confirmPassword: e.target.value === form.password });
            }}
            className={`w-full border p-3 rounded ${valid.confirmPassword === false ? 'border-red-500' : valid.confirmPassword === true ? 'border-green-500' : ''}`}
            placeholder="비밀번호를 확인해주세요."
          />
          {valid.confirmPassword === false && <p className="text-red-500 text-sm mt-1">비밀번호가 일치하지 않습니다.</p>}
        </div>
  
        {/* 주민등록번호 */}
        <div>
          <label className="block mb-1 font-medium">주민번호 <span className="text-red-500">*</span></label>
          <div className="flex items-center space-x-2">
            <input
              ref={birthRef}
              type="text"
              name="birth"
              maxLength={6}
              placeholder="앞자리 (YYMMDD)"
              value={form.birth}
              onChange={(e) => {
                handleChange(e);
                const val = e.target.value;
                if (!/^\d{6}$/.test(val)) {
                  setValid({ ...valid, birth: false });
                } else {
                  const month = parseInt(val.substring(2, 4), 10);
                  const day = parseInt(val.substring(4, 6), 10);
                  if (month < 1 || month > 12 || day < 1 || day > 31) {
                    setValid({ ...valid, birth: false });
                  } else {
                    setValid({ ...valid, birth: true });
                  }
                }
              }}
              className={`w-1/2 border p-3 rounded ${valid.birth === false ? 'border-red-500' : valid.birth === true ? 'border-green-500' : ''}`}
            />
            <span className="text-xl">-</span>
            {/* <input
              required
              type="password"
              name="birthBack"
              maxLength={7}
              placeholder="뒷자리 (7자리)"
              value={form.birthBack}
              onChange={(e) => {
                handleChange(e);
                setValid({ ...valid, birthBack: /^\d{7}$/.test(e.target.value) });
              }}
              className={`w-1/2 border p-3 rounded ${valid.birthBack === false ? 'border-red-500' : valid.birthBack === true ? 'border-green-500' : ''}`}
            /> */}

          <input
            ref={birthBackRef}
            type="password"
            name="birthBack"
            maxLength={7}
            placeholder="뒷자리 (7자리)"
            value={form.birthBack}
            onChange={(e) => {
              handleChange(e);
              const val = e.target.value;
              const isValid =
                /^\d{7}$/.test(val) &&
                ['1', '2', '3', '4'].includes(val.charAt(0));

              setValid({ ...valid, birthBack: isValid });
            }}
            className={`w-1/2 border p-3 rounded ${
              valid.birthBack === false ? 'border-red-500' : valid.birthBack === true ? 'border-green-500' : ''
            }`}
          />

          </div>
          {form.birth.length > 0 && valid.birth === false && (
            <p className="text-red-500 text-sm mt-1">주민번호 앞자리는 YYMMDD 형식이며 올바른 날짜여야 합니다.</p>
          )}
          {/* {form.birthBack.length > 0 && valid.birthBack === false && (
            <p className="text-red-500 text-sm mt-1">주민번호 뒷자리는 7자리 숫자여야 합니다.</p>
          )} */}

          {form.birthBack.length > 0 && valid.birthBack === false && (
            <p className="text-red-500 text-sm mt-1">
              주민번호 뒷자리는 7자리 숫자이며 첫 숫자는 1~4이어야 합니다.
            </p>
          )}

        </div>
        {/* 전화번호 */}
       {/* 전화번호 */}
        <div>
          <label className="block mb-1 font-medium">
            전화번호 <span className="text-red-500">*</span>
          </label>
          <input
            ref={phoneRef}
            type="tel"
            name="phone"
            placeholder="'-' 없이 숫자만 입력해주세요"
            value={form.phone}
            inputMode="numeric"          // 모바일 키패드 숫자 전용 유도
            pattern="[0-9]{10,11}"       // 숫자 10~11자리 정규식
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
              setForm({ ...form, phone: digitsOnly });
              setValid({ ...valid, phone: digitsOnly.length >= 10 });
            }}
            className={`w-full border p-3 rounded ${
              valid.phone === false
                ? 'border-red-500'
                : valid.phone === true
                ? 'border-green-500'
                : ''
            }`}
          />
          {valid.phone === false && (
            <p className="text-red-500 text-sm mt-1">전화번호를 10또는 11자리까지 입력해주세요.</p>
          )}
        </div>

        {/* 우편번호 */}
        <div>
          <label className="block mb-1 font-medium">우편번호</label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="postcode"
              value={form.postcode}
              readOnly
              className={`flex-1 border p-3 rounded ${valid.postcode === false ? 'border-red-500' : valid.postcode === true ? 'border-green-500' : ''}`}
            />
            <button
              type="button"
              onClick={handlePostcodeSearch}
              className="px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
            >
              우편번호 검색
            </button>
          </div>
          {valid.postcode === false && <p className="text-red-500 text-sm mt-1">우편번호를 입력해주세요.</p>}
        </div>

        {/* 주소 */}
        <div>
          <label className="block mb-1 font-medium">주소</label>
          <input
            type="text"
            name="address"
            value={form.address}
            readOnly
            className={`w-full border p-3 rounded ${valid.address === false ? 'border-red-500' : valid.address === true ? 'border-green-500' : ''}`}
          />
          {valid.address === false && <p className="text-red-500 text-sm mt-1">주소를 입력해주세요.</p>}
        </div>

        {/* 상세주소 */}
        <div>
          <label className="block mb-1 font-medium">상세주소</label>
          <input
            type="text"
            name="addressDetail"
            value={form.addressDetail}
            onChange={(e) => {
              handleChange(e);
              setValid({ ...valid, addressDetail: e.target.value.trim().length > 0 });
            }}
            className={`w-full border p-3 rounded ${valid.addressDetail === false ? 'border-red-500' : valid.addressDetail === true ? 'border-green-500' : ''}`}
          />
          {valid.addressDetail === false && <p className="text-red-500 text-sm mt-1">상세주소를 입력해주세요.</p>}
        </div>

        {/* 최종 학력 */}
        <div>
          <label className="block mb-1 font-medium">최종 학력 <span className="text-red-500">*</span></label>
          <input
            ref={gradeRef}
            type="text"
            name="grade"
            value={form.grade}
            onChange={(e) => {
              handleChange(e);
              setValid({ ...valid, grade: e.target.value.trim().length > 0 });
            }}
            className={`w-full border p-3 rounded ${
              valid.grade === false ? 'border-red-500' : valid.grade === true ? 'border-green-500' : ''
            }`}
          />
          {valid.grade === false && (
            <p className="text-red-500 text-sm mt-1">최종 학력을 입력해주세요.</p>
          )}
        </div>
  
        {/* 체크박스 */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" name="marketing" onChange={handleChange} />
          <label>마케팅 정보 수신 동의 (선택)</label>
        </div>
  
        <div className="flex items-center space-x-2">
          <input type="checkbox" name="privacy" onChange={handleChange} />
          <label className="font-medium">
            개인정보 수집 동의 <span className="text-red-500">*</span>
          </label>
        </div>
  
        {/* 가입 버튼 */}
        <button type="submit" className="w-full bg-[#192a48] text-white py-3 rounded hover:bg-[#00C59E] transition">
          가입하기
        </button>
      </form>
    </div>
  );

}

export default Signup;
