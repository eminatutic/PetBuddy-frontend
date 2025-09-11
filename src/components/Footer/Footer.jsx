import React from 'react';
import './Footer.css';  

function Footer (){
return (
  <footer className="footer">
    <div className="footer-content">
      <p>&copy; 2024 Tech Innovators. All rights reserved.</p>
      <div className="social-links">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </div>
      <p>Phone number: 065278239           Address: King 23</p>
    </div>
  </footer>
);
};

export default Footer;
