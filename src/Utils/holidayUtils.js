import { formatDateString } from './dateUtils';

export const getHolidayName = (date, customHolidays = {}) => {
  const dateString = formatDateString(date);
  return customHolidays[dateString] || null;
};