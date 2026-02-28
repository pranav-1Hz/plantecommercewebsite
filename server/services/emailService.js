const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use Gmail App Password (not your real password)
  },
});

/**
 * Send OTP email to user
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - The 6-digit OTP code
 */
const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Plants & Home 🌿" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Your Password Reset OTP - Plants & Home',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #2d6a4f; font-size: 28px; margin: 0;">🌿 Plants & Home</h1>
                <p style="color: #888; font-size: 14px;">Password Reset Request</p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <p style="color: #333; font-size: 16px;">Hello,</p>
                <p style="color: #555; font-size: 14px;">We received a request to reset your password. Use the OTP code below:</p>
                
                <div style="background: #f0fff4; border: 2px solid #38a169; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                    <p style="color: #888; font-size: 12px; margin: 0 0 8px 0;">YOUR OTP CODE</p>
                    <p style="color: #276749; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${otp}</p>
                </div>
                
                <p style="color: #888; font-size: 13px;">⏰ This OTP expires in <strong>1 hour</strong>.</p>
                <p style="color: #888; font-size: 13px;">If you didn't request this, please ignore this email.</p>
            </div>
            
            <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 20px;">
                © 2026 Plants & Home. Made with 💚 by PRANAV
            </p>
        </div>
        `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 OTP email sent to: ${toEmail}`);
};

module.exports = { sendOtpEmail };
