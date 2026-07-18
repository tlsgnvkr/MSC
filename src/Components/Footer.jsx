import React from 'react';
// import { getToday } from '../Utils/dateUtils';
import image_dark from '../Sources/Profile_Black.png';
import image_light from '../Sources/Profile_White.png';

function Footer ({ isDarkMode }) {
  /* 
  const dischargeDate = new Date(2027, 7, 17);
  const today = getToday();

  today.setHours(0, 0, 0, 0);
  dischargeDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (dischargeDate - today) / (1000 * 60 * 60 * 24)
  );

  */

  const rootBg = isDarkMode ? '#121212' : '#FFFFFF';
  const imgRoot = isDarkMode ? image_dark : image_light;

  return (
    <footer style={{
      position: 'static', width: '100%', paddingTop: '20px', marginTop: '30px', marginBottom: '-20px',
      textAlign: 'center', fontSize: '14px',
      color: isDarkMode ? '#666' : '#999',
      backgroundColor: rootBg,
      fontFamily: "'ROKAF_Sans_Medium', sans-serif", borderTop: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`
    }}>
      <div className="top">
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <div style={{
            flex: 1,
            borderRight: "1px solid #ccc",
            paddingTop: "10px",
            textAlign: "center",
          }}>
            <img src={imgRoot} alt='' width='150px' /> 
          </div>
          <div style={{
            flex: 1,
            borderRight: "1px solid #ccc",
            paddingTop: "10px",
            textAlign: "center",
          }}>
            <h3 style={{ color: isDarkMode ? '#666' : '#999' }}>Contact</h3>
            <p style={{ color: isDarkMode ? '#666' : '#999' }}>shinhup4743@gmail.com<br/>25-70014641@af.mil</p>
            <p style={{ color: isDarkMode ? '#666' : '#999' }}></p>
          </div>
          
          <div style={{
            flex: 1,
            paddingTop: "10px",
            textAlign: "center",
          }}>
            <h3 style={{ color: isDarkMode ? '#666' : '#999' }}>
              <a className="footer-link" href="https://github.com/tlsgnvkr" target="_blank" rel="noopener noreferrer">
                Github
              </a>
              <br/><br/><br/>
              <a className="footer-link" href="https://instagram.com/shinhu_.vkr" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </h3>
          </div>
          <div style={{
            flex: 1,
            paddingTop: "10px",
            textAlign: "center",
          }}>
            <h3 style={{ color: isDarkMode ? '#666' : '#999' }}>
              <a className="footer-link" href="https://dev-tlsgnvkr.tistory.com/" target="_blank" rel="noopener noreferrer">
                Tistory
              </a>
              <br/><br/><br/><br/>
            </h3>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div style={{ paddingTop: "20px", marginTop: "20px", borderTop: "1px solid #ccc" }}>
          © 2026 tlsgnvkr. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;