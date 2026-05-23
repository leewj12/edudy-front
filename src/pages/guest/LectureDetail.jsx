// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import dayjs from "dayjs";
// import UserLayout from "../../component/UserLayout";

// export default function LectureDetail() {
//   const [data, setData] = useState(null);
//   const [activeTab, setActiveTab] = useState("intro");
//   const [ignoreScroll, setIgnoreScroll] = useState(false); // 🔹 스크롤 무시 상태 추가

//   const introRef = useRef(null);
//   const curriculumRef = useRef(null);
//   const reviewRef = useRef(null);
//   const tabRef = useRef(null);

//   useEffect(() => {
//     axios.get("/api/lectureDetail").then(() => {
//       setData({
//         title: "빅데이터 분석 개발자 과정",
//         category: "실무 프로젝트 과정",
//         description: "각 과정에 대한 설명이 들어갈 위치 한 줄 이내로 간단한 요약 설명",
//         rating: 3.7,
//         startDate: "2025-06-22",
//         endDate: "2025-12-12",
//         thumbnail: "/images/item3.png",
//         introImage: "/images/curriculum.png",
//         curriculum: [
//           "데이터 수집 및 전처리",
//           "통계 기초와 분석 방법론",
//           "SQL과 데이터베이스",
//           "머신러닝 기초",
//           "프로젝트 실습",
//         ],
//         reviews: [
//           { email: "user1@example.com", comment: "정말 유익했어요!" },
//           { email: "user2@example.com", comment: "실무에 많은 도움이 되었습니다." },
//           { email: "user3@example.com", comment: "조금 더 실습이 많았으면 좋겠어요." },
//           { email: "user3@example.com", comment: "조금 더 실습이 많았으면 좋겠어요." },
//           { email: "user3@example.com", comment: "조금 더 실습이 많았으면 좋겠어요." },
//           { email: "user3@example.com", comment: "조금 더 실습이 많았으면 좋겠어요." },
//         ],
//       });
//     });
//   }, []);

//   // 🔸 탭 클릭 시 실행
//   const scrollTo = (ref, tabKey) => {
//     if (ref.current) {
//       const top = ref.current.offsetTop - 170;
//       setIgnoreScroll(true);        // 🔹 스크롤 반응 잠시 OFF
//       setActiveTab(tabKey);         // 🔹 강제 탭 설정
//       window.scrollTo({ top, behavior: "smooth" });

//       // 🔹 1초 뒤에 스크롤 반응 다시 켜기
//       setTimeout(() => setIgnoreScroll(false), 1000);
//     }
//   };

//   // 🔸 스크롤 시 자동 탭 변경
//   useEffect(() => {
//     const handleScroll = () => {
//       if (ignoreScroll) return;

//       const scrollY = window.scrollY;
//       const offsets = {
//         intro: introRef.current?.offsetTop || 0,
//         curriculum: curriculumRef.current?.offsetTop || 0,
//         review: reviewRef.current?.offsetTop || 0,
//       };

//       if (scrollY >= offsets.review - 130) {
//         setActiveTab("review");
//       } else if (scrollY >= offsets.curriculum - 130) {
//         setActiveTab("curriculum");
//       } else {
//         setActiveTab("intro");
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [ignoreScroll]); // 🔹 의존성에 추가

//   // 별점 렌더링 함수 등등 ↓ 기존 그대로 이어서

//   const renderStars = (rating) => {
//     const stars = [];
//     const full = Math.floor(rating);
//     const half = rating - full >= 0.5;
  
//     for (let i = 0; i < full; i++) {
//       stars.push(
//         <img key={`full-${i}`} src="/1star.png" alt="별" className="w-5 h-5 inline-block" />
//       );
//     }
  
//     if (half) {
//       stars.push(
//         <img key="half" src="/21star.png" alt="반 별" className="w-5 h-5 inline-block" />
//       );
//     }
  
//     for (let i = stars.length; i < 5; i++) {
//       stars.push(
//         <img key={`empty-${i}`} src="/0star.png" alt="빈 별" className="w-5 h-5 inline-block" />
//       );
//     }
  
//     return stars;
//   };

//   if (!data) return <UserLayout>Loading...</UserLayout>;

//   const dDay = dayjs(data.startDate).diff(dayjs(), "day");

//   return (
//     <UserLayout>
//       {/* 전체를 감싸는 div에서는 padding 제거 */}
//       <div className="pt-10">
//         {/* 강의 상단 정보 */}
//         <div className="px-[128px]">
//           <div className="flex justify-between mb-3">
//             <div>
//               <p className="text-sm text-gray-500">{data.category}</p>
//               <h2 className="text-2xl font-bold mt-1">{data.title}</h2>
//               <p className="text-m mt-1 text-gray-600">{data.description}</p>
//               <div className="mt-2 text-gray-600 text-sm font-bold">{renderStars(data.rating)} [{data.rating}]</div>
//               <br/>
//               <p className="text-m mt-1 text-gray-600">
//                 강의 기간: {data.startDate} ~ {data.endDate}
//               </p>
//               <div className="mt-2 text-gray-600 text-m">비용: 훈련비 전액 지원</div>
//             </div>
//             <img
//               src={data.thumbnail}
//               alt="썸네일"
//               className="h-[205px] object-cover"
//             />
//           </div>
//         </div>
  
//         {/* 탭바 */}
//         <div ref={tabRef} className="sticky top-[120px] z-40 bg-white border-y border-gray-200 w-full">
//           <div className="flex gap-10 font-semibold text-sm px-[128px]">
//             <button
//               onClick={() => scrollTo(introRef, "intro")}
//               className={`py-3 ${
//                 activeTab === "intro"
//                   ? "text-[#00C59E] border-b-2 border-[#00C59E]"
//                   : "text-gray-700"
//               }`}
//             >
//               강의 소개
//             </button>
//             <button
//               onClick={() => scrollTo(curriculumRef, "curriculum")}
//               className={`py-3 ${
//                 activeTab === "curriculum"
//                   ? "text-[#00C59E] border-b-2 border-[#00C59E]"
//                   : "text-gray-700"
//               }`}
//             >
//               과목
//             </button>
//             <button
//               onClick={() => scrollTo(reviewRef, "review")}
//               className={`py-3 ${
//                 activeTab === "review"
//                   ? "text-[#00C59E] border-b-2 border-[#00C59E]"
//                   : "text-gray-700"
//               }`}
//             >
//               수강평({data.reviews.length})
//             </button>
//           </div>
//         </div>
  
//         {/* 강의 소개 */}
//         <div ref={introRef} className="pt-0 px-[128px]">
//           <img src={data.introImage} alt="강의소개" className="w-full mb-10" />
//         </div>
  
//         {/* 과목 */}
//         <div ref={curriculumRef} className="mb-10 px-[128px]">
//           <h3 className="text-xl font-bold mb-4">과목</h3>
//           <table className="w-full border border-gray-300">
//             <tbody>
//               {data.curriculum.map((item, idx) => (
//                 <tr key={idx} className="border-t border-gray-300">
//                   <td className="p-3">{item}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
  
//         {/* 수강평 */}
//         <div ref={reviewRef} className="px-[128px]">
//           <h3 className="text-xl font-bold mb-4">수강평({data.reviews.length})</h3>
//           {data.reviews.map((r, idx) => (
//             <div key={idx} className="mb-4 border rounded border-gray-300 p-4">
//               <p className="text-sm font-semibold">{r.email}</p>
//               <p className="text-sm mt-1 text-gray-700">{r.comment}</p>
//             </div>
//           ))}
//         </div>
//       </div>
  
//       {/* 하단 중앙 수강신청 버튼 */}
//       <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
//         <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full shadow-lg text-sm">
//           <span className="text-red-400 font-bold">마감까지 D-{dDay}</span>
//           <span className="font-semibold">수강 신청하기</span>
//         </button>
//       </div>
  
//       {/* 최상단 이동 */}
//       <button
//         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//         className="fixed bottom-36 right-4 w-10 h-10 rounded-full bg-white shadow border border-gray-300 text-lg"
//       >
//         ▲
//       </button>
//     </UserLayout>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../api/useAxios";
import dayjs from "dayjs";
import UserLayout from "../../component/UserLayout";

export default function LectureDetail() {
  const { lectureId } = useParams();
  const { data } = useAxios(`/guest/lecture/${lectureId}`);
  const [activeTab, setActiveTab] = useState("intro");
  const [ignoreScroll, setIgnoreScroll] = useState(false);

  const introRef = useRef(null);
  const curriculumRef = useRef(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ignoreScroll) return;
      const scrollY = window.scrollY;
      const offsets = {
        intro: introRef.current?.offsetTop || 0,
        curriculum: curriculumRef.current?.offsetTop || 0,
        review: reviewRef.current?.offsetTop || 0,
      };
      if (scrollY >= offsets.review - 130) setActiveTab("review");
      else if (scrollY >= offsets.curriculum - 130) setActiveTab("curriculum");
      else setActiveTab("intro");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ignoreScroll]);

  const scrollTo = (ref, tabKey) => {
    if (ref.current) {
      setIgnoreScroll(true);
      setActiveTab(tabKey);
      window.scrollTo({ top: ref.current.offsetTop - 170, behavior: "smooth" });
      setTimeout(() => setIgnoreScroll(false), 1000);
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<img key={`full-${i}`} src="/1star.png" alt="별" className="w-5 h-5 inline-block" />);
    if (half) stars.push(<img key="half" src="/21star.png" alt="반 별" className="w-5 h-5 inline-block" />);
    for (let i = stars.length; i < 5; i++) stars.push(<img key={`empty-${i}`} src="/0star.png" alt="빈 별" className="w-5 h-5 inline-block" />);
    return stars;
  };

  if (!data) return <UserLayout>Loading...</UserLayout>;

  // ✅ 안전한 필드 접근
  const title = data.lectureTitle || "제목 없음";
  const category = data.lectureCategoryName || "카테고리 없음";
  const description = data.lectureDescription || "설명이 없습니다.";
  const startDate = data.lectureStart || "-";
  const endDate = data.lectureEnd || "-";
  const thumbnail = data.lectureThumbnail || "/no21.png";
  const introImage = data.lectureContentImage || "/no11.png";
  const curriculum = data.lectureCurriculum || [];
  const reviews = data.lectureReviews || [];
  const rating = data.lectureScore ?? 0;
  const dDay = dayjs(startDate).diff(dayjs(), "day");

  return (
    <UserLayout>
      <div className="pt-10">
        {/* 강의 상단 정보 */}
        <div className="px-[128px]">
          <div className="flex justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">{category}</p>
              <h2 className="text-2xl font-bold mt-1">{title}</h2>
              <p className="text-m mt-1 text-gray-600">{description}</p>
              <div className="mt-2 text-gray-600 text-sm font-bold">{renderStars(rating)} [{rating}]</div>
              <br />
              <p className="text-m mt-1 text-gray-600">강의 기간: {startDate} ~ {endDate}</p>
              <div className="mt-2 text-gray-600 text-m">비용: 훈련비 전액 지원</div>
            </div>
            <img src={thumbnail} alt="썸네일" className="h-[205px] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/no21.png";
              }} />
          </div>
        </div>

        {/* 탭바 */}
        <div className="sticky top-[120px] z-40 bg-white border-y border-gray-200 w-full">
          <div className="flex gap-10 font-semibold text-sm px-[128px]">
            <button onClick={() => scrollTo(introRef, "intro")}
              className={`py-3 ${activeTab === "intro" ? "text-[#00C59E] border-b-2 border-[#00C59E]" : "text-gray-700"}`}>강의 소개</button>
            <button onClick={() => scrollTo(curriculumRef, "curriculum")}
              className={`py-3 ${activeTab === "curriculum" ? "text-[#00C59E] border-b-2 border-[#00C59E]" : "text-gray-700"}`}>과목</button>
            <button onClick={() => scrollTo(reviewRef, "review")}
              className={`py-3 ${activeTab === "review" ? "text-[#00C59E] border-b-2 border-[#00C59E]" : "text-gray-700"}`}>수강평({reviews.length})</button>
          </div>
        </div>

        {/* 강의 소개 */}
        <div ref={introRef} className="pt-0 px-[128px]">
          <img src={introImage} alt="강의소개" className="w-full mb-10"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/no21.png";
            }} />
        </div>

        {/* 과목 */}
        <div ref={curriculumRef} className="mb-10 px-[128px]">
          <h3 className="text-xl font-bold mb-4">과목</h3>
          <table className="w-full border border-gray-300">
            <tbody>
              {curriculum.length > 0 ? (
                curriculum.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-300">
                    <td className="p-3">{item}</td>
                  </tr>
                ))
              ) : (
                <tr><td className="p-3 text-sm text-gray-500">과목 정보가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 수강평 */}
        <div ref={reviewRef} className="px-[128px]">
          <h3 className="text-xl font-bold mb-4">수강평({reviews.length})</h3>
          {reviews.length > 0 ? (
            reviews.map((r, idx) => (
              <div key={idx} className="mb-4 border rounded border-gray-300 p-4">
                <p className="text-sm font-semibold">{r.email}</p>
                <p className="text-sm mt-1 text-gray-700">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">아직 수강평이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 수강 신청 버튼 */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full shadow-lg text-sm">
          <span className="text-red-400 font-bold">마감까지 D-{dDay}</span>
          <span className="font-semibold">수강 신청하기</span>
        </button>
      </div>

      {/* 맨 위로 버튼 */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-36 right-4 w-10 h-10 rounded-full bg-white shadow border border-gray-300 text-lg">
        ▲
      </button>
    </UserLayout>
  );
}