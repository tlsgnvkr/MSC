import { getToday } from '../Utils/dateUtils';

export const useServiceRate = (inputS, inputE, value) => {
  const today = getToday();
  const sDate = inputS ? new Date(inputS) : new Date();

  const eDate = inputE 
    ? new Date(inputE)
    : new Date(sDate.getFullYear(), sDate.getMonth() + 21, sDate.getDate() - 1);

  const totalDays = Math.ceil((eDate - sDate) / 86400000);
  const servedDays = Math.min(totalDays, Math.max(0, Math.ceil((today - sDate) / 86400000)));
  const serviceRate = totalDays === 0 ? 0 : (servedDays / totalDays) * 100;

  const selectedDate = new Date(value);
  selectedDate.setHours(0, 0, 0, 0);

  let remainDays = Math.ceil((eDate - selectedDate) / 86400000) - 1;
  let dDay = 0;
  if (remainDays === 0) {
    dDay = "-DAY";
  } else if (remainDays > 0) {
    dDay = "-" + remainDays.toString();
  } else {
    dDay = "+" + Math.abs(remainDays).toString();
  }

  return { sDate, eDate, dDay, serviceRate };
};