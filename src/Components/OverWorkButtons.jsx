import React from 'react';
import { OverWorkOptions } from '../Utils/calendarUtils';

function OverWorkButtons({ currentDayData, toggleOption, selectedDateString, isDarkMode }) {
  const btnBg = isDarkMode ? '#2D2D2D' : '#f0f0f0';
  const btnText = isDarkMode ? '#E0E0E0' : '#333333';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
      {OverWorkOptions.map((opt) => {
        const isActive = currentDayData[opt.id];
        return (
          <button
            key={opt.id}
            onClick={() => toggleOption(selectedDateString, opt.id)}
            style={{
              backgroundColor: isActive ? opt.bg : btnBg, color: isActive ? opt.text : btnText,
              border: 'none', padding: '10px 5px', borderRadius: '5px', cursor: 'pointer',
              fontSize: '14px', fontFamily: "'ROKAF_Sans_Medium', sans-serif",
              fontWeight: isActive ? 'bold' : 'normal', transition: 'background-color 0.2s, color 0.2s'
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default OverWorkButtons;