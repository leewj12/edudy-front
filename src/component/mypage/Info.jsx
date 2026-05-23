import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export default function Info() {
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [form, setForm] = useState({});
  const [emailChecked, setEmailChecked] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    axios.get('/user/me')
      .then((res) => {
        setUserInfo(res.data);
        setForm({
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email,
          postcode: res.data.postcode || '',
          address: res.data.address || '',
          addressDetail: res.data.addressDetail || '',
          marketing: res.data.marketing,
        });
      })
      .catch(() => toast.error('유저 정보를 불러오지 못했습니다.'));
  }, []);

  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm((prev) => ({ ...prev, postcode: data.zonecode, address: data.address }));
      },
    }).open();
  };

  const handleEmailCheck = async () => {
    const email = form.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.warn('올바른 이메일 형식이 아닙니다.');
      return;
    }
    try {
      const res = await axios.get(`/emailAlreadyExists?email=${email}`);
      if (res.data) {
        toast.error('이미 사용 중인 이메일입니다.');
        setEmailChecked(false);
      } else {
        toast.success('사용 가능한 이메일입니다.');
        setEmailChecked(true);
      }
    } catch {
      toast.error('이메일 확인 중 오류 발생');
    }
  };

  const handlePasswordChange = async () => {
    const current = prompt('현재 비밀번호를 입력해주세요');
    if (!current) return;
    try {
      await axios.post('/login', {
        email: userInfo.email,
        password: current,
      });
      setShowPasswordFields(true);
      toast.success('비밀번호 확인 완료');
    } catch {
      toast.error('현재 비밀번호가 일치하지 않습니다.');
    }
  };

  const isPasswordValid = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
  };

  const handlePasswordSubmit = async () => {
    if (!isPasswordValid(newPassword)) {
      toast.error('8자 이상, 영문+숫자+특수문자를 포함해야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await axios.patch('/user/me/password', { newPassword: newPassword });
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      setShowPasswordFields(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        userEmail: form.email,
        userPostcode: form.postcode,
        userAddress: form.address,
        userAddressDetail: form.addressDetail,
        userMarketing: form.marketing,
      };
      await axios.patch('/user/me', payload);
      toast.success('수정된 정보를 저장했습니다.');

      
      const res = await axios.get('/user/me');
      // form과 userInfo 상태 갱신
      setUserInfo(res.data);
      setForm({
        email: res.data.email,
        postcode: res.data.postcode || '',
        address: res.data.address || '',
        addressDetail: res.data.addressDetail || '',
        marketing: res.data.marketing,
      });
        setEditMode(false);
    } catch {
      toast.error('정보 수정에 실패했습니다.');
    }
  };

  if (!userInfo) return <div className="text-sm text-gray-500">로딩 중...</div>;

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">내 정보</h2>
        <p>이름: {userInfo.name}</p>
        <p className='mt-3'>휴대폰: {userInfo.phone}</p>
      </div>

      <hr className="border-gray-300" />

      {/* 이메일 + 수정 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center flex-1 gap-2">
          <label className="w-28 font-medium shrink-0">이메일:</label>
          {editMode ? (
            <div className="relative w-full max-w-md">
              <input
                type="email"
                className="border rounded w-full h-8 pl-3 pr-24"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setEmailChecked(false);
                }}
              />
              <button
                onClick={handleEmailCheck}
                className="absolute top-0 right-0 h-8 px-3 bg-blue-500 border-l border-gray-300 rounded-r text-sm"
              >
                중복 확인
              </button>
            </div>
          ) : (
            <span>{userInfo.email}</span>
          )}
        </div>

        {editMode ? (
          <div className="flex gap-2 shrink-0">
            <button onClick={handleSave} className="border px-3 h-8 text-sm rounded">완료</button>
            <button onClick={() => setEditMode(false)} className="border px-3 h-8 text-sm rounded">취소</button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)} className="border px-3 h-8 text-sm rounded shrink-0">수정</button>
        )}
      </div>

      {/* 우편번호 */}
      <div className="flex items-center gap-2 mt-4">
        <label className="w-28 font-medium shrink-0">우편번호:</label>
        {editMode ? (
          <div className="relative w-full max-w-md">
            <input
              className="border rounded w-full h-8 pl-3 pr-32"
              value={form.postcode}
              readOnly
            />
            <button
              onClick={handlePostcodeSearch}
              className="absolute top-0 right-0 h-8 px-3 bg-gray-700 text-white text-sm border-l rounded-r"
            >
              우편번호 검색
            </button>
          </div>
        ) : (
          <span>{userInfo.postcode || '-'}</span>
        )}
      </div>

      {/* 주소 */}
      <div className="flex items-center gap-2 mt-4">
        <label className="w-28 font-medium shrink-0">주소:</label>
        {editMode ? (
          <input
            className="border rounded w-full max-w-md h-8 pl-3"
            value={form.address}
            readOnly
          />
        ) : (
          <span>{userInfo.address || '-'}</span>
        )}
      </div>

      {/* 상세주소 */}
      <div className="flex items-center gap-2 mt-4">
        <label className="w-28 font-medium shrink-0">상세주소:</label>
        {editMode ? (
          <input
            className="border rounded w-full max-w-md h-8 pl-3"
            value={form.addressDetail}
            onChange={(e) => setForm({ ...form, addressDetail: e.target.value })}
          />
        ) : (
          <span>{userInfo.addressDetail || '-'}</span>
        )}
      </div>

      {/* 마케팅 동의 */}
      <div className="flex items-center gap-2 mt-4">
        <label className="w-28 font-medium shrink-0">마케팅 동의:</label>
        {editMode ? (
          <div className="flex gap-4">
            <label><input type="radio" name="marketing" checked={form.marketing} onChange={() => setForm({ ...form, marketing: true })} /> 동의</label>
            <label><input type="radio" name="marketing" checked={!form.marketing} onChange={() => setForm({ ...form, marketing: false })} /> 비동의</label>
            <button onClick={() => setShowTerms(true)} className="text-sm underline">약관 보기</button>
          </div>
        ) : <span>{userInfo.marketing ? '동의' : '비동의'}</span>}
      </div>

      {/* 수평선 */}
      <hr className="border-gray-300" />

      {/* 비밀번호 변경 */}
      <div className="flex items-start gap-2 mt-4">
        <label className="w-28 font-medium shrink-0 pt-2">비밀번호:</label>
        <div className="flex flex-col gap-2 w-full max-w-md">
          {!showPasswordFields ? (
            <button onClick={handlePasswordChange} className="border px-3 py-1 text-sm rounded w-fit mt-1">비밀번호 변경</button>
          ) : (
            <>
              <input className="border px-3 py-1.5 rounded" type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <input className="border px-3 py-1.5 rounded" type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={handlePasswordSubmit} className="border px-3 py-1.5 rounded bg-blue-500 text-white w-fit text-sm">변경 완료</button>
                <button onClick={() => { setShowPasswordFields(false); setNewPassword(''); setConfirmPassword(''); }} className="border px-3 py-1.5 rounded text-sm w-fit">취소</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 간편 로그인 */}
      <div className="flex items-center gap-2 mt-4">
        <label className="w-28 font-medium shrink-0">간편 로그인:</label>
        <span>{userInfo.sns === 'KAKAO' ? '카카오 연동 중' : userInfo.sns === 'GOOGLE' ? '구글 연동 중' : '소셜 계정이 아닙니다'}</span>
      </div>

      {/* 계정 삭제 */}
      <div>
        <button
          className="text-sm text-red-600 underline mt-4"
          onClick={async () => {
            const confirmed = window.confirm('정말 계정을 삭제하시겠습니까?');
            if (!confirmed) return;

            try {
              await axios.delete('/user/me/delete');
              toast.success('계정이 삭제되었습니다.');
              // 예: 홈으로 이동하거나 로그아웃 처리
              window.location.href = '/';
            } catch {
              toast.error('계정 삭제에 실패했습니다.');
            }
          }}
        >
          계정 삭제
        </button>
      </div>

      {/* 약관 모달 */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">마케팅 수신 동의 약관</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              에듀디(Edudy)는 수강생에게 더 나은 교육 정보 및 혜택을 제공하기 위해 이메일, 문자 메시지를 통해 마케팅 정보를 전달할 수 있습니다.\n
              동의하지 않으셔도 서비스 이용에 제한은 없습니다.\n
              수신 동의는 언제든지 마이페이지에서 철회하실 수 있습니다.
            </p>
            <div className="text-right mt-6">
              <button className="text-sm text-blue-500" onClick={() => setShowTerms(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}