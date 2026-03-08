'use client';

import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CodeAI</h3>
          <p>Learn coding smarter with AI-powered voice guidance.</p>
          <div className="social-links">
            <a href="#" title="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" title="GitHub">
              <Github size={20} />
            </a>
            <a href="#" title="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" title="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#demo">Demo</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 CodeAI. All rights reserved.</p>
        <p>Built with love for developers worldwide</p>
      </div>
    </footer>
  );
}
