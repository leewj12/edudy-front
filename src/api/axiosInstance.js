import axios from 'axios'
import { getAccessToken,setAccessToken } from './tokenUtil';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env 설정에서 불러옴
  withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터: 요청에 access token 자동 추가
instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 → 토큰 재발급 시도
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 무한 재시도 방지
    if ( error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/reissue') // reissue 자체는 제외
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/reissue`,
          { withCredentials: true }
        );
        const newToken = res.data.accessToken;
        setAccessToken(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return instance(originalRequest);
        
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
        window.location.href = '/login'; // 실패 시 로그인 페이지로
      }
    }
    return Promise.reject(error);
  }
);

export default instance;