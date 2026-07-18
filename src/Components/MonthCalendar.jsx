import React from 'react';
import Calendar from 'react-calendar';
import { getHolidayName } from '../Utils/holidayUtils';
import { formatDateString } from '../Utils/dateUtils';
import { optionColors } from '../Utils/optionColors';

function MonthCalendar({ monthDate, value, onChange, isCycleDay, dateDB, customHolidays }) {
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const classes = [];
      if (date.getDay() === 6) classes.push('saturday-blue');
      if (getHolidayName(date, customHolidays)) classes.push('holiday-blue');
      if (isCycleDay(date)) classes.push('cycle-day');
      return classes.join(' ');
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = formatDateString(date);
      const dayData = dateDB[dateString];

      if (!dayData) return null;

      const hasComment = dayData.comment && dayData.comment.trim() !== '';

      const getActiveLeaveType = (data) => {
        if (!data) return null;
        return ['STO', 'PFC', 'CPL', 'SFC', 'PRI', 'CSL', 'PTT', 'DTM', 'WDO', 'EXO'].find(k => data[k]) || null;
      };

      const getLeaveGroup = (type) => {
        if (type === 'DTM') return 'DISPATCH';
        if (['STO', 'PFC', 'CPL', 'SFC', 'PRI', 'CSL', 'PTT'].includes(type)) return 'LEAVE';
        return null;
      };

      const todayType = getActiveLeaveType(dayData);
      const todayGroup = todayType ? getLeaveGroup(todayType) : null;

      const prevDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
      const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const prevData = dateDB[formatDateString(prevDate)];
      const nextData = dateDB[formatDateString(nextDate)];

      const prevType = getActiveLeaveType(prevData);
      const nextType = getActiveLeaveType(nextData);

      const isConnectedPrev = todayGroup && prevType && getLeaveGroup(prevType) === todayGroup;
      const isConnectedNext = todayGroup && nextType && getLeaveGroup(nextType) === todayGroup;

      const fullLeaveKeys = ['STO', 'PFC', 'CPL', 'SFC', 'PRI', 'CSL', 'PTT', 'DTM', 'EXO'];
      const activeFullLeave = fullLeaveKeys.find(key => dayData[key]);

      const hasPartial = dayData['MOW'] || dayData['AOW'] || dayData['EOW'] || dayData['WDO'];

      return (
        <>
          {hasComment && (
            <>
              <div style={{
                position: 'absolute', 
                top: '6px', 
                right: '6px', 
                width: '6px', 
                height: '6px', 
                backgroundColor: '#ff0000', 
                borderRadius: '50%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                zIndex: 10,
              }} />
              
              <div className="calendar-tooltip-text">
                {dayData.comment}
              </div>
            </>
          )}

          {activeFullLeave && (
            <div style={{
              position: 'absolute', bottom: '4px', height: '6px', backgroundColor: optionColors[activeFullLeave],
              left: isConnectedPrev ? '0px' : '4px', right: isConnectedNext ? '0px' : '4px',
              borderTopLeftRadius: isConnectedPrev ? '0px' : '3px', borderBottomLeftRadius: isConnectedPrev ? '0px' : '3px',
              borderTopRightRadius: isConnectedNext ? '0px' : '3px', borderBottomRightRadius: isConnectedNext ? '0px' : '3px',
            }} />
          )}

          {!activeFullLeave && hasPartial && (() => {
            const connectMowAow = dayData['MOW'] && dayData['AOW'];
            const connectAowEow = dayData['AOW'] && dayData['EOW'];

            return (
              <div style={{ position: 'absolute', bottom: '4px', left: '4px', right: '4px', display: 'flex', height: '6px' }}>
                <div style={{ flex: 1, backgroundColor: dayData['MOW'] ? optionColors['MOW'] : 'transparent', borderRadius: connectMowAow ? '3px 0 0 3px' : '3px' }} />
                <div style={{ flex: 1, backgroundColor: dayData['AOW'] ? optionColors['AOW'] : 'transparent', marginLeft: connectMowAow ? '0px' : '2px', borderRadius: (connectMowAow && connectAowEow) ? '0px' : (connectMowAow ? '0 3px 3px 0' : (connectAowEow ? '3px 0 0 3px' : '3px')) }} />
                <div style={{ flex: 1, backgroundColor: dayData['EOW'] ? optionColors['EOW'] : (dayData['WDO'] ? optionColors['WDO'] : 'transparent'), marginLeft: connectAowEow ? '0px' : '2px', borderRadius: connectAowEow ? '0 3px 3px 0' : '3px' }} />
              </div>
            );
          })()}
        </>
      );
    }
    return null;
  };

  return (
    <Calendar 
      onChange={onChange} 
      value={value}
      calendarType="gregory"
      locale="ko-KR"
      formatDay={(locale, date) => date.getDate().toString()}
      tileClassName={tileClassName}
      tileContent={tileContent}
      showNavigation={false} 
      activeStartDate={monthDate}
    />
  );
}

export default MonthCalendar;