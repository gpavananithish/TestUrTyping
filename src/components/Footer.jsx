import React from 'react';
import { Code, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="global-footer">
      <div className="footer-content">
        <div className="footer-info">
          <h3>TestUrTyping</h3>
          <p>Premium muscle memory tracking and mechanics.</p>
        </div>
        <div className="social-links">
          <a href="#" className="social-icon" aria-label="GitHub"><Code size={20} /></a>
          <a href="#" className="social-icon" aria-label="Twitter"><Globe size={20} /></a>
          <a href="#" className="social-icon" aria-label="Discord"><MessageCircle size={20} /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TestUrTyping. Built by Antigravity.</p>
      </div>
    </footer>
  );
}
