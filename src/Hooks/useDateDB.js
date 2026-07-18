import { useState, useEffect } from 'react';
import { getHolidayName } from '../Utils/holidayUtils'
import { getPromotionDates, getRankAtDate, calculatePriStatus } from '../Utils/rankUtils';

export const useDateDB = (customHolidays, locationType, comfortLeaveTotal, inputS, priLimits, cycle, getCurrentCycleRange, storageKey = 'calendarDateDB') => {
  const [dateDB, setDateDB] = useState(() => {
    const savedDB = localStorage.getItem(storageKey);
    return savedDB ? JSON.parse(savedDB) : {};
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(dateDB));
  }, [dateDB, storageKey]);

  const group1 = ['STO', 'PFC', 'CPL', 'SFC', 'PRI', 'CSL', 'PTT', 'DTM', 'WDO', 'EXO'];
  const group1NoWdo = ['STO', 'PFC', 'CPL', 'SFC', 'PRI', 'CSL', 'PTT', 'DTM', 'EXO'];
  const group2 = ['MOW', 'AOW', 'EOW'];

  const toggleOption = (dateString, id) => {
    const dayData = dateDB[dateString] || {};
    const isTurningOn = !dayData[id];

    if (isTurningOn) {
      const [year, month, day] = dateString.split('-');
      const dateObj = new Date(year, month - 1, day);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      const isHoliday = getHolidayName(dateObj, customHolidays);
      const isRestDay = isWeekend || isHoliday;

      if (id === 'WDO' && isRestDay) {
        alert("잘못된 입력입니다.\n평일외출은 공휴일이 아닌 평일에만 사용할 수 있습니다.");
        return;
      }

      if (id === 'EXO' && !isRestDay) {
        alert("잘못된 입력입니다.\n특별외출은 주말이나 공휴일에만 사용할 수 있습니다.");
        return;
      }

      if (group2.includes(id)) {
        const hasGroup1NoWdo = group1NoWdo.some(key => dayData[key]);
        if (hasGroup1NoWdo) {
          alert("잘못된 입력입니다.\n기존 출타 일정을 해제한 후 다시 설정하십시오.");
          return;
        }
      }

      if (group1NoWdo.includes(id)) {
        const hasGroup2 = group2.some(key => dayData[key]);
        if (hasGroup2) {
          alert("잘못된 입력입니다.\n기존 초과근무 일정을 해제한 후 다시 설정하십시오.");
          return;
        }
      }

      if (id === 'EOW' && dayData['WDO']) {
        alert("잘못된 입력입니다.\n기존 출타 일정을 해제한 후 다시 설정하십시오.");
        return;
      }

      if (id === 'WDO' && dayData['EOW']) {
        alert("잘못된 입력입니다.\n기존 초과근무 일정을 해제한 후 다시 설정하십시오.");
        return;
      }

      if (id === 'STO') {
        const stoLimit = { '6주 외박': 3, '8주 외박': 4, '12주 외박': 6 }[cycle] || 3;
        
        if (getCurrentCycleRange) {
          const [year, month, day] = dateString.split('-');
          const clickedDate = new Date(year, month - 1, day);
          const cycleRange = getCurrentCycleRange(clickedDate);
          
          if (cycleRange) {
            const currentStoUsage = Object.keys(dateDB).filter(dateStr => {
              if (dateDB[dateStr]['STO']) {
                const d = new Date(dateStr);
                d.setHours(0, 0, 0, 0);
                return d >= cycleRange.start && d <= cycleRange.end;
              }
              return false;
            }).length;

            if (currentStoUsage >= stoLimit) {
              const isConfirmed = window.confirm(
                `해당 주기의 성과제 외박 기본 한도(${stoLimit}일)를 초과했습니다.\n이전 주기에서 지연된 성과제 외박을 사용하시겠습니까?`
              );
              
              if (!isConfirmed) {
                return; 
              }
            }
          }
        }
      }

      if (['PFC', 'CPL', 'SFC'].includes(id)) {
        const leaveLimits = {
          '기본': { PFC: 10, CPL: 8, SFC: 10 },
          '3급 격오지': { PFC: 14, CPL: 10, SFC: 13 },
          '1~2급 격오지': { PFC: 17, CPL: 13, SFC: 16 }
        };
        const currentLimits = leaveLimits[locationType] || leaveLimits['기본'];
        const maxAllowed = currentLimits[id];
        const currentUsage = Object.values(dateDB).filter(data => data[id]).length;

        if (currentUsage >= maxAllowed) {
          const leaveName = id === 'PFC' ? '일병연가' : id === 'CPL' ? '상병연가' : '병장연가';
          alert(`잘못된 입력입니다.\n${leaveName}는 현재 설정된 근무지 기준 최대 ${maxAllowed}일까지 사용할 수 있습니다.`);
          return;
        }

        if (inputS) {
          const promoDates = getPromotionDates(inputS);
          const targetRank = getRankAtDate(dateString, promoDates); 
          const leaveRankMap = { 'PFC': '일병', 'CPL': '상병', 'SFC': '병장' };
          const requiredRank = leaveRankMap[id];

          if (targetRank !== requiredRank) {
            const isConfirmed = window.confirm(
              `선택하신 날짜(${dateString})의 예상 계급은 ${targetRank}입니다.\n정말로 ${requiredRank}연가를 이 날짜에 사용하시겠습니까? (이월 또는 당겨쓰기)`
            );
            if (!isConfirmed) {
              return;
            }
          }
        }
      }

      if (id === 'PRI') {
        if (inputS) {
          const promoDates = getPromotionDates(inputS);
          const targetRank = getRankAtDate(dateString, promoDates);
          const rankKeyMap = { '일병': 'PFC', '상병': 'CPL', '병장': 'SFC' };
          const rankKey = rankKeyMap[targetRank];

          if (!rankKey) {
            alert(`잘못된 입력입니다.\n${targetRank} 기간에는 포상휴가를 사용할 수 없습니다.`);
            return;
          }

          const priStatus = calculatePriStatus(dateDB, inputS, priLimits);
          const currentUsage = priStatus.usage[rankKey];
          const currentLimit = priStatus.finalLimits[rankKey]; 

          if (currentUsage >= currentLimit) {
            alert(`잘못된 입력입니다.\n${targetRank} 기간의 포상휴가는 (이월 포함) 최대 ${currentLimit}개까지 사용할 수 있습니다.`);
            return;
          }
        } else {
          alert("포상휴가를 사용하려면 먼저 입대일을 설정해 주세요.");
          return;
        }
      }

      if (id === 'CSL') {
        const currentCslUsage = Object.values(dateDB).filter(data => data['CSL']).length;

        if (currentCslUsage >= comfortLeaveTotal) {
          alert(`잘못된 입력입니다.\n위로휴가는 현재 설정된 최대 ${comfortLeaveTotal}일까지 사용할 수 있습니다.`);
          return;
        }
      }
    }

    setDateDB((prev) => {
      const prevDayData = prev[dateString] || {};
      const updatedDayData = { ...prevDayData, [id]: isTurningOn };

      if (isTurningOn && group1.includes(id)) {
        group1.forEach(key => {
          if (key !== id) {
            updatedDayData[key] = false;
          }
        });
      }

      return {
        ...prev,
        [dateString]: updatedDayData
      };
    });
  };

  const setComment = (dateString, text) => {
    setDateDB((prev) => ({
      ...prev,
      [dateString]: {
        ...prev[dateString],
        comment: text
      }
    }));
  };

  return { dateDB, toggleOption, setComment };
};