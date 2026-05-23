import React from 'react'
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


function App() {
  return (
    // 전역에서 jwt 상태 제공
      <AuthProvider>
        <ToastContainer position="top-center" autoClose={2000} />
        <AppRouter />
      </AuthProvider>

  );
}

export default App;
