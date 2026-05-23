import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css'; // 스타일 분리
import { PATH } from "../routes/path";

function Test() {
  
  const [lectureid, setLectureid] = useState("abc123");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📘 LMS 메인 페이지</h1>
      <div className={styles.buttonContainer}>
        <Link to="/login" className={styles.button}>로그인</Link>
        <Link to="/signup" className={styles.button}>회원가입</Link>
        <Link to="/dashboard" className={styles.button}>관리자 대시보드</Link>
        <Link to="/" className={styles.button}>홈</Link>
        <Link to={PATH.LectureDetail(lectureid)} >과정 상세 링크</Link>
      </div>
    </div>
  );
}

export default Test;