// import React, { useEffect, useState } from "react";
// import useAxios from "../../api/useAxios";
// import UserLayout from "../../component/UserLayout";
// import dayjs from "dayjs";
// import { Link, useSearchParams } from "react-router-dom";

// export default function LectureList() {
//   const [searchParams] = useSearchParams();
//   const keyword = searchParams.get("keyword")?.trim() || "";

//   const [category, setCategory] = useState({ lectureCategoryId: 0, lectureCategoryName: "전체" });
//   const [categoryList, setCategoryList] = useState([{ lectureCategoryId: 0, lectureCategoryName: "전체" }]);
//   const [sortOrder, setSortOrder] = useState("latest");

//   const today = dayjs().format("YYYY-MM-DD");

//   const getLectureUrl = () => {
//     return category.lectureCategoryId === 0
//       ? `/guest/lecture/list/${sortOrder}`
//       : `/guest/lecture/list/category/${category.lectureCategoryId}/${sortOrder}`;
//   };

//   const {
//     data: lectures,
//     loading,
//     refetch,
//   } = useAxios(getLectureUrl(), { manual: true });

//   const { data: categoryData } = useAxios("/guest/category/list");

//   // ✅ 카테고리 목록 불러오고 반영
//   useEffect(() => {
//     if (categoryData) {
//       const fullList = [{ lectureCategoryId: 0, lectureCategoryName: "전체" }, ...categoryData];
//       setCategoryList(fullList);
//     }
//   }, [categoryData]);

//   // ✅ 쿼리파라미터가 바뀔 때마다 category 상태 반영
//   useEffect(() => {
//     const paramId = Number(searchParams.get("categoryId")) || 0;
//     if (categoryList.length > 0) {
//       const matched = categoryList.find((cat) => cat.lectureCategoryId === paramId);
//       if (matched) setCategory(matched);
//     }
//   }, [searchParams, categoryList]);

//   // ✅ 카테고리나 정렬 변경 시 강의 다시 불러오기
//   useEffect(() => {
//     refetch();
//   }, [category, sortOrder]);

//   // ✅ 오늘 이후 강의만 필터, 검색어도 반영
//   const filteredLectures = lectures?.filter((l) => {
//     const isFuture = dayjs(l.lectureStart).isSame(today) || dayjs(l.lectureStart).isAfter(today);
//     if (keyword === "") return isFuture;
//     return isFuture && l.lectureTitle?.toLowerCase().includes(keyword.toLowerCase());
//   });

//   return (
//     <UserLayout>
//       <div className="w-full border-b border-gray-300 mb-6"></div>
//       <div className="px-[128px] pb-12">
//         {/* 🔹 카테고리 & 정렬 */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex gap-5 text-sm font-medium">
//             {categoryList.map((cat) => (
//               <button
//                 key={cat.lectureCategoryId}
//                 onClick={() => setCategory(cat)}
//                 className={`pb-1 ${
//                   category.lectureCategoryId === cat.lectureCategoryId
//                     ? "border-b-2 border-black text-black cursor-pointer"
//                     : "text-gray-500 cursor-pointer"
//                 }`}
//               >
//                 {cat.lectureCategoryName}
//               </button>
//             ))}
//           </div>
//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             className="border border-gray-300 px-2 py-1 text-sm rounded"
//           >
//             <option value="latest">최신순</option>
//             <option value="popular">인기순</option>
//           </select>
//         </div>

//         <div className="w-full border-b border-gray-300 mb-4"></div>

//         {/* 🔹 강의 카드 */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {filteredLectures?.map((lecture) => {
//             const thumbnail = lecture.lectureThumbnail || "/no21.png";
//             const title = lecture.lectureTitle || "제목 없음";
//             const start = lecture.lectureStart ? dayjs(lecture.lectureStart).format("YYYY.MM.DD") : "-";
//             const end = lecture.lectureEnd ? dayjs(lecture.lectureEnd).format("YYYY.MM.DD") : "-";
//             const score = lecture.lectureScore ?? 0;
//             const reviewCount = lecture.lectureReviewCount ?? 0;

//             return (
//               <Link
//                 to={`/lecture/${lecture.lectureId}`}
//                 key={lecture.lectureId}
//                 className="w-full border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition block"
//               >
//                 <img
//                   src={thumbnail}
//                   alt={title}
//                   className="w-full h-[16rem] object-cover"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "/no21.png";
//                   }}
//                 />
//                 <div className="h-[6rem] p-3 flex flex-col justify-between text-sm">
//                   <div className="font-semibold">{title}</div>
//                   <div className="flex items-center gap-3 text-xs mt-1">
//                     <div className="flex items-center">
//                       <img src="/1star.png" alt="별점" className="w-4 h-4 mr-1" />
//                       {score} ({reviewCount})
//                     </div>
//                     <div className="text-gray-500">전액 지원</div>
//                   </div>
//                   <div className="text-xs mt-1">기간: {start} ~ {end}</div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>

//         {loading && <div className="text-center mt-10">로딩 중...</div>}
//         {!loading && filteredLectures?.length === 0 && (
//           <div className="text-center mt-10 text-gray-500">해당 강의가 없습니다.</div>
//         )}
//       </div>
//     </UserLayout>
//   );
// }

import React, { useEffect, useState } from "react";
import useAxios from "../../api/useAxios";
import UserLayout from "../../component/UserLayout";
import dayjs from "dayjs";
import { Link, useSearchParams } from "react-router-dom";

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

export default function LectureList() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() || "";

  const [category, setCategory] = useState({ lectureCategoryId: 0, lectureCategoryName: "전체" });
  const [categoryList, setCategoryList] = useState([{ lectureCategoryId: 0, lectureCategoryName: "전체" }]);
  const [sortOrder, setSortOrder] = useState("latest");

  const today = dayjs().format("YYYY-MM-DD");

  const getLectureUrl = () => {
    return category.lectureCategoryId === 0
      ? `/guest/lecture/list/${sortOrder}`
      : `/guest/lecture/list/category/${category.lectureCategoryId}/${sortOrder}`;
  };

  const {
    data: lectures,
    loading,
    refetch,
  } = useAxios(getLectureUrl(), { manual: true });

  const { data: categoryData } = useAxios("/guest/category/list");

  useEffect(() => {
    if (categoryData) {
      const fullList = [{ lectureCategoryId: 0, lectureCategoryName: "전체" }, ...categoryData];
      setCategoryList(fullList);
    }
  }, [categoryData]);

  useEffect(() => {
    const paramId = Number(searchParams.get("categoryId")) || 0;
    if (categoryList.length > 0) {
      const matched = categoryList.find((cat) => cat.lectureCategoryId === paramId);
      if (matched) setCategory(matched);
    }
  }, [searchParams, categoryList]);

  useEffect(() => {
    refetch();
  }, [category, sortOrder]);

  const filteredLectures = lectures?.filter((l) => {
    const isFuture = dayjs(l.lectureStart).isSame(today) || dayjs(l.lectureStart).isAfter(today);
    if (keyword === "") return isFuture;
    return isFuture && l.lectureTitle?.toLowerCase().includes(keyword.toLowerCase());
  });

  return (
    <UserLayout>
      <div className="w-full border-b border-gray-300 mb-6"></div>
      <div className="px-4 md:px-[128px] pb-12">
        {/* 🔹 카테고리 & 정렬 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex flex-wrap gap-3 md:gap-5 text-sm font-medium">
            {categoryList.map((cat) => (
              <button
                key={cat.lectureCategoryId}
                onClick={() => setCategory(cat)}
                className={`pb-1 ${
                  category.lectureCategoryId === cat.lectureCategoryId
                    ? "border-b-2 border-black text-black cursor-pointer"
                    : "text-gray-500 cursor-pointer"
                }`}
              >
                {cat.lectureCategoryName}
              </button>
            ))}
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-sm rounded"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>
        </div>

        <div className="w-full border-b border-gray-300 mb-4"></div>

        {/* 🔹 강의 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredLectures?.map((lecture) => {
            const thumbnail = lecture.lectureThumbnail
              ? `${imageBaseUrl}/upload/lecture/thumbnail/${lecture.lectureThumbnail}`
              : "/no21.png";
            const title = lecture.lectureTitle || "제목 없음";
            const start = lecture.lectureStart ? dayjs(lecture.lectureStart).format("YYYY.MM.DD") : "-";
            const end = lecture.lectureEnd ? dayjs(lecture.lectureEnd).format("YYYY.MM.DD") : "-";
            const score = lecture.lectureScore ?? 0;
            const reviewCount = lecture.lectureReviewCount ?? 0;

            return (
              <Link
                to={`/lecture/${lecture.lectureId}`}
                key={lecture.lectureId}
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
          })}
        </div>

        {loading && <div className="text-center mt-10">로딩 중...</div>}
        {!loading && filteredLectures?.length === 0 && (
          <div className="text-center mt-10 text-gray-500">해당 강의가 없습니다.</div>
        )}
      </div>
    </UserLayout>
  );
}