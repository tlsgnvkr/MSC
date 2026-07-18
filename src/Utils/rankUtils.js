import { getToday } from './dateUtils'

export const getPromotionDates = (inputS) => {
  if (!inputS) return null;

  const sDate = new Date(inputS);
  
  const isFirstDay = sDate.getDate() === 1;
  const offset = isFirstDay ? -1 : 0;

  const year = sDate.getFullYear();
  const month = sDate.getMonth(); 

  const pfcDate = new Date(year, month + 3 + offset, 1);
  const cplDate = new Date(year, month + 9 + offset, 1);
  const sfcDate = new Date(year, month + 15 + offset, 1);

  return {
    PFC: pfcDate,
    CPL: cplDate,
    SFC: sfcDate
  };
};

export const getRankAtDate = (targetDate, promotionDates) => {
  if (!promotionDates || !targetDate) return '이병';

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  if (target >= promotionDates.SFC) return '병장';
  if (target >= promotionDates.CPL) return '상병';
  if (target >= promotionDates.PFC) return '일병';
  
  return '이병';
};

export const getCurrentRankAndHobong = (inputS, eDate) => {
  if (!inputS) return { rank: '-', hobong: 0, isDischarged: false };
  
  const today = getToday();
  const sDate = new Date(inputS);
  sDate.setHours(0, 0, 0, 0);
  
  if (today < sDate) return { rank: '입대 전', hobong: 0, isDischarged: false };
  
  if (eDate) {
    const dischargeDate = new Date(eDate);
    dischargeDate.setHours(0, 0, 0, 0);
    if (today > dischargeDate) return { rank: '예비역', hobong: 0, isDischarged: true };
  }
  
  const promoDates = getPromotionDates(inputS);
  const rank = getRankAtDate(today, promoDates);
  
  let startDate;
  if (rank === '병장') startDate = promoDates.SFC;
  else if (rank === '상병') startDate = promoDates.CPL;
  else if (rank === '일병') startDate = promoDates.PFC;
  else startDate = sDate;
  
  const hobong = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth()) + 1;
  
  return { rank, hobong, isDischarged: false };
};

export const calculatePriStatus = (dateDB, inputS, priLimits) => {
  if (!inputS) return null;
  const promoDates = getPromotionDates(inputS);

  const usage = { PFC: 0, CPL: 0, SFC: 0 };
  
  if (dateDB) {
    Object.keys(dateDB).forEach(date => {
      if (dateDB[date]['PRI']) {
        const rank = getRankAtDate(date, promoDates);
        if (rank === '일병') usage.PFC++;
        else if (rank === '상병') usage.CPL++;
        else if (rank === '병장') usage.SFC++;
      }
    });
  }

  const limits = {
    PFC: priLimits?.PFC || 6,
    CPL: priLimits?.CPL || 6,
    SFC: priLimits?.SFC || 6
  };

  const finalLimits = { PFC: limits.PFC, CPL: limits.CPL, SFC: limits.SFC };

  const pfcRemain = Math.max(0, finalLimits.PFC - usage.PFC);
  const pfcCarry = Math.min(2, pfcRemain);
  finalLimits.CPL += pfcCarry;

  const cplRemain = Math.max(0, finalLimits.CPL - usage.CPL);
  const cplCarry = Math.min(2, cplRemain);
  finalLimits.SFC += cplCarry;

  return { usage, finalLimits };
};