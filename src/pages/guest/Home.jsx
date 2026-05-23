// import React, { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import UserLayout from "../../component/UserLayout";

// export default function Home() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [bannerImages, setBannerImages] = useState([]);
//   const [popularCourses, setPopularCourses] = useState([]);

//   const dummyBanners = ["/banners/aiB.png", "/banners/frontB.png", "/banners/fullB.png"];

//   const dummyCourses = [
//     {
//       id: 1,
//       title: "프론트엔드 입문",
//       startDate: "2025-07-01",
//       endDate: "2025-10-01",
//       image: "/thumbnails/aiT.png",
//     },
//     {
//       id: 2,
//       title: "백엔드 실전 프로젝트".repeat(10),
//       startDate: "2025-07-10",
//       endDate: "2025-12-10",
//       image: "/thumbnails/frontT.png",
//     },
//     {
//       id: 3,
//       title: "취업 보장 과정".repeat(5),
//       startDate: "2025-07-15",
//       endDate: "2026-01-15",
//       image: "/thumbnails/fullT.png",
//     },
//   ];

//   useEffect(() => {
//     setBannerImages(dummyBanners);
//     setPopularCourses(dummyCourses);
//   }, []);

//   useEffect(() => {
//     if (bannerImages.length === 0) return;
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [bannerImages]);

//   return (
//     <UserLayout>
//       {/* 슬라이더 영역 */}
//       <section className="w-full mt-1 relative">
//         {bannerImages.length > 0 && (
//           <>
//             <img
//               src={bannerImages[currentSlide]}
//               alt="메인 슬라이드"
//               className="w-full h-[30rem] object-cover"
//             />

//             {/* ◀ 이전 버튼 */}
//             <button
//               onClick={() =>
//                 setCurrentSlide(
//                   (prev) => (prev - 1 + bannerImages.length) % bannerImages.length
//                 )
//               }
//               className="absolute left-[128px] top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow transition"
//               aria-label="이전 배너"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>

//             {/* ▶ 다음 버튼 */}
//             <button
//               onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerImages.length)}
//               className="absolute right-[128px] top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow transition"
//               aria-label="다음 배너"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>

//             {/* 🔘 인디케이터 */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//               {bannerImages.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentSlide(index)}
//                   className={`w-3 h-3 rounded-full transition ${
//                     currentSlide === index
//                       ? "bg-white"
//                       : "bg-white/50 hover:bg-white/80"
//                   }`}
//                   aria-label={`배너 ${index + 1}번`}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </section>

//       {/* 인기 강의 섹션 */}
//       <section className="px-[128px] py-8 mt-3">
//         <h2 className="text-2xl font-semibold mb-4">수강신청 많은 강의</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {popularCourses.map((course) => {
//             const today = dayjs();
//             const start = dayjs(course.startDate);
//             const end = dayjs(course.endDate);
//             const daysUntilStart = start.diff(today, "day");
//             const months = end.diff(start, "month");

//             return (
//               <div key={course.id} className="relative h-[16rem] rounded-lg overflow-hidden shadow">
//                 <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
//                 <div className="absolute bottom-0 left-0 right-0 px-2 py-2 bg-gradient-to-t from-black/60 via-black/30 to-transparent text-white text-left">
//                   <p className="text-xs font-medium mb-1">
//                     개강일까지 {daysUntilStart}일 남음
//                   </p>
//                   <p
//                     className="text-sm font-bold leading-tight overflow-hidden text-ellipsis"
//                     style={{
//                       display: "-webkit-box",
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: "vertical",
//                     }}
//                   >
//                     [{months}개월 과정] {course.title}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </section>
//     </UserLayout>
//   );
// }

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import UserLayout from "../../component/UserLayout";
import useAxios from "../../api/useAxios";
import { Link } from "react-router-dom";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🧪 향후 GET /guest/banner/list 같은 API로 교체 예정
  const dummyBanners = ["/banners/aiB.png", "/banners/frontB.png", "/banners/fullB.png"];
  const [bannerImages, setBannerImages] = useState(dummyBanners);

  const {
    data: lectures,
    loading,
  } = useAxios("/guest/lecture/list/popular");

  const today = dayjs().format("YYYY-MM-DD");

  // 슬라이드 자동 전환
  useEffect(() => {
    if (bannerImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages]);

  // 오늘 이후 시작 강의만 필터링 + 상위 3개
  const filteredLectures = lectures
    ?.filter((l) => dayjs(l.lectureStart).isSame(today) || dayjs(l.lectureStart).isAfter(today))
    ?.slice(0, 3);

  return (
    <UserLayout>
      {/* 배너 영역 */}
      <section className="w-full mt-1 relative">
        {bannerImages.length > 0 && (
          <>
            <img
              src={bannerImages[currentSlide]}
              alt="메인 슬라이드"
              className="w-full h-[30rem] object-cover"
            />

            {/* ◀ 이전 버튼 */}
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
              }
              className="absolute left-[128px] top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow transition"
              aria-label="이전 배너"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* ▶ 다음 버튼 */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerImages.length)}
              className="absolute right-[128px] top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow transition"
              aria-label="다음 배너"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition ${
                    currentSlide === index
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`배너 ${index + 1}번`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 인기 강의 섹션 */}
      {/* <section className="px-[128px] py-8 mt-3">
        <h2 className="text-2xl font-semibold mb-4">수강신청 많은 강의</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!loading && filteredLectures?.length > 0 ? (
            filteredLectures.map((lecture) => {
              const thumbnail = lecture.lectureThumbnail || "/no21.png";
              const title = lecture.lectureTitle || "제목 없음";
              const start = lecture.lectureStart ? dayjs(lecture.lectureStart).format("YYYY.MM.DD") : "-";
              const end = lecture.lectureEnd ? dayjs(lecture.lectureEnd).format("YYYY.MM.DD") : "-";
              const score = lecture.lectureScore ?? 0;
              const reviewCount = lecture.lectureReviewCount ?? 0;

              return (
                <Link
                  key={lecture.lectureId}
                  to={`/lecture/${lecture.lectureId}`}
                  className="w-full border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition block"
                >
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-[16rem] object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/no21.png";
                    }}
                  />
                  <div className="h-[6rem] p-3 flex flex-col justify-between text-sm">
                    <div className="font-semibold">{title}</div>
                    <div className="flex items-center gap-3 text-xs mt-1">
                      <div className="flex items-center">
                        <img src="/1star.png" alt="별점" className="w-4 h-4 mr-1" />
                        {score} ({reviewCount})
                      </div>
                      <div className="text-gray-500">전액 지원</div>
                    </div>
                    <div className="text-xs mt-1">기간: {start} ~ {end}</div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-12">
              <img src="/no21.png" alt="추천 준비 중" className="mx-auto mb-4 w-28 h-28 opacity-70" />
              추천 강의를 준비 중입니다.
            </div>
          )}
        </div>
      </section> */}
      <section className="px-[128px] py-8 mt-3">
  <h2 className="text-2xl font-semibold mb-4">수강신청 많은 강의</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {!loading && filteredLectures?.length > 0 ? (
      filteredLectures.map((lecture) => {
        const thumbnail = lecture.lectureThumbnail || "/no21.png";
        const title = lecture.lectureTitle || "제목 없음";
        const start = lecture.lectureStart ? dayjs(lecture.lectureStart).format("YYYY.MM.DD") : "-";
        const end = lecture.lectureEnd ? dayjs(lecture.lectureEnd).format("YYYY.MM.DD") : "-";
        const score = lecture.lectureScore ?? 0;
        const reviewCount = lecture.lectureReviewCount ?? 0;

        return (
          <Link
            key={lecture.lectureId}
            to={`/lecture/${lecture.lectureId}`}
            className="w-full border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition block"
          >
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-[16rem] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/no21.png";
              }}
            />
            <div className="h-[6rem] p-3 flex flex-col justify-between text-sm">
              <div className="font-semibold">{title}</div>
              <div className="flex items-center gap-3 text-xs mt-1">
                <div className="flex items-center">
                  <img src="/1star.png" alt="별점" className="w-4 h-4 mr-1" />
                  {score} ({reviewCount})
                </div>
                <div className="text-gray-500">전액 지원</div>
              </div>
              <div className="text-xs mt-1">기간: {start} ~ {end}</div>
            </div>
          </Link>
        );
      })
    ) : (
      Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={`dummy-${idx}`}
          className="w-full border border-gray-300 rounded-lg overflow-hidden bg-gray-50 text-center flex flex-col"
        >
          <img
            src="/no21.png"
            alt="추천 준비 중"
            className="w-full h-[16rem] object-cover"
          />
          <div className="h-[6rem] p-3 flex flex-col justify-center items-center text-sm text-gray-500">
            <div className="text-lg font-semibold">추천 강의를 준비 중입니다.</div>
          </div>
        </div>
      ))
    )}
  </div>
</section>
    </UserLayout>
  );
}