import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, allowedRoles }) {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const alreadyRedirected = useRef(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    alreadyRedirected.current = false;
    setChecked(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!userRole) return;

    if (!allowedRoles.includes(userRole)) {
      if (!alreadyRedirected.current) {
        alreadyRedirected.current = true;
        alert('권한이 없습니다.');
        navigate(-1);
      }
    } else {
      setChecked(true);
    }
  }, [userRole, allowedRoles, navigate]);

  if (!userRole || !checked) return null;

  return children;
}
