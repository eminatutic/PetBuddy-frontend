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
      <p>Phone number: +1 555-987-6543           Address: 123 Pet Haven Lane</p>
    </div>
  </footer>
);
};

export default Footer;
