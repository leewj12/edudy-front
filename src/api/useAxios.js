import { useEffect, useState } from 'react';
import axios from 'axios';

const axiosNoAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 쿠키 사용 (백에서 필요 시)
});

export default function useAxios(url, options = {}) {
  const {
    method = 'get',
    data: bodyData = null,
    manual = false,
    ...config
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!manual);
  const [error, setError] = useState(null);

  const fetchData = async (overrideConfig = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosNoAuth.request({
        url,
        method,
        data: bodyData,
        ...config,
        ...overrideConfig,
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!manual) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}