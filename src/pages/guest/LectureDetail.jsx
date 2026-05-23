// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import useAxios from "../../api/useAxios";
// import dayjs from "dayjs";
// import UserLayout from "../../component/UserLayout";
// import { ChevronUp } from "lucide-react";
// import AskModal from "../../component/AskModal";

// const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

// export default function LectureDetail() {
//   const { lectureId } = useParams();
//   const { data } = useAxios(`/guest/lecture/${lectureId}`);
//   const [activeTab, setActiveTab] = useState("intro");
//   const [ignoreScroll, setIgnoreScroll] = useState(false);
//   const [showAskModal, setShowAskModal] = useState(false);

//   const introRef = useRef(null);
//   const curriculumRef = useRef(null);
//   const reviewRef = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (ignoreScroll) return;
//       const scrollY = window.scrollY;
//       const offsets = {
//         intro: introRef.current?.offsetTop || 0,
//         curriculum: curriculumRef.current?.offsetTop || 0,
//         review: reviewRef.current?.offsetTop || 0,
//       };
//       if (scrollY >= offsets.review - 130) setActiveTab("review");
//       else if (scrollY >= offsets.curriculum - 130) setActiveTab("curriculum");
//       else setActiveTab("intro");
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [ignoreScroll]);

//   const scrollTo = (ref, tabKey) => {
//     if (ref.current) {
//       setIgnoreScroll(true);
//       setActiveTab(tabKey);
//       window.scrollTo({ top: ref.current.offsetTop - 170, behavior: "smooth" });
//       setTimeout(() => setIgnoreScroll(false), 1000);
//     }
//   };

//   const renderStars = (rating = 0) => {
//     const stars = [];
//     const full = Math.floor(rating);
//     const half = rating - full >= 0.5;
//     for (let i = 0; i < full; i++) stars.push(<img key={`full-${i}`} src="/1star.png" alt="별" className="w-5 h-5 inline-block" />);
//     if (half) stars.push(<img key="half" src="/21star.png" alt="반 별" className="w-5 h-5 inline-block" />);
//     for (let i = stars.length; i < 5; i++) stars.push(<img key={`empty-${i}`} src="/0star.png" alt="빈 별" className="w-5 h-5 inline-block" />);
//     return stars;
//   };

//   if (!data) return <UserLayout>Loading...</UserLayout>;

//   // ✅ 안전한 필드 접근
//   const title = data.lectureTitle || "제목 없음";
//   const category = data.lectureCategoryName || "카테고리 없음";
//   const description = data.lectureDescription || "설명이 없습니다.";
//   const startDate = data.lectureStart || "-";
//   const endDate = data.lectureEnd || "-";
//   const thumbnail = data.lectureThumbnail || "/no21.png";
//   const introImage = data.lectureContentImage || "/no11.png";
//   // const curriculum = data.lectureCurriculum || [];
//   const curriculum = data.subjects?.map(s => s.subjectTitle) || [];
//   const reviews = data.lectureReviews || [];
//   const rating = data.lectureScore ?? 0;
//   const dDay = dayjs(startDate).diff(dayjs(), "day");

//   return (
//     <UserLayout>
//       <div className="pt-10">
//         {/* 강의 상단 정보 */}
//         <div className="px-[128px]">
//           <div className="flex justify-between mb-3">
//             <div>
//               <p className="text-sm text-gray-500">{category}</p>
//               <h2 className="text-2xl font-bold mt-1">{title}</h2>
//               <p className="text-m mt-1 text-gray-600">{description}</p>
//               <div className="mt-2 text-gray-600 text-sm font-bold">{renderStars(rating)} [{rating}]</div>
//               <br />
//               <p className="text-m mt-1 text-gray-600">강의 기간: {startDate} ~ {endDate}</p>
//               <div className="mt-2 text-gray-600 text-m">비용: 훈련비 전액 지원</div>
//             </div>
//             <img src={thumbnail} alt="썸네일" className="h-[205px] object-cover"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = "/no21.png";
//               }} />
//           </div>
//         </div>

//         {/* 탭바 */}
//         <div className="sticky top-[120px] z-40 bg-white border-y border-gray-200 w-full">
//           <div className="flex gap-10 font-semibold text-sm px-[128px]">
//             <button onClick={() => scrollTo(introRef, "intro")}
//               className={`py-3 ${activeTab === "intro" ? "text-[#00C59E] border-b-2 border-[#00C59E]" : "text-gray-700"}`}>강의 소개</button>
//             <button onClick={() => scrollTo(curriculumRef, "curriculum")}
//               className={`py-3 ${activeTab === "curriculum" ? "text-[#00C59E] border-b-2 border-[#00C59E]" : "text-gray-700"}`}>과목</button>
//             <button onClick={() => scrollTo(reviewRef, "review")}
//               className={`py-3 ${activeTab === "review" ? "text-[#00C59E] border-b-2 border-[#00C59E]" : "text-gray-700"}`}>수강평({reviews.length})</button>
//           </div>
//         </div>

//         {/* 강의 소개 */}
//         <div ref={introRef} className="pt-0 px-[128px]">
//           <img src={introImage} alt="강의소개" className="w-full mb-10"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = "/no21.png";
//             }} />
//         </div>

//         {/* 과목 */}
//         <div ref={curriculumRef} className="mb-10 px-[128px]">
//           <h3 className="text-xl font-bold mb-4">과목</h3>
//           <table className="w-full border border-gray-300">
//             <tbody>
//               {curriculum.length > 0 ? (
//                 curriculum.map((item, idx) => (
//                   <tr key={idx} className="border-t border-gray-300">
//                     <td className="p-3">{item}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr><td className="p-3 text-sm text-gray-500">과목 정보가 없습니다.</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* 수강평 */}
//         <div ref={reviewRef} className="px-[128px]">
//           <h3 className="text-xl font-bold mb-4">수강평({reviews.length})</h3>
//           {reviews.length > 0 ? (
//             reviews.map((r, idx) => (
//               <div key={idx} className="mb-4 border rounded border-gray-300 p-4">
//                 <p className="text-sm font-semibold">{r.email}</p>
//                 <p className="text-sm mt-1 text-gray-700">{r.comment}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-500">아직 수강평이 없습니다.</p>
//           )}
//         </div>
//       </div>

//       {/* 수강 신청 버튼 */}
//       <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
//         <button onClick={() => setShowAskModal(true)}
//         className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full shadow-lg text-sm cursor-pointer">
//           <span className="text-red-400 font-bold">마감까지 D-{dDay}</span>
//           <span className="font-semibold">수강 신청하기</span>    
//         </button>
        
//       </div>
//       {showAskModal && <AskModal onClose={() => setShowAskModal(false)} />}

//       {/* 맨 위로 버튼 위치 조정*/} 
//       <button
//         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//         className="fixed bottom-5 right-4 w-10 h-10 rounded-full bg-white shadow border border-gray-300 flex items-center justify-center"
//       >
//         <ChevronUp className="w-5 h-5" />
//       </button>
//     </UserLayout>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../api/useAxios";
import dayjs from "dayjs";
import UserLayout from "../../component/UserLayout";
import { ChevronUp } from "lucide-react";
import AskModal from "../../component/AskModal";

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

export default function LectureDetail() {
  const { lectureId } = useParams();
  const { data } = useAxios(`/guest/lecture/${lectureId}`);
  const [activeTab, setActiveTab] = useState("intro");
  const [ignoreScroll, setIgnoreScroll] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);

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

  const title = data.lectureTitle || "제목 없음";
  const category = data.lectureCategoryName || "카테고리 없음";
  const description = data.lectureDescription || "설명이 없습니다.";
  const startDate = data.lectureStart || "-";
  const endDate = data.lectureEnd || "-";
  const thumbnail = data.lectureThumbnail
    ? `${imageBaseUrl}/upload/lecture/thumbnail/${data.lectureThumbnail}`
    : "/no21.png";
  const introImage = data.lectureContentImage
    ? `${imageBaseUrl}/upload/lecture/content/${data.lectureContentImage}`
    : "/no11.png";
  const curriculum = data.subjects?.map((s) => s.subjectTitle) || [];
  const reviews = data.lectureReviews || [];
  const rating = data.lectureScore ?? 0;
  const dDay = dayjs(startDate).diff(dayjs(), "day");

  return (
    <UserLayout>
      <div className="pt-6 md:pt-10">
        <div className="px-4 md:px-[128px]">
          <div className="flex flex-col md:flex-row md:justify-between mb-3 gap-6">
            <div className="flex-1">
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{category}</span>
              <h2 className="text-xl md:text-2xl font-bold mt-3">{title}</h2>
              <p className="text-sm md:text-base mt-2 text-gray-600 leading-relaxed">{description}</p>
              <div className="mt-3 text-gray-600 text-sm font-bold">{renderStars(rating)} [{rating}]</div>
              <div className="mt-4 space-y-1.5">
                <p className="text-sm md:text-base text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400">기간</span> {startDate} ~ {endDate}
                </p>
                <p className="text-sm md:text-base text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400">비용</span>
                  <span className="text-[#00C59E] font-semibold">훈련비 전액 지원</span>
                </p>
              </div>
            </div>
            <img src={thumbnail} alt="썸네일" className="w-full md:w-auto h-[12rem] md:h-[220px] object-cover rounded-xl shadow-sm" onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/no21.png";
            }} />
          </div>
        </div>

        <div className="sticky top-[60px] md:top-[120px] z-40 bg-white border-y border-gray-200 w-full">
          <div className="flex gap-6 md:gap-10 font-semibold text-sm px-4 md:px-[128px]">
            <button onClick={() => scrollTo(introRef, "intro")}
              className={`py-3 ${activeTab === "intro" ? "text-[#00C59E] border-b-2 border-[#00C59E]" : "text-gray-700"}`}>강의 소개</button>
            <button onClick={() => scrollTo(curriculumRef, "curriculum")}
              className={`py-3 ${activeTab === "curriculum" ? "text-[#00C59E] border-b-2 border-[#00C59E]" : "text-gray-700"}`}>과목</button>
            <button onClick={() => scrollTo(reviewRef, "review")}
              className={`py-3 ${activeTab === "review" ? "text-[#00C59E] border-b-2 border-[#00C59E]" : "text-gray-700"}`}>수강평({reviews.length})</button>
          </div>
        </div>

        <div ref={introRef} className="pt-0 px-4 md:px-[128px]">
          <img src={introImage} alt="강의소개" className="w-full mb-10" onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/no21.png";
          }} />
        </div>

        <div ref={curriculumRef} className="mb-10 px-4 md:px-[128px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#00C59E] rounded-full"></div>
            <h3 className="text-xl font-bold">과목</h3>
          </div>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            {curriculum.length > 0 ? (
              curriculum.map((item, idx) => (
                <div key={idx} className={`flex items-center gap-3 px-5 py-3.5 ${idx > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                  <span className="text-[#00C59E] font-bold text-sm">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))
            ) : (
              <div className="px-5 py-4 text-sm text-gray-400">과목 정보가 없습니다.</div>
            )}
          </div>
        </div>

        <div ref={reviewRef} className="px-4 md:px-[128px] pb-32">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#00C59E] rounded-full"></div>
            <h3 className="text-xl font-bold">수강평 ({reviews.length})</h3>
          </div>
          {reviews.length > 0 ? (
            reviews.map((r, idx) => (
              <div key={idx} className="mb-3 rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                <p className="text-sm font-semibold text-gray-800">{r.email}</p>
                <p className="text-sm mt-1.5 text-gray-600 leading-relaxed">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">아직 수강평이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <button onClick={() => setShowAskModal(true)} className="flex items-center gap-3 bg-[#192a48] hover:bg-[#00C59E] text-white px-5 md:px-8 py-3.5 rounded-full shadow-xl text-sm cursor-pointer transition-colors duration-300">
          <span className="text-red-300 font-bold">D-{dDay}</span>
          <span className="w-px h-4 bg-white/30"></span>
          <span className="font-semibold">수강 신청하기</span>
        </button>
      </div>
      {showAskModal && <AskModal onClose={() => setShowAskModal(false)} />}

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-5 right-4 w-10 h-10 rounded-full bg-white shadow border border-gray-300 flex items-center justify-center">
        <ChevronUp className="w-5 h-5" />
      </button>
    </UserLayout>
  );
}