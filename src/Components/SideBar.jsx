import React, { useState } from 'react';
import { formatDateString } from '../Utils/dateUtils';

function Sidebar({
  isOpen,
  toggleSidebar,
  title, setTitle,
  name, setName,
  birthdate, setBirthdate,
  inputS, setInputS,
  inputE, setInputE,
  eDate,
  inputCycleStart, setInputCycleStart,
  cycle, setCycle,
  customHolidays, setCustomHolidays,
  isDarkMode,
  themeSetting, setThemeSetting,
  locationType, setLocationType,
  priLimits, setPriLimits,
}) {
  const [isUserSectionOpen, setIsUserSectionOpen] = useState(false);
  const [isThemeSectionOpen, setIsThemeSectionOpen] = useState(false);
  const [isTitleSectionOpen, setIsTitleSectionOpen] = useState(false);
  const [isDateSectionOpen, setIsDateSectionOpen] = useState(false);
  const [isCycleSectionOpen, setIsCycleSectionOpen] = useState(false);
  const [isHolidaySectionOpen, setIsHolidaySectionOpen] = useState(false);
  const [isLocationSectionOpen, setIsLocationSectionOpen] = useState(false);
  const [isPriSectionOpen, setIsPriSectionOpen] = useState(false);

  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayName, setNewHolidayName] = useState('');

  const displayEDate = inputE ? inputE : (inputS ? formatDateString(eDate) : '');

  let defaultCycleStart = '';
  if (inputS) {
    const d = new Date(inputS);
    d.setDate(d.getDate() + 32);
    defaultCycleStart = formatDateString(d);
  }
  const displayCycleStart = inputCycleStart ? inputCycleStart : defaultCycleStart;

  const panelBg = isDarkMode ? '#1E1E1E' : '#F5F5F5';
  const textColor = isDarkMode ? '#E0E0E0' : '#333333';
  const borderColor = isDarkMode ? '#333333' : '#E0E0E0';
  const inputBg = isDarkMode ? '#2D2D2D' : '#FFFFFF';
  const inputBorder = isDarkMode ? '#444' : '#ccc';
  const liBg = isDarkMode ? '#2D2D2D' : '#fff';

  const handleAddHoliday = () => {
    if (!newHolidayDate) {
      alert("잘못된 입력입니다.\n공휴일 날짜를 설정해 주세요.");
      return;
    }
    else if (!newHolidayName) {
      alert("잘못된 입력입니다.\n공휴일 이름을 설정해 주세요.");
      return;
    }

    setCustomHolidays(prev => ({ ...prev, [newHolidayDate]: newHolidayName }));
    setNewHolidayDate('');
    setNewHolidayName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddHoliday();
    }
  };

  const handleRemoveHoliday = (dateString) => {
    setCustomHolidays(prev => {
      const updated = { ...prev };
      delete updated[dateString];
      return updated;
    });
  };

  const handleExport = () => {
    const backupData = {
      calendarDateDB: localStorage.getItem('calendarDateDB'),
      savedTitle: localStorage.getItem('savedTitle'),
      savedInputS: localStorage.getItem('savedInputS'),
      savedInputE: localStorage.getItem('savedInputE'),
      savedInputCycleStart: localStorage.getItem('savedInputCycleStart'),
      savedCycle: localStorage.getItem('savedCycle'),
      comfortLeaveTotal: localStorage.getItem('comfortLeaveTotal'),
      customHolidays: localStorage.getItem('customHolidays'),
      isDarkMode: localStorage.getItem('isDarkMode'),
    };

    const blob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calendar_backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePriLimitChange = (rank, val) => {
    const newLimits = { ...priLimits, [rank]: val };
    const total = newLimits.PFC + newLimits.CPL + newLimits.SFC;
    
    if (total > 18) {
      alert("세 계급의 포상휴가 개수의 합은 최대 18개를 초과할 수 없습니다.");
      return;
    }
    
    setPriLimits(newLimits);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        Object.keys(importedData).forEach(key => {
          if (importedData[key] !== null) {
            localStorage.setItem(key, importedData[key]);
          }
        });

        alert("데이터를 성공적으로 불러왔습니다. 앱을 새로고침합니다.");
        window.location.reload();
      } catch (error) {
        alert("잘못된 파일 형식입니다. 백업된 JSON 파일을 사용해주세요.");
      }
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };

  const handleReset = () => {
    const isConfirmed = window.confirm("정말로 모든 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.");
    if (isConfirmed) {
      localStorage.clear();
      window.alert("데이터가 성공적으로 초기화되었습니다.");
      window.location.reload();
    }
  };

  return (
    <>
      <div onClick={toggleSidebar} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: isOpen ? 1 : 0, visibility: isOpen ? 'visible' : 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 999 }} />
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '350px', height: '100vh', backgroundColor: panelBg, color: textColor, padding: '20px', boxSizing: 'border-box', transform: isOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: "'ROKAF_Sans_Medium', sans-serif", boxShadow: isOpen ? '4px 0 15px rgba(0,0,0,0.1)' : 'none', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${borderColor}`, paddingBottom: '15px', marginBottom: '10px' }}>
          <h3 style={{ fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '24px', margin: 0 }}>설정</h3>
          <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: textColor, fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setIsUserSectionOpen(!isUserSectionOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${borderColor}`, padding: '12px 0', fontSize: '16px', color: textColor, cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
            <span>사용자 정보 설정</span><span>{isUserSectionOpen ? '↑' : '↓'}</span>
          </button>
          {isUserSectionOpen && (
            <div style={{ padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>이름</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: textColor, fontFamily: "'ROKAF_Sans_Medium', sans-serif", fontSize: '14px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>생년월일</label>
                <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: textColor, fontFamily: "'ROKAF_Sans_Medium', sans-serif" }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setIsThemeSectionOpen(!isThemeSectionOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${borderColor}`, padding: '12px 0', fontSize: '16px', color: textColor, cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
            <span>테마 설정</span><span>{isThemeSectionOpen ? '↑' : '↓'}</span>
          </button>
          
          {isThemeSectionOpen && (
            <div style={{ padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['system', 'light', 'dark'].map((mode) => {
                  const labels = { system: '시스템 기본', light: '라이트', dark: '다크' };
                  return (
                    <button
                      key={mode} 
                      onClick={() => setThemeSetting(mode)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontFamily: "'ROKAF_Sans_Medium', sans-serif", border: 'none',
                        backgroundColor: themeSetting === mode ? '#4C89CC' : (isDarkMode ? '#333' : '#E0E0E0'),
                        color: themeSetting === mode ? '#FFFFFF' : textColor,
                        fontWeight: themeSetting === mode ? 'bold' : 'normal', transition: 'background-color 0.2s, color 0.2s'
                      }}
                    >
                      {labels[mode]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setIsTitleSectionOpen(!isTitleSectionOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${borderColor}`, padding: '12px 0', fontSize: '16px', color: textColor, cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
            <span>앱 제목 변경</span><span>{isTitleSectionOpen ? '↑' : '↓'}</span>
          </button>
          {isTitleSectionOpen && (
            <div style={{ padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: textColor, fontFamily: "'ROKAF_Sans_Medium', sans-serif", fontSize: '14px' }} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setIsDateSectionOpen(!isDateSectionOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${borderColor}`, padding: '12px 0', fontSize: '16px', color: textColor, cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
            <span>복무일 설정</span><span>{isDateSectionOpen ? '↑' : '↓'}</span>
          </button>
          {isDateSectionOpen && (
            <div style={{ padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>입대일</label>
                <input type="date" value={inputS} onChange={(e) => setInputS(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: textColor, fontFamily: "'ROKAF_Sans_Medium', sans-serif" }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>전역일</label>
                <input type="date" value={displayEDate} onChange={(e) => setInputE(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: textColor, fontFamily: "'ROKAF_Sans_Medium', sans-serif" }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setIsCycleSectionOpen(!isCycleSectionOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${borderColor}`, padding: '12px 0', fontSize: '16px', color: textColor, cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
            <span>성과제 외박 주기 설정</span><span>{isCycleSectionOpen ? '↑' : '↓'}</span>
          </button>
          {isCycleSectionOpen && (
            <div style={{ padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>성과제 외박 주기 시작일</label>
                <input type="date" value={displayCycleStart} onChange={(e) => setInputCycleStart(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: textColor, fontFamily: "'ROKAF_Sans_Medium', sans-serif" }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>성과제 외박 주기 옵션</label>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '6px' }}>
                  {['6주 외박', '8주 외박', '12주 외박'].map((opt) => (
                    <button
                      key={opt} onClick={() => setCycle(opt)}
                      style={{
                        padding: '10px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontFamily: "'ROKAF_Sans_Medium', sans-serif", border: 'none',
                        backgroundColor: cycle === opt ? '#4C89CC' : (isDarkMode ? '#333' : '#E0E0E0'),
                        color: cycle === opt ? '#FFFFFF' : textColor,
                        fontWeight: cycle === opt ? 'bold' : 'normal', transition: 'background-color 0.2s, color 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setIsLocationSectionOpen(!isLocationSectionOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${borderColor}`, padding: '12px 0', fontSize: '16px', color: textColor, cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
            <span>근무지 특성 (연가 일수) 설정</span><span>{isLocationSectionOpen ? '↑' : '↓'}</span>
          </button>
          {isLocationSectionOpen && (
            <div style={{ padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '6px' }}>
                {['기본', '3급 격오지', '1~2급 격오지'].map((opt) => (
                  <button
                    key={opt} onClick={() => setLocationType(opt)}
                    style={{
                      padding: '10px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontFamily: "'ROKAF_Sans_Medium', sans-serif", border: 'none',
                      backgroundColor: locationType === opt ? '#699B37' : (isDarkMode ? '#333' : '#E0E0E0'),
                      color: locationType === opt ? '#FFFFFF' : textColor,
                      fontWeight: locationType === opt ? 'bold' : 'normal', transition: 'background-color 0.2s, color 0.2s'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setIsPriSectionOpen(!isPriSectionOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${borderColor}`, padding: '12px 0', fontSize: '16px', color: textColor, cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
            <span>계급별 포상휴가 설정</span><span>{isPriSectionOpen ? '↑' : '↓'}</span>
          </button>
          
          {isPriSectionOpen && (
            <div style={{ padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>일병 (4~6개)</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[4, 5, 6].map((val) => (
                    <button
                      key={`pfc-${val}`} onClick={() => handlePriLimitChange('PFC', val)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontFamily: "'ROKAF_Sans_Medium', sans-serif", border: 'none',
                        backgroundColor: priLimits.PFC === val ? '#E9AE2B' : (isDarkMode ? '#333' : '#E0E0E0'),
                        color: priLimits.PFC === val ? '#FFFFFF' : textColor,
                        fontWeight: priLimits.PFC === val ? 'bold' : 'normal', transition: 'background-color 0.2s, color 0.2s'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>상병 (4~8개)</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[4, 5, 6, 7, 8].map((val) => (
                    <button
                      key={`cpl-${val}`} onClick={() => handlePriLimitChange('CPL', val)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontFamily: "'ROKAF_Sans_Medium', sans-serif", border: 'none',
                        backgroundColor: priLimits.CPL === val ? '#E9AE2B' : (isDarkMode ? '#333' : '#E0E0E0'),
                        color: priLimits.CPL === val ? '#FFFFFF' : textColor,
                        fontWeight: priLimits.CPL === val ? 'bold' : 'normal', transition: 'background-color 0.2s, color 0.2s'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>병장 (6~8개)</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[6, 7, 8].map((val) => (
                    <button
                      key={`sfc-${val}`} onClick={() => handlePriLimitChange('SFC', val)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontFamily: "'ROKAF_Sans_Medium', sans-serif", border: 'none',
                        backgroundColor: priLimits.SFC === val ? '#E9AE2B' : (isDarkMode ? '#333' : '#E0E0E0'),
                        color: priLimits.SFC === val ? '#FFFFFF' : textColor,
                        fontWeight: priLimits.SFC === val ? 'bold' : 'normal', transition: 'background-color 0.2s, color 0.2s'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setIsHolidaySectionOpen(!isHolidaySectionOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${borderColor}`, padding: '12px 0', fontSize: '16px', color: textColor, cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
            <span>공휴일 설정</span><span>{isHolidaySectionOpen ? '↑' : '↓'}</span>
          </button>
          {isHolidaySectionOpen && (
            <div style={{ padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '10px', borderBottom: `1px dashed ${borderColor}` }}>
                <input 
                  type="date" 
                  value={newHolidayDate} 
                  onChange={(e) => setNewHolidayDate(e.target.value)} 
                  onKeyDown={handleKeyDown}
                  style={{ padding: '8px', borderRadius: '5px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: textColor, fontFamily: "'ROKAF_Sans_Medium', sans-serif" }} 
                />
                <input 
                  type="text" 
                  placeholder="공휴일 이름" 
                  value={newHolidayName} 
                  onChange={(e) => setNewHolidayName(e.target.value)} 
                  onKeyDown={handleKeyDown}
                  style={{ padding: '8px', borderRadius: '5px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: textColor, fontFamily: "'ROKAF_Sans_Medium', sans-serif" }} 
                />
                <button onClick={handleAddHoliday} style={{ padding: '8px', backgroundColor: '#4C89CC', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
                  추가하기
                </button>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(customHolidays).sort(([dateA], [dateB]) => dateA.localeCompare(dateB)).map(([date, name]) => (
                  <li key={date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: liBg, padding: '8px', borderRadius: '5px', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', color: isDarkMode ? '#AAAAAA' : '#666' }}>{date}</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{name}</span>
                    </div>
                    <button onClick={() => handleRemoveHoliday(date)} style={{ background: '#E53E3E', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontFamily: "'ROKAF_Sans_Medium', sans-serif", fontSize: '12px' }}>삭제</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleExport} style={{ flex: 1, backgroundColor: '#4C89CC', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '12px', cursor: 'pointer', fontWeight: 'bold', fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '14px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', transition: 'background-color 0.2s' }}>
              데이터 백업
            </button>

            <label style={{ flex: 1, backgroundColor: '#4CAF50', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '12px', cursor: 'pointer', fontWeight: 'bold', fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '14px', textAlign: 'center', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', transition: 'background-color 0.2s' }}>
              데이터 복원
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>

          <button onClick={handleReset} style={{ width: '100%', backgroundColor: '#E53E3E', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '12px', cursor: 'pointer', fontWeight: 'bold', fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '14px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', transition: 'background-color 0.2s' }}>
            데이터 전체 초기화
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;