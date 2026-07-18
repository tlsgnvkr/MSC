import React from 'react';

function ProgressPanel({ serviceRate, isDarkMode }) {
  const panelBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? '#333333' : '#e0e0e0';
  const barBg = isDarkMode ? '#333333' : '#E5E7EB';

  return (
    <div style={{ marginTop: "20px", width: "400px", padding: "20px", backgroundColor: panelBg, border: `1px solid ${borderColor}`, borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", boxSizing: "border-box", transition: 'background-color 0.3s, border 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '18px' }}>
        <h4 style={{ margin: 0, fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>복무율</h4>
        <span style={{ fontWeight: 'bold', color: '#4C89CC', fontSize: '18px', fontFamily: "'ROKAF_Sans_Bold', sans-serif" }}>{serviceRate.toFixed(1)}%</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ width: "100%", height: "18px", borderRadius: "10px", backgroundColor: barBg, overflow: "hidden" }}>
          <div style={{ width: `${serviceRate}%`, height: "100%", backgroundColor: "#4C89CC", transition: "width .5s" }} />
        </div>
      </div>
    </div>
  );
}

export default ProgressPanel;