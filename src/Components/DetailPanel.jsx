import React, { useState, useEffect } from 'react';
import OutButtons from './OutButtons';
import OverWorkButtons from './OverWorkButtons';
import { formatDateString, getToday } from '../Utils/dateUtils';
import { getHolidayName } from '../Utils/holidayUtils';

function DetailPanel({ value, eDate, dDay, dateDB, toggleOption, setComment, customHolidays, isDarkMode, name, birthdate, rankInfo }) {
  const selectedDateString = formatDateString(value);
  const currentHolidayName = getHolidayName(value, customHolidays);
  const currentDayData = dateDB[selectedDateString] || {};

  const today = getToday();

  const isToday = value.getFullYear() === today.getFullYear() && value.getMonth() === today.getMonth() && value.getDate() === today.getDate();
  const daysEn = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = daysEn[value.getDay()];
  const customDateString = `${value.getFullYear()}.${String(value.getMonth() + 1).padStart(2, '0')}.${String(value.getDate()).padStart(2, '0')}.(${dayOfWeek})`;

  const panelBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? '#333333' : '#e0e0e0';
  const textColor = isDarkMode ? '#E0E0E0' : '#333333';
  const inputBg = isDarkMode ? '#2D2D2D' : '#FFFFFF';
  const inputBorder = isDarkMode ? '#444' : '#ccc';

  let headerDateColor = isDarkMode ? '#E0E0E0' : '#000000';
  if (value.getDay() === 0 || currentHolidayName) {
    headerDateColor = isDarkMode? '#F09090' : '#FF0000';
  } else if (value.getDay() === 6) {
    headerDateColor = isDarkMode? '#6495ED' : '#0000FF';
  }

  const selectedDateObj = new Date(value);
  selectedDateObj.setHours(0, 0, 0, 0);
  const dischargeDateObj = new Date(eDate);
  dischargeDateObj.setHours(0, 0, 0, 0);
  const isDischarged = selectedDateObj >= dischargeDateObj;

  const [localComment, setLocalComment] = useState(currentDayData.comment || '');

  useEffect(() => {
    setLocalComment(currentDayData.comment || '');
  }, [selectedDateString, currentDayData.comment]);

  const handleSaveComment = () => {
    const todayObj = getToday(); 
    const dischargeObj = new Date(eDate);
    dischargeObj.setHours(0, 0, 0, 0);

    if (todayObj < dischargeObj && localComment.includes('전역')) {
      const y = dischargeObj.getFullYear();
      const m = dischargeObj.getMonth() + 1;
      
      let prevY = y;
      let prevM = m - 1;
      
      if (prevM === 0) {
        prevM = 12;
        prevY -= 1;
      }

      const teasingMessages = [
        "??? : 그런건 없다 게이야",
        `${prevY}년 ${prevM}월은 오지만\n${y}년 ${m}월은 오지 않는다.`,
        "[404 NOT FOUND] '전역' 데이터를 찾을 수 없습니다.",
        "전역(全役): 어느 지역의 전체\nEx) 수도권 전역에 비가 온다.",
        "[속보] 오늘 국군 전역 예정자 0명으로 밝혀져... 당사자 '충격'",
        "[SYSTEM] 금지어가 감지되었습니다.\n지속될 경우 앱 사용이 제한될 수 있습니다.",
        `전 ${y+30}년에서 왔습니다.\n${name} ${rankInfo.rank}님은 아직 군대에서 복무하고 있을 뿐입니다.`,
        `${name} ${rankInfo.rank} 점호 끝나고 당직사령실로 보고할 것.`,
        `축하합니다! ${rankInfo.rank} ${name}님께서\n"한참 남은 자" 칭호를 획득하였습니다.`
      ];

      const randomIndex = Math.floor(Math.random() * teasingMessages.length);
      alert(teasingMessages[randomIndex]);
      
      setLocalComment("");
      return;
    }

    setComment(selectedDateString, localComment);
  };

  const handleResetComment = () => {
    if (window.confirm("이 날짜의 코멘트를 지우시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      setLocalComment("");
      setComment(selectedDateString, "");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveComment();
    }
  };

  const isBirthday = () => {
    if (!birthdate) return false;
    const [bYear, bMonth, bDay] = birthdate.split('-');
    return value.getMonth() + 1 === Number(bMonth) && value.getDate() === Number(bDay) && bYear;
  };

  const showBirthdayEvent = isBirthday();

  return (
    <div style={{ width: '450px', padding: '20px', backgroundColor: panelBg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', transition: 'background-color 0.3s, border 0.3s' }}>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontFamily: "'ROKAF_Sans_Bold', sans-serif", color: headerDateColor, margin: 0, fontSize: '24px' }}>{customDateString}</h3>
          {isToday && (<span style={{ backgroundColor: '#FFD700', color: '#000000', fontWeight: 'bold', padding: '3px 8px', borderRadius: '5px', marginLeft: '12px', fontSize: '15px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>TODAY</span>)}
          <span style={{ backgroundColor: '#E2E8F0', color: '#333333', fontWeight: 'bold', padding: '3px 8px', borderRadius: '5px', marginLeft: '8px', fontSize: '15px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>D{dDay}</span>
        </div>
        {currentHolidayName && (<p style={{ color: headerDateColor, fontWeight: 'bold', margin: 0, fontSize: '18px' }}>{currentHolidayName}</p>)}
      </div>

      {showBirthdayEvent && (
        <div style={{ textAlign: 'center', padding: '15px', backgroundColor: isDarkMode ? '#3D3418' : '#FFF9C4', borderRadius: '8px', marginBottom: '20px', border: `2px dashed ${isDarkMode ? '#FFD700' : '#F5B041'}`, animation: 'pulse 2s infinite' }}>
          <h4 style={{ margin: '0 0 5px 0', color: isDarkMode ? '#FFD700' : '#E67E22', fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '20px' }}>
            🎂 진심으로 축하합니다! 🎂
          </h4>
          <p style={{ margin: 0, fontFamily: "'ROKAF_Sans_Medium', sans-serif", fontSize: '15px' }}>
            오늘은 <strong style={{color: '#4C89CC'}}>{name || '사용자'}</strong>님의 생일입니다. 행복한 하루 보내세요! 🎉
          </p>
        </div>
      )}
      
      {isDischarged ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h3 style={{ color: '#4C89CC', fontFamily: "'ROKAF_Sans_Bold', sans-serif", marginBottom: '10px' }}>🎉 전역을 진심으로 축하합니다! 🎉</h3>
          <p style={{ fontFamily: "'ROKAF_Sans_Medium', sans-serif", color: textColor }}>그동안의 노고에 감사드립니다. 새로운 시작을 응원합니다!</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>출타 영역</h4>
            <OutButtons currentDayData={currentDayData} toggleOption={toggleOption} selectedDateString={selectedDateString} isDarkMode={isDarkMode} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <textarea 
                value={localComment} 
                onChange={(e) => setLocalComment(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder="코멘트 입력 (Enter로 저장, Shift+Enter로 줄바꿈)" 
                style={{ 
                  flex: 1, height: '70px', padding: '10px', borderRadius: '5px', 
                  border: `1px solid ${inputBorder}`, backgroundColor: inputBg, 
                  color: textColor, boxSizing: 'border-box', 
                  fontFamily: "'ROKAF_Sans_Medium', sans-serif", resize: 'none' 
                }} 
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '60px' }}>
                <button 
                  onClick={handleSaveComment}
                  style={{ 
                    flex: 1, backgroundColor: '#4CAF50', color: '#fff', 
                    border: 'none', borderRadius: '5px', cursor: 'pointer', 
                    fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '13px',
                    transition: 'background-color 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#388E3C'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                >
                  저장
                </button>
                <button 
                  onClick={handleResetComment}
                  style={{ 
                    flex: 1, backgroundColor: '#E53E3E', color: '#fff', 
                    border: 'none', borderRadius: '5px', cursor: 'pointer', 
                    fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '13px',
                    transition: 'background-color 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#C53030'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#E53E3E'}
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '10px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>초과근무 영역</h4>
            <OverWorkButtons currentDayData={currentDayData} toggleOption={toggleOption} selectedDateString={selectedDateString} isDarkMode={isDarkMode} />
          </div>
        </>
      )}
    </div>
  );
}

export default DetailPanel;