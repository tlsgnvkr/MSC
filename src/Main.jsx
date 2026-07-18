import React, { useState, useEffect } from 'react';
import '../node_modules/react-calendar/dist/Calendar.css';
import './Main.css';

import { useDateDB } from './Hooks/useDateDB';
import { getToday } from './Utils/dateUtils';
import { getCurrentRankAndHobong } from './Utils/rankUtils';
import { useCalendarState } from './Hooks/useCalendarState';
import { useServiceRate } from './Hooks/useServiceRate';
import { useCurrentCycle } from './Hooks/useCurrentCycle';
import { useLeaveUsage } from './Hooks/useOutUsage';

import Sidebar from './Components/SideBar';
import ControlPanel from './Components/ControlPanel';
import LeaveUsagePanel from './Components/OutUsagePanel';
import CalendarPanel from './Components/CalendarPanel';
import DetailPanel from './Components/DetailPanel';
import ProgressPanel from './Components/ProgressPanel';
import Footer from './Components/Footer';

function MyCalendar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    value, setValue,
    title, setTitle,
    name, setName,
    birthdate, setBirthdate,
    inputS, setInputS,
    inputE, setInputE,
    inputCycleStart, setInputCycleStart,
    cycle, setCycle,
    comfortLeaveTotal, setComfortLeaveTotal,
    customHolidays, setCustomHolidays,
    themeSetting, setThemeSetting,
    locationType, setLocationType,
    priLimits, setPriLimits,
  } = useCalendarState();

  const { sDate, eDate, dDay, serviceRate } = useServiceRate(inputS, inputE, value);
  const { isCycleDay, getCurrentCycleRange } = useCurrentCycle(inputS, cycle, inputCycleStart);

  const { dateDB, toggleOption, setComment } = useDateDB(customHolidays, locationType, comfortLeaveTotal, inputS, priLimits, cycle, getCurrentCycleRange);

  const { usage, stoLimit } = useLeaveUsage(dateDB, getCurrentCycleRange(), cycle);

  const rankInfo = getCurrentRankAndHobong(inputS, eDate);

  const moveToToday = () => {
    const today = getToday();
    setValue(today);
    
    setTimeout(() => {
      const targetId = `month-${today.getFullYear()}-${today.getMonth()}`;
      const targetElement = document.getElementById(targetId);
      const container = document.querySelector('[style*="overflow-y: scroll"]');
      
      if (targetElement && container) {
        container.scrollTo({ top: targetElement.offsetTop - container.offsetTop, behavior: 'smooth' });
      }
    }, 100);
  };

  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemPrefersDark(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const isDarkMode = themeSetting === 'dark' || (themeSetting === 'system' && systemPrefersDark);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const rootBg = isDarkMode ? '#121212' : '#FFFFFF';
  const rootColor = isDarkMode ? '#E0E0E0' : '#333333';
  const titleColor = title ? rootColor : '#888888';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minHeight: '100vh', backgroundColor: rootBg, color: rootColor,
      paddingTop: '20px', paddingBottom: '60px',
      width: '100%', fontFamily: "'ROKAF_Sans_Medium', sans-serif",
      boxSizing: 'border-box', position: 'relative', transition: 'background-color 0.3s' }}>
      
      <button onClick={toggleSidebar} style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px 15px', backgroundColor: '#4C89CC', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
        ☰ 설정
      </button>

      <Sidebar 
        isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} 
        title={title} setTitle={setTitle}
        name={name} setName={setName}
        birthdate={birthdate} setBirthdate={setBirthdate}
        inputS={inputS} setInputS={setInputS}
        inputE={inputE} setInputE={setInputE}
        eDate={eDate}
        inputCycleStart={inputCycleStart} setInputCycleStart={setInputCycleStart}
        cycle={cycle} setCycle={setCycle}
        customHolidays={customHolidays} setCustomHolidays={setCustomHolidays}
        isDarkMode={isDarkMode}
        themeSetting={themeSetting} setThemeSetting={setThemeSetting}
        locationType={locationType} setLocationType={setLocationType}
        priLimits={priLimits} setPriLimits={setPriLimits}
      />

      <h2 style={{ fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '45px', color: titleColor, textShadow: '6px 6px 2px rgba(0, 0, 0, 0.1)', WebkitTextStroke: '1.2px' + titleColor}}>
        {title || "제목을 입력하세요"}
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'flex-start'}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start'}}>
        <ControlPanel
          moveToToday={moveToToday}
          inputS={inputS} inputE={inputE}
          eDate={eDate}
          isDarkMode={isDarkMode} rankInfo={rankInfo}
        />
        
        <LeaveUsagePanel 
          usage={usage} 
          stoLimit={stoLimit} 
          comfortLeaveTotal={comfortLeaveTotal} 
          setComfortLeaveTotal={setComfortLeaveTotal} 
          isDarkMode={isDarkMode} 
          locationType={locationType} 
          priLimits={priLimits}
          rankInfo={rankInfo}
          dateDB={dateDB}
          inputS={inputS}
        />
      </div>

        <CalendarPanel
          sDate={sDate}
          eDate={eDate}
          value={value}
          onChange={setValue}
          isCycleDay={isCycleDay}
          dateDB={dateDB}
          inputS={inputS}
          customHolidays={customHolidays}
          isDarkMode={isDarkMode}
        />

        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
          <DetailPanel
            value={value}
            eDate={eDate}
            dDay={dDay}
            dateDB={dateDB}
            toggleOption={toggleOption}
            setComment={setComment}
            customHolidays={customHolidays}
            isDarkMode={isDarkMode}
            name={name}
            birthdate={birthdate}
            rankInfo={rankInfo}
          />
          <ProgressPanel
            serviceRate={serviceRate}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      <Footer
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default MyCalendar;