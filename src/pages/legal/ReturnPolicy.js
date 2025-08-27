import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="legal-page" style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 10 }}>Rallina Refund & Returns Policy</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Effective Date: Month XX, 2025</p>

      <p>
        At Rallina, we want you to feel confident shopping with us. This Refund & Returns Policy explains how
        returns, exchanges, and refunds are handled in compliance with U.S. federal law and Illinois state law.
      </p>

      <hr style={{ margin: '24px 0' }} />

      <h2>1. Eligibility for Returns</h2>
      <ul>
        <li>You may return most new, unused, and unopened items within 30 days of delivery for a refund or exchange.</li>
        <li>Items must be returned in their original condition and packaging, with all tags, manuals, and accessories included.</li>
        <li>
          Some items may be non-returnable due to health, hygiene, or safety reasons (e.g., intimate apparel, perishable goods, or
          opened cosmetics). These restrictions will be clearly noted on the product page.
        </li>
      </ul>

      <h2>2. Return Process</h2>
      <ol>
        <li>
          Contact our Customer Support at <a href="mailto:support@rallina.com">support@rallina.com</a> within the return window to request a
          Return Merchandise Authorization (RMA).
        </li>
        <li>Securely package your item(s) and include your order number.</li>
        <li>
          Ship the return using the label provided by our team or at your own cost (unless the return is due to our error — see Section 3).
        </li>
      </ol>

      <h2>3. Defective, Damaged, or Incorrect Items</h2>
      <ul>
        <li>Notify us within 7 days of delivery.</li>
        <li>We will provide a prepaid return label and issue either a full refund or a replacement at no additional cost to you.</li>
      </ul>

      <h2>4. Refunds</h2>
      <ul>
        <li>Refunds are issued to the original form of payment used at checkout.</li>
        <li>Once your return is received and inspected, we will notify you of approval or denial. Approved refunds are typically processed within 5–10 business days.</li>
        <li>Shipping costs are non-refundable unless the return is due to our error.</li>
      </ul>

      <h2>5. Exchanges</h2>
      <ul>
        <li>If you would like to exchange an item for a different size, color, or product, please contact us to arrange the exchange.</li>
        <li>Exchanges are subject to availability. If the requested item is unavailable, we will issue a refund instead.</li>
      </ul>

      <h2>6. Final Sale & Non-Returnable Items</h2>
      <p>Certain items cannot be returned or exchanged, including:</p>
      <ul>
        <li>Gift cards and digital products.</li>
        <li>Clearance or “Final Sale” items (clearly marked at checkout).</li>
        <li>Perishable, personalized, or hygiene-sensitive products (as noted on product pages).</li>
      </ul>

      <h2>7. Illinois & Federal Consumer Rights</h2>
      <ul>
        <li>Nothing in this policy limits your rights under the Illinois Consumer Fraud and Deceptive Business Practices Act or applicable federal consumer protection laws.</li>
        <li>If a product is found to be defective, unsafe, or materially misrepresented, you may be entitled to additional remedies under Illinois law.</li>
      </ul>

      <h2>8. Contact Us</h2>
      <p>
        For any questions or to initiate a return:
        <br />
        Rallina Customer Support
        <br />
        Email: <a href="mailto:support@rallina.com">support@rallina.com</a>
      </p>
    </div>
  );
};

export default ReturnPolicy;
