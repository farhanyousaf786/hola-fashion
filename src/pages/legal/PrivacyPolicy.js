import React from 'react';
import './LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        
        <div className="effective-date">
          <p><strong>Effective Date:</strong> August 16, 2025</p>
        </div>
        
        <div className="legal-content">
          <p>
            Rallina ("Rallina", "we", "our", or "us") is committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly. This Privacy Policy explains how we collect, use, disclose, and protect your personal information.
          </p>
          
          <section>
            <h2>1. Information We Collect</h2>
            <p>We collect personal information to provide you with our services and improve your experience. This includes:</p>
            
            <h3>1.1 Information You Provide:</h3>
            <ul>
              <li>Name, email address, phone number, physical address, and payment details when you book a service or make a purchase.</li>
              <li>Feedback or inquiries shared via our website, email, or phone.</li>
            </ul>
            
            <h3>1.2 Automatically Collected Information:</h3>
            <ul>
              <li>IP address, browser type, device details, and usage data when you visit our website.</li>
              <li>Location data to offer services in your area.</li>
            </ul>
            
            <h3>1.3 Third-Party Sources:</h3>
            <ul>
              <li>Information from publicly available databases or referral partners, where permitted by law.</li>
            </ul>
          </section>
          
          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, schedule, and manage services.</li>
              <li>Process payments and issue invoices.</li>
              <li>Communicate with you regarding appointments, promotions, or service updates.</li>
              <li>Comply with legal obligations under federal and state laws.</li>
              <li>Improve our services and website functionality through analytics and feedback.</li>
            </ul>
          </section>
          
          <section>
            <h2>3. Sharing Your Information</h2>
            <p>We may share your information in the following circumstances:</p>
            
            <h3>3.1 With Service Providers:</h3>
            <ul>
              <li>Third-party vendors (e.g., payment processors, IT support) who assist in delivering our services.</li>
            </ul>
            
            <h3>3.2 Legal Compliance:</h3>
            <ul>
              <li>To comply with federal, state, or local laws, or in response to subpoenas or court orders.</li>
            </ul>
            
            <h3>3.3 Business Transactions:</h3>
            <ul>
              <li>If the company is sold, merged, or restructured, your information may be transferred as part of the transaction.</li>
            </ul>
          </section>
          
          <section>
            <h2>4. Data Security</h2>
            <p>We implement reasonable and industry-standard measures to safeguard your information, including:</p>
            <ul>
              <li>Encryption of sensitive data during transmission (e.g., payment details).</li>
              <li>Regular updates to software and systems to prevent unauthorized access.</li>
              <li>Restricting access to personal information to authorized employees and service providers.</li>
            </ul>
            
            <p>
              While we strive to protect your information, no security system is entirely foolproof. In the event of a data breach, we will notify affected individuals as required by applicable laws.
            </p>
          </section>
          
          <section>
            <h2>5. Cookies and Tracking Technologies</h2>
            <p>Our website uses cookies to enhance user experience. Cookies may collect:</p>
            <ul>
              <li>Browsing activity, such as pages visited and time spent on the website.</li>
              <li>Preferences to provide personalized service offerings.</li>
            </ul>
            
            <p>
              You can manage your cookie settings through your browser. Please note that disabling cookies may affect website functionality.
            </p>
          </section>
          
          <section>
            <h2>6. Retention of Information</h2>
            <p>We retain your personal information as long as necessary to:</p>
            <ul>
              <li>Fulfill the purposes for which it was collected.</li>
              <li>Comply with legal obligations.</li>
              <li>Resolve disputes and enforce agreements.</li>
            </ul>
          </section>
          
          <section>
            <h2>7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites. Please review their privacy policies independently.
            </p>
          </section>
          
          <section>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in laws or services. Updates will be posted on this page with the revised effective date.
            </p>
          </section>
          
          <section>
            <h2>9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or how your information is handled, contact us at:</p>
            
            <div className="contact-info">
              <p><strong>Rallina</strong></p>
              <p><strong>Email:</strong> cs@couturecandy.com</p>
              <p><strong>Phone:</strong> 123-456-789</p>
              <p><strong>Address:</strong> Shop#, Street#, City, State, Country</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
