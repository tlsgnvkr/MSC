import React from 'react';
import { calculatePriStatus } from '../Utils/rankUtils';

function LeaveUsagePanel({ usage, stoLimit, comfortLeaveTotal, setComfortLeaveTotal, isDarkMode, locationType, priLimits, rankInfo, dateDB, inputS }) {
  const panelBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? '#333333' : '#f0f0f0';
  const textColor = isDarkMode ? '#E0E0E0' : '#333333';
  const inputBg = isDarkMode ? '#2D2D2D' : '#FFFFFF';
  const inputBorder = isDarkMode ? '#444' : '#ccc';

  const leaveLimits = {
    '기본': { PFC: 10, CPL: 8, SFC: 10 },
    '3급 격오지': { PFC: 14, CPL: 10, SFC: 13 },
    '1~2급 격오지': { PFC: 17, CPL: 13, SFC: 16 }
  };

  let currentLimits = leaveLimits[locationType] || leaveLimits['기본'];

  const priStatus = calculatePriStatus(dateDB, inputS, priLimits);

  let currentPriLimit = 6;
  let currentPriUsage = 0;

  if (rankInfo && ['일병', '상병', '병장'].includes(rankInfo.rank) && priStatus) {
    const rankKeyMap = { '일병': 'PFC', '상병': 'CPL', '병장': 'SFC' };
    const rKey = rankKeyMap[rankInfo.rank];
    
    currentPriLimit = priStatus.finalLimits[rKey];
    currentPriUsage = priStatus.usage[rKey];
  } else {
    currentPriLimit = 0;
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: panelBg, color: textColor,
      border: `1px solid ${borderColor}`, borderRadius: '10px', alignSelf: 'flex-end',
      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', transition: 'background-color 0.3s, border 0.3s'
    }}>
      <label style={{ fontWeight:'bold', fontFamily:"'ROKAF_Sans_Bold', sans-serif", fontSize:'16px' }}>
        외출/외박/휴가 사용 현황  
      </label>
      <div>평일외출 : {usage.WDO} / 2</div>
      <div>성과제 외박 : {usage.STO} / {stoLimit}</div>
      <div>일병연가 : {usage.PFC} / {currentLimits.PFC}</div>
      <div>상병연가 : {usage.CPL} / {currentLimits.CPL}</div>
      <div>병장연가 : {usage.SFC} / {currentLimits.SFC}</div>
      <div>
        포상휴가 : {currentPriUsage} / {currentPriLimit}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>위로휴가 : {usage.CSL} /</span>
          <input
            type="number" min="0" value={comfortLeaveTotal} onChange={(e) => setComfortLeaveTotal(Number(e.target.value))}
            style={{
              width: '60px', padding: '4px 8px', border: `1px solid ${inputBorder}`, borderRadius: '5px', backgroundColor: inputBg, color: textColor,
              textAlign: 'center', fontFamily: "'ROKAF_Sans_Medium', sans-serif", fontSize: '14px', MozAppearance: 'textfield'
            }}
            className="no-spinner"
          />
      </div>
    </div>
  );
}

export default LeaveUsagePanel;