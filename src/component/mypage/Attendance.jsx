import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from '../../api/axiosInstance';
import QRCodeModal from '../QRCodeModal';
import { useAuth } from '../../context/AuthContext';

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState({});
  const [holidays, setHolidays] = useState({});
  const [startDate, setStartDate] = useState(dayjs('2025-04-01'));
  const [endDate, setEndDate] = useState(dayjs('2025-07-15'));
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [todayStatus, setTodayStatus] = useState(null);
  const { userInfo } = useAuth();

  const [qrUrl, setQrUrl] = useState("");
  const [showQR, setShowQR] = useState(false);

  const fetchAttendanceData = async () => {
    try {
      const res = await axios.get(`/user/att/${userInfo?.partId}`);
      const formatted = {};
      res.data.forEach((item) => {
        const date = dayjs(item.attDate).format('YYYY-MM-DD');
        formatted[date] = {
          in: item.attEntry ? dayjs(item.attEntry).format('HH:mm') : '',
          out: item.attExit ? dayjs(item.attExit).format('HH:mm') : '',
          status: item.attStatus
        };
      });
      setAttendanceData(formatted);

      const todayStr = dayjs().format('YYYY-MM-DD');
      if (formatted[todayStr]) {
        setTodayStatus(formatted[todayStr].status);
      }
    } catch (err) {
      console.error('❌ 출석 조회 실패:', err);
    }
  };

    const fetchHolidays = async () => {
      try {
        const year = dayjs().year();
        const res = await axios.get(`/holidays?year=${year}`);
        const mapped = {};
        res.data.forEach(item => {
          const dateStr = dayjs(item.date).format('YYYY-MM-DD');
          mapped[dateStr] = item.name;
        });
        setHolidays(mapped);
      } catch (err) {
        console.error('❌ 공휴일 조회 실패:', err);
      }
    };

    const handleOpenQR = () => {
      setShowQR(true);
      const uuidToken = crypto.randomUUID();
      setQrUrl(`http://192.168.0.10:5173/qr/attend?token=${uuidToken}`);
  
      setTimeout(async () => {
        try {
          const now = dayjs().format('YYYY-MM-DDTHH:mm:ss');
          await axios.post('/user/att/entry', {
            lecturePartId: userInfo?.partId,
            time: now,
          });
          setTodayStatus('ENTRY');
          alert('출석 완료!');
          await fetchAttendanceData(); // ✅ 출석 갱신
        } catch (err) {
          console.error('출석 실패:', err);
          alert('출석 중 오류 발생');
        } finally {
          setShowQR(false);
        }
      }, 5000);
    };
  
    useEffect(() => {
      if (userInfo?.partId) {
        fetchAttendanceData();
        fetchHolidays();
      }
    }, [userInfo?.partId]);

  const handleCloseQR = () => {
    setShowQR(false);
    if (qrIntervalId) {
      clearInterval(qrIntervalId);
      setQrIntervalId(null);
    }
  };

  if (!startDate || !endDate) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">출석부</h2>
        <p className="text-gray-500">수강 중인 강의가 없습니다.</p>
      </div>
    );
  }

  const allowedMonths = [];
  let temp = startDate.startOf('month');
  while (temp.isBefore(endDate.endOf('month')) || temp.isSame(endDate, 'month')) {
    allowedMonths.push(temp.format('YYYY-MM'));
    temp = temp.add(1, 'month');
  }

  const isCurrentAllowed = allowedMonths.includes(currentMonth.format('YYYY-MM'));
  const canGoPrev = allowedMonths.includes(currentMonth.subtract(1, 'month').format('YYYY-MM'));
  const canGoNext = allowedMonths.includes(currentMonth.add(1, 'month').format('YYYY-MM'));

  const prevMonth = () => canGoPrev && setCurrentMonth(currentMonth.subtract(1, 'month'));
  const nextMonth = () => canGoNext && setCurrentMonth(currentMonth.add(1, 'month'));

  if (!isCurrentAllowed) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">출석부</h2>
        <p className="text-gray-500">수강 중인 강의가 없습니다.</p>
      </div>
    );
  }

  const monthStart = currentMonth.startOf('month').startOf('week');
  const monthEnd = currentMonth.endOf('month').endOf('week');
  const today = dayjs();

  const calendarDates = [];
  let day = monthStart;
  while (day.isBefore(monthEnd) || day.isSame(monthEnd)) {
    calendarDates.push(day);
    day = day.add(1, 'day');
  }

  // 버튼 클릭 핸들러
  const handleAction = async (actionType) => {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    try {
      if (actionType === 'entry') {
        await axios.post('/user/att/entry', { datetime: now });
        setTodayStatus('ENTRY');
      } else if (actionType === 'outingStart') {
        await axios.post(`/user/att/outing/start/${lectureAttId}`, { datetime: now });
        setTodayStatus('OUTING');
      } else if (actionType === 'outingEnd') {
        await axios.post(`/user/att/outing/end/${lectureAttId}`, { datetime: now });
        setTodayStatus('RETURNED');
      } else if (actionType === 'exit') {
        await axios.post(`/user/att/exit/${lectureAttId}`, { datetime: now });
        setTodayStatus('EXIT');
      }
    } catch (err) {
      console.error('에러 발생:', err);
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-120px)] px-4 flex flex-col">
      {/* 월 이동 + 버튼 */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} disabled={!canGoPrev} className={!canGoPrev ? 'opacity-30 cursor-not-allowed' : ''}>◀</button>
          <span className="text-lg font-bold">{currentMonth.format('YYYY.MM')}</span>
          <button onClick={nextMonth} disabled={!canGoNext} className={!canGoNext ? 'opacity-30 cursor-not-allowed' : ''}>▶</button>
        </div>
        {/* 오늘자 버튼 표시 */}
        <div className="flex gap-2">
          {!todayStatus && (
            <button onClick={handleOpenQR} className="bg-blue-500 text-white px-3 py-1 rounded">입실 (QR)</button>
          )}
          {todayStatus === 'ENTRY' && (
            <>
              <button onClick={() => handleAction('outingStart')} className="bg-gray-400 text-black px-3 py-1 rounded">외출</button>
              <button onClick={() => handleAction('exit')} className="bg-gray-500 text-white px-3 py-1 rounded">퇴실</button>
            </>
          )}
          {todayStatus === 'OUTING' && (
            <button onClick={() => handleAction('outingEnd')} className="bg-gray-500 text-white px-3 py-1 rounded">복귀</button>
          )}
          {todayStatus === 'RETURNED' && (
            <button onClick={() => handleAction('exit')} className="bg-red-500 text-white px-3 py-1 rounded">퇴실</button>
          )}
        </div>
        <QRCodeModal
          open={showQR}
          qrUrl={qrUrl}
          onClose={handleCloseQR}
        />
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-sm font-semibold bg-gray-100 border border-gray-200">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
          <div
            key={day}
            className={`px-2 h-12 flex items-center text-left border-r border-b border-gray-200 ${
              idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="grid grid-cols-7 border-l border-gray-200 text-sm">
        {calendarDates.map((date, idx) => {
          const dateStr = date.format('YYYY-MM-DD');
          const att = attendanceData?.[dateStr];
          const isHoliday = holidays?.[dateStr];
          const isTodayOrFuture = date.isAfter(today, 'day');

          const isSunday = date.day() === 0;
          const isSaturday = date.day() === 6;
          const dayColor = isHoliday
            ? 'text-red-500'
            : isSunday
            ? 'text-red-500'
            : isSaturday
            ? 'text-blue-500'
            : 'text-black';

          const renderStatus = () => {
            if (isHoliday) {
              return (
                <div className="mt-1 inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-600 border border-red-300">
                  {isHoliday}
                </div>
              );
            }
            if (isTodayOrFuture) return null;

            switch (att?.status) {
              case 'ENTRY':
              case 'EXIT':
                return (
                  <>
                    <div className={att?.in > '09:00' ? 'text-red-500' : ''}>입실 {att?.in}</div>
                    <div className={att?.out < '18:00' ? 'text-blue-500' : ''}>퇴실 {att?.out}</div>
                  </>
                );
              case 'ABSENT':
                return (
                  <div className="mt-1 inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-600 border border-red-300">
                    결석
                  </div>
                );
              case 'LEAVE':
                return (
                  <div className="mt-1 inline-block px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700 border border-yellow-300">
                    휴가
                  </div>
                );
              case 'MILITARY':
                return (
                  <div className="mt-1 inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 border border-green-300">
                    병역
                  </div>
                );
              default:
                return null;
            }
          };

          return (
            <div key={idx} className="h-20 border-r border-b border-gray-200 px-2 py-1 text-xs">
              <div className={`text-left ${dayColor}`}>{date.date()}</div>
              <div className="text-center text-[13px] leading-tight">{renderStatus()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}