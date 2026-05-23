//전역 상태 관리 컨텍스트
import React, { createContext, useContext, useState , useEffect } from "react";
import { setAccessToken as setMemoryToken, getAccessToken } from "../api/tokenUtil";
import { jwtDecode } from "jwt-decode";
import axios from "../api/axiosInstance";

// 컨텍스트 생성
const AuthContext = createContext();

// 컨텍스트 제공자 컴포넌트

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null); 
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const isLoggedIn = !!accessToken;

  // accessToken을 상태 + 메모리에 저장
  const setAccessToken = (token) => {
    setAccessTokenState(token);
    setMemoryToken(token);
    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role); //토큰에서 role 추출
      setUserInfo(decoded); // 전체 정보 저장
    } catch (err) {
      setUserRole(null);
      setUserInfo(null);
    }
  };
  //새로고침시에 로그아웃 방지 쿠키에 리프레시 토큰이 있는지 확인을 함 "reissue를 통해 다시 정보 갱신 "
  useEffect(() => {
    const reissueIfTokenExists = async () => {
      try {
        const res = await axios.get("/reissue", { withCredentials: true });
        //console.log("재발급 성공:", res.data);
        const newToken = res.data.accessToken;
        setAccessToken(newToken); //갱신된 토큰 저장
      } catch (err) {
        setAccessToken(null);
      }
    };

    reissueIfTokenExists();
  }, []);


  return (
   <AuthContext.Provider value={{ accessToken, setAccessToken, isLoggedIn, userRole , userInfo  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);