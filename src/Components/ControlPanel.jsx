import React from 'react';
import { formatDateString } from '../Utils/dateUtils';

function ControlPanel({ moveToToday, inputS, inputE, eDate, isDarkMode, rankInfo }) {
  const displayEDate = inputE ? inputE : (inputS ? formatDateString(eDate) : '미설정');
  
  const subBg = isDarkMode ? '#1E1E1E' : '#FAFAFA';
  const borderColor = isDarkMode ? '#333333' : '#e0e0e0';
  const textColor = isDarkMode ? '#E0E0E0' : '#333333';
  const subTextColor = isDarkMode ? '#AAAAAA' : '#666666';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start'}}>
      
      <button
        onClick={moveToToday}
        style={{
          backgroundColor: '#FFD700', color: '#000000', border: 'none', borderRadius: '6px',
          alignSelf: 'flex-end', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold',
          fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '20px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        오늘로 돌아가기
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignSelf: 'flex-end', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'flex-end'}}>
          <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', 
            border: `1px solid ${borderColor}`, borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: subBg, width: '120px', transition: 'background-color 0.3s, border 0.3s'
          }}>
            <label style={{ fontWeight: 'bold', fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '16px', color: subTextColor }}>
              입대일
            </label>
            <div style={{ fontSize: '16px', fontFamily: "'ROKAF_Sans_Medium', sans-serif", color: textColor }}>
              {inputS ? inputS : '미설정'}
            </div>
          </div>

          <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', 
            border: `1px solid ${borderColor}`, borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: subBg, width: '120px', transition: 'background-color 0.3s, border 0.3s'
          }}>
            <label style={{ fontWeight: 'bold', fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '16px', color: subTextColor }}>
              전역일
            </label>
            <div style={{ fontSize: '16px', fontFamily: "'ROKAF_Sans_Medium', sans-serif", color: textColor }}>
              {displayEDate}
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', 
          border: `1px solid ${borderColor}`, borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: subBg, transition: 'background-color 0.3s, border 0.3s'
        }}>
          <span style={{ fontWeight: 'bold', fontFamily: "'ROKAF_Sans_Bold', sans-serif", fontSize: '16px', color: subTextColor }}>
            현재 계급
          </span>
          <span style={{ fontSize: '20px', fontFamily: "'ROKAF_Sans_Bold', sans-serif", color: '#4C89CC' }}>
            {rankInfo.isDischarged 
              ? '🎉 전역' 
              : (rankInfo.rank === '입대 전' || rankInfo.rank === '-' 
                  ? rankInfo.rank 
                  : `${rankInfo.rank} ${rankInfo.hobong}호봉`)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;