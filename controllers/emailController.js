const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendOrderConfirmation = async (req, res) => {
  try {
    const { email, orderData } = req.body;
    
    if (!email || !orderData?.orderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and order data are required' 
      });
    }

    const msg = {
      to: email,
      from: 'switch2future@gmail.com',
      subject: `Order Confirmation - #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4a5568;">Thank you for your order!</h2>
          <p>Your order #${orderData.orderId} has been confirmed.</p>
          
          <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #2d3748;">Order Summary</h3>
            ${Object.values(orderData.items || {}).map(item => `
              <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
                <p style="margin: 5px 0; font-weight: 500;">${item.name || 'Item'}</p>
                <p style="margin: 5px 0; color: #4a5568; font-size: 14px;">
                  Quantity: ${item.quantity || 1} × $${item.price ? Number(item.price).toFixed(2) : '0.00'}
                  ${item.size ? ` | Size: ${item.size}` : ''}
                  ${item.color ? ` | Color: ${item.color}` : ''}
                </p>
              </div>
            `).join('')}
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #e2e8f0;">
              <p style="font-weight: bold; font-size: 1.1em; text-align: right;">
                Total: $${orderData.total?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          <p>You can view your order details <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-confirmation/${orderData.orderId}" style="color: #3182ce; text-decoration: none; font-weight: 500;">here</a>.</p>
          
          <p style="margin-top: 25px; color: #718096; font-size: 14px;">
            If you have any questions, please contact our support team.
          </p>
          
          <p style="margin-top: 20px; color: #718096; font-size: 14px;">
            Best regards,<br>
            <span style="color: #2d3748; font-weight: 500;">Rallina Team</span>
          </p>
        </div>
      `
    };

    await sgMail.send(msg);
    
    res.status(200).json({ 
      success: true, 
      message: 'Order confirmation email sent successfully' 
    });
    
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send order confirmation email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
