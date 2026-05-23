# Edudy — 교육 기관 ERP 시스템 (프론트엔드)

React + Vite 기반의 교육 기관 관리 시스템 프론트엔드입니다.
관리자 대시보드, 강의 관리, 출결 관리, 수강생 포털 등 ERP 전반의 UI를 제공합니다.

---

## 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [주요 기능](#주요-기능)
3. [기술 스택](#기술-스택)
4. [실행 방법](#실행-방법)
5. [Vercel 배포](#vercel-배포)
6. [환경 변수](#환경-변수)

---

## 프로젝트 소개

| 항목 | 내용 |
|------|------|
| 프로젝트 유형 | 팀 프로젝트 (포트폴리오) |
| 개발 기간 | 2024.11 ~ 2024.12 |
| 백엔드 | [edudy](https://github.com/leewj12/edudy) (Spring Boot, EC2 배포) |
| 배포 주소 | Vercel |

---

## 주요 기능

### 비회원
- 홈 / 강의 목록 / 강의 상세 조회
- 회원가입 / 로그인

### 수강생
- 마이페이지 (출결, 성적, 설문)
- QR 코드 출석 체크

### 관리자
- 대시보드 (출석률 차트, 수강 현황, 상담 키워드 태그, 일정 캘린더)
- 강의 등록 / 수정 / 삭제
- 수강생 / 강사 목록 관리
- 출결 관리 및 설정
- 상담 기록 관리
- 성적 / 설문 관리
- 배너 / 공지사항 / SMS 관리
- 교육 과정 및 시간표 관리

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Language | JavaScript (ES Module) |
| Framework | React 19, Vite 6 |
| Styling | Tailwind CSS 4, CSS Modules |
| Routing | React Router 7 |
| HTTP | Axios (JWT 인터셉터) |
| Auth | JWT (jwt-decode), Context API |
| Charts | Chart.js, react-chartjs-2 |
| Calendar | FullCalendar |
| QR | html5-qrcode |
| Excel | xlsx, file-saver |
| Deploy | Vercel |

---

## 실행 방법

### 사전 요구사항

- Node.js 20+
- 백엔드 API 서버 실행 중 (`http://localhost:8083`)

### 1. 의존성 설치

```bash
npm install
```

### 2. 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## Vercel 배포

### 1. Vercel 프로젝트 연결

1. [vercel.com](https://vercel.com)에서 GitHub 레포 `leewj12/edudy-front` 연결
2. Framework Preset: **Vite** 선택
3. Build Command: `npm run build`
4. Output Directory: `dist`

### 2. 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에서 추가:

| 변수명 | 값 |
|--------|-----|
| `VITE_API_BASE_URL` | `https://edudy.wonjae.cloud/api` |

### 3. SPA 라우팅

`vercel.json`에 SPA rewrite 설정이 포함되어 있어 새로고침 시 404가 발생하지 않습니다.

---

## 환경 변수

| 파일 | 변수명 | 설명 |
|------|--------|------|
| `.env` | `VITE_API_BASE_URL` | 로컬 개발용 API URL (`http://localhost:8083/api`) |
| `.env.production` | `VITE_API_BASE_URL` | 배포용 API URL (`https://edudy.wonjae.cloud/api`) |
