import React, { useEffect, useRef } from 'react';
import MonthCalendar from './MonthCalendar';
import { getToday } from '../Utils/dateUtils';

function CalendarPanel({ sDate, eDate, value, onChange, isCycleDay, dateDB, inputS, customHolidays, isDarkMode }) {
  const scrollContainerRef = useRef(null);
  const currentMonthRef = useRef(null);
  const today = getToday();

  const totalMonths = Math.max(1, (eDate.getFullYear() - sDate.getFullYear()) * 12 + (eDate.getMonth() - sDate.getMonth()) + 1);
  const monthsToRender = Array.from({ length: totalMonths }, (_, i) => {
    const d = new Date(sDate);
    d.setMonth(d.getMonth() + i);
    d.setDate(1);
    return d;
  });

  useEffect(() => {
    if (scrollContainerRef.current && currentMonthRef.current) {
      const container = scrollContainerRef.current;
      const target = currentMonthRef.current;
      container.scrollTop = target.offsetTop - container.offsetTop;
    }
  }, [inputS]);

  const handleDateChange = (newDate) => {
    onChange(newDate);
    if (scrollContainerRef.current) {
      const targetId = `month-${newDate.getFullYear()}-${newDate.getMonth()}`;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const container = scrollContainerRef.current;
        container.scrollTo({ top: targetElement.offsetTop - container.offsetTop, behavior: 'smooth' });
      }
    }
  };

  const panelBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? '#333333' : '#e0e0e0';

  return (
    <div 
      ref={scrollContainerRef}
      style={{ 
        height: '550px', width: '350px', overflowY: 'scroll', border: `1px solid ${borderColor}`, backgroundColor: panelBg,
        borderRadius: '10px', padding: '20px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', position: 'relative', transition: 'background-color 0.3s, border 0.3s'
      }}
    >
      {monthsToRender.map((monthDate, index) => {
        const isCurrentMonth = monthDate.getFullYear() === today.getFullYear() && monthDate.getMonth() === today.getMonth();
        return (
          <div 
            key={index} 
            id={`month-${monthDate.getFullYear()}-${monthDate.getMonth()}`}
            ref={isCurrentMonth ? currentMonthRef : null}
            style={{ marginBottom: '30px' }}
            className={isDarkMode ? 'calendar-dark' : 'calendar-light'}
          >
            <h3 style={{ textAlign: 'center', marginBottom: '10px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>
              {monthDate.getFullYear()}-{String(monthDate.getMonth() + 1).padStart(2, '0')}
            </h3>
            <MonthCalendar monthDate={monthDate} value={value} onChange={handleDateChange} isCycleDay={isCycleDay} dateDB={dateDB} customHolidays={customHolidays} />
          </div>
        );
      })}
    </div>
  );
}

export default CalendarPanel;