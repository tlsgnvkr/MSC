export const useCurrentCycle = (inputS, cycle, inputCycleStart) => {
  const getBaseDate = () => {
    if (inputCycleStart) {
      const [year, month, day] = inputCycleStart.split('-');
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }
    if (!inputS) return null;
    
    const [year, month, day] = inputS.split('-');
    const d = new Date(year, month - 1, day, 0, 0, 0, 0);
    d.setDate(d.getDate() + 32);
    return d;
  };

  const isCycleDay = (date) => {
    const firstLeave = getBaseDate();
    if (!firstLeave) return false;

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    if (target < firstLeave) return false;

    const cycleWeeks = {
      '6주 외박': 6,
      '8주 외박': 8,
      '12주 외박': 12
    };
    const weeks = cycleWeeks[cycle] || 6;
    
    const diffTime = target.getTime() - firstLeave.getTime();
    const diffDays = Math.round(diffTime / 86400000);

    return diffDays % (weeks * 7) === 0;
  };

  const getCurrentCycleRange = (targetDate = new Date()) => {
    const baseDate = getBaseDate();
    if (!baseDate) return null;

    const cycleWeeks = {
      '6주 외박': 6,
      '8주 외박': 8,
      '12주 외박': 12
    }[cycle] || 6;
    const cycleDays = cycleWeeks * 7;

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    if (target < baseDate) {
      const end = new Date(baseDate);
      end.setDate(end.getDate() + cycleDays - 1);
      end.setHours(23, 59, 59, 999);
      return { start: baseDate, end };
    }

    const diffTime = target.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / 86400000);
    const index = Math.floor(diffDays / cycleDays);

    const start = new Date(baseDate);
    start.setDate(start.getDate() + index * cycleDays);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + cycleDays - 1);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  return { isCycleDay, getCurrentCycleRange };
};