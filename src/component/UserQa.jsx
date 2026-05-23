import { useState } from "react";

export default function UserQa() {
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const qaList = [
    {
      q: "수강신청을 하려면 회원가입이 필요한가요?",
      a: "아닙니다. 신청은 비회원 상태에서도 가능합니다. 단, 수강 확정 시 회원가입을 통해 마이페이지를 이용하실 수 있습니다.",
    },
    {
      q: "오프라인 국비지원 과정은 어떻게 신청하나요?",
      a: "홈페이지 상단 또는 메인 배너에서 희망 과정을 선택한 후 신청서를 작성해 제출해 주세요. 신청 확인은 개별 연락 또는 문자로 안내됩니다.",
    },
    {
      q: "수강 확정 후에는 어떤 절차가 진행되나요?",
      a: "담당자의 안내에 따라 오리엔테이션 일정 안내, 회원가입, 마이페이지 개설, 출석체크 안내 등이 순차적으로 진행됩니다.",
    },
    {
      q: "수업 출석 및 진도율은 어디서 확인할 수 있나요?",
      a: "회원가입 후 로그인하시면, 마이페이지에서 출석 현황과 진도율을 실시간으로 확인하실 수 있습니다.",
    },
    {
      q: "상담 내역이나 문의한 내용은 따로 확인할 수 있나요?",
      a: "네. 마이페이지에서 상담 이력과 관리자 피드백을 확인하실 수 있도록 제공하고 있습니다.",
    },
    {
      q: "교육은 모두 오프라인으로 진행되나요?",
      a: "현재 모든 국비지원 과정은 오프라인 수업을 기본으로 하며, 일정에 따라 일부 온라인 콘텐츠가 제공될 수 있습니다.",
    },
  ];

  return (
    <>
      {/* 문의하기 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 bg-white border border-gray-300 px-4 py-2 rounded-full shadow text-[16px] font-bold flex items-center justify-center gap-2 h-13 w-33 z-40"
      >
        <img src="/qa.png" alt="문의하기" className="w-5 h-5" />
        문의하기
      </button>

      {/* 모달 */}
      {open && (
        <div className="fixed top-6 right-6 bg-white border border-gray-300 shadow-lg rounded-xl w-80 p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg">문의하기</h2>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          <p className="text-sm text-gray-500 mb-2">무엇을 도와드릴까요?</p>

          <ul className="space-y-2">
            {qaList.map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => setSelectedIdx(i)}
                  className="text-left text-sm text-blue-600 hover:underline"
                >
                  ❓ {item.q}
                </button>
                {selectedIdx === i && (
                  <p className="mt-1 text-sm text-gray-700 pl-4">💬 {item.a}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}