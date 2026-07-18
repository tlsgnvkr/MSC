import { getToday } from '../Utils/dateUtils'

export const useLeaveUsage = (dateDB, cycleRange, cycle) => {
  const stoLimit = {
    '6주 외박': 3,
    '8주 외박': 4,
    '12주 외박': 6
  }[cycle] || 3;

  const usage = {
    STO: 0,
    PFC: 0,
    CPL: 0,
    SFC: 0,
    PRI: 0,
    CSL: 0,
    WDO: 0,
  };

  const today = getToday();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  Object.entries(dateDB).forEach(([dateString, data]) => {
    if (data.PFC) usage.PFC++;
    if (data.CPL) usage.CPL++;
    if (data.SFC) usage.SFC++;
    if (data.PRI) usage.PRI++;
    if (data.CSL) usage.CSL++;

    if (data.STO && cycleRange) {
      const [year, month, day] = dateString.split('-');
      const d = new Date(year, month - 1, day);
      d.setHours(0, 0, 0, 0);

      if (cycleRange.start <= d && d <= cycleRange.end) {
        usage.STO++;
      }
    }

    if (data.WDO) {
      const d = new Date(dateString);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        usage.WDO++;
      }
    }
  });

  return { usage, stoLimit };
};