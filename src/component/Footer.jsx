import { Link } from 'react-router-dom';
import './css/Footer.css'; // Ensure this path matches your file structure
import logo from '../assets/logo.webp';
function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-top">
        <div className="footer-logo">
          <img src={logo} alt="Logo" className="footer-logo-image" />
        </div>
        <div className="footer-badge">
          <span className="footer-badge-text">A+</span>
        </div>
      </div>
      <div className="footer-content">
      <div className="footer-content">
  <div className="footer-info">
    <p>
      HealthPlanSavings.com is privately owned and operated by Visionary Solutions, LLC. Insurance applications are processed through OptiRates, LLC, a subsidiary of Visionary Solutions, only where licensed and appointed – Licensing. HealthPlanSavings.com is not affiliated with or endorsed by the United States Government or the federal Medicare program. Available plans may include major medical plans, short-term plans, fixed indemnity plans, and more. *Plan prices may vary based on plan types, location, and other factors. Not all applicants will qualify for $0/m or $59/m plans. Eligibility may vary by location, household size, and income. By using this site, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
    </p>
    <p>
      We prioritize your privacy. If you prefer not to share your information, please visit <Link to="/do-not-sell">Do Not Sell My Personal Information</Link> for more details.
    </p>
  </div>
  <div className="footer-contact">
    <p>
      Copyright © 2024 HealthPlanSavings.com | All rights reserved. | <Link to="/contact">Contact Us</Link>
    </p>
  </div>
</div>
      </div>
    </div>
  );
}

export default Footer;
