import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../css/CustomCalendar.css'; // 스타일 커스터마이징용

export default function CalendarSection() {
  const events = [
    
    { title: '모집시작', start: '2025-06-11', end: '2025-06-27', color: '#FF6BD3' },
    { title: '수료증 발급', start: '2025-06-24', end: '2025-06-24', color: '#00C59E' },
    { title: '만족도 조사 발송', start: '2025-06-26', end: '2025-06-26', color: '#6BBCFF' },

  ];

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        headerToolbar={{
          left: 'title prev,next today',
          center: '',
          right: ''
        }}
        //titleFormat={{ year: 'numeric', month: '2-digit', day: '2-digit' }} // → 2025.06.12 형식
        events={events}
        height={360}
        width = "300px"
        dayMaxEventRows={false}
        eventMaxStack={1}
        dayCellContent={(arg) => (
          <div className="fc-daygrid-day-number">
            {arg.date.getDate()}
          </div>
        )}
        eventContent={(arg) => (
          <div
            className="text-[8px] font-medium text-white truncate px-2 py-1 rounded"
            style={{ backgroundColor: arg.event.backgroundColor || '#4dafff' }}
          >
            {arg.event.title}
          </div>
        )}
      />
    </div>
  );
}
