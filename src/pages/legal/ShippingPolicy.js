import React from 'react';
import './LegalPages.css';

const ShippingPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Rallina Shipping Policy</h1>
        <p className="effective-date">Effective Date: April 26, 2025</p>
        <p>
          Rallina currently ships orders within the United States only. We do not offer international shipping at this time. All orders are processed and shipped from our fulfillment location in Champaign, Illinois.
        </p>

        <h2>1. Processing Time</h2>
        <ul>
          <li>Orders placed Monday through Friday before 12:00 PM CST begin processing the same day.</li>
          <li>Orders placed after 12:00 PM CST, on weekends, or on holidays will begin processing on the next business day.</li>
          <li>Standard processing time is 48–72 hours, but may be longer during sales, holidays, or high-volume periods.</li>
          <li>Certain products may have different processing times, which will be noted on the product page.</li>
        </ul>

        <h2>2. Shipping Options &amp; Fees</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Order Value</th>
              <th>Processing Time</th>
              <th>Estimated Shipping Time*</th>
              <th>Shipping Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Domestic (U.S.)</td>
              <td>Orders under $299</td>
              <td>48–72 hours</td>
              <td>Ground: 5–7 business days</td>
              <td>$14.95</td>
            </tr>
            <tr>
              <td>Domestic (U.S.)</td>
              <td>Orders under $299</td>
              <td>48–72 hours</td>
              <td>Expedited: 2–3 business days</td>
              <td>$32.95</td>
            </tr>
            <tr>
              <td>Domestic (U.S.)</td>
              <td>Orders $299+</td>
              <td>48–72 hours</td>
              <td>Ground: 5–7 business days</td>
              <td>FREE</td>
            </tr>
          </tbody>
        </table>
        <p className="legal-note">*Shipping times are estimates provided by the carrier and begin after your order has been processed and shipped.</p>

        <h2>3. Shipping Guidelines</h2>
        <ul>
          <li>Once your order ships, you will receive a confirmation email with your tracking number.</li>
          <li>Shipping fees are non-refundable unless the return is due to our error (see Refund &amp; Returns Policy).</li>
          <li>Rallina is not responsible for delays caused by carriers, weather, or circumstances outside our control.</li>
          <li>If a package is marked as delivered by the carrier, we are not responsible for lost or stolen items. Customers should contact the carrier directly for claims.</li>
        </ul>

        <h2>4. Address Accuracy</h2>
        <p>
          Customers are responsible for providing the correct shipping address at checkout. Rallina is not responsible for packages shipped to incorrect addresses provided by the customer. Orders with invalid or incomplete addresses may be delayed or canceled.
        </p>

        <h2>5. Order Tracking</h2>
        <ul>
          <li>A tracking number will be emailed once your order has shipped.</li>
          <li>Tracking updates may take up to 24 hours to appear in the carrier’s system.</li>
        </ul>

        <h2>6. Shipping Restrictions</h2>
        <ul>
          <li>We currently do not ship to P.O. Boxes, APO/FPO addresses, or international destinations.</li>
          <li>Oversized or heavy items may require additional shipping fees; these will be disclosed at checkout before payment.</li>
        </ul>

        <h2>7. Contact Us</h2>
        <address>
          Rallina Customer Support
          <br />Email: <a href="mailto:support@rallina.com">support@rallina.com</a>
          <br />Phone: +1 (555) 123-4567
          <br />Location: Champaign, Illinois, USA
        </address>
      </div>
    </div>
  );
};

export default ShippingPolicy;
