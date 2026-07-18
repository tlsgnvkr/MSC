import { useState, useEffect } from 'react';

export const useCalendarState = () => {
  const [value, setValue] = useState(new Date());
  
  const [title, setTitle] = useState(() => localStorage.getItem('savedTitle') || '');
  const [name, setName] = useState(() => localStorage.getItem('userName') || '');
  const [birthdate, setBirthdate] = useState(() => localStorage.getItem('userBirthdate') || '');
  const [inputS, setInputS] = useState(() => localStorage.getItem('savedInputS') || '');
  const [inputE, setInputE] = useState(() => localStorage.getItem('savedInputE') || '');
  const [inputCycleStart, setInputCycleStart] = useState(() => localStorage.getItem('savedInputCycleStart') || '');
  const [cycle, setCycle] = useState(() => localStorage.getItem('savedCycle') || '6주 외박');
  const [comfortLeaveTotal, setComfortLeaveTotal] = useState(() => Number(localStorage.getItem('comfortLeaveTotal') || 0));
  const [locationType, setLocationType] = useState(() => localStorage.getItem('savedLocationType') || '기본');

  const [customHolidays, setCustomHolidays] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('customHolidays')) || {};
    } catch {
      return {};
    }
  });

  const [priLimits, setPriLimits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('priLimits')) || { PFC: 6, CPL: 6, SFC: 6 };
    } catch {
      return { PFC: 6, CPL: 6, SFC: 6 };
    }
  });

  const [themeSetting, setThemeSetting] = useState(() => localStorage.getItem('themeSetting') || 'system');

  useEffect(() => {
    localStorage.setItem('savedTitle', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('userName', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('userBirthdate', birthdate);
  }, [birthdate]);

  useEffect(() => {
    localStorage.setItem('savedInputS', inputS);
  }, [inputS]);

  useEffect(() => {
    localStorage.setItem('savedInputE', inputE);
  }, [inputE]);

  useEffect(() => {
    localStorage.setItem('savedInputCycleStart', inputCycleStart);
  }, [inputCycleStart]);

  useEffect(() => {
    localStorage.setItem('savedCycle', cycle);
  }, [cycle]);

  useEffect(() => {
    localStorage.setItem('comfortLeaveTotal', comfortLeaveTotal);
  }, [comfortLeaveTotal]);

  useEffect(() => {
    localStorage.setItem('customHolidays', JSON.stringify(customHolidays));
  }, [customHolidays]);

  useEffect(() => {
    localStorage.setItem('themeSetting', themeSetting);
  }, [themeSetting]);

  useEffect(() => {
    localStorage.setItem('savedLocationType', locationType);
  }, [locationType]);

  useEffect(() => {
    localStorage.setItem('priLimits', JSON.stringify(priLimits));
  }, [priLimits]);

  return {
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
  };
};