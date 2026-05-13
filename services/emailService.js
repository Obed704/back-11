import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate 6-digit verification code
export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (email, code) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #17cfdc 0%, #f21ea7 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e9ecef;
          border-top: none;
        }
        .code {
          font-size: 42px;
          font-weight: bold;
          text-align: center;
          letter-spacing: 10px;
          color: #f21ea7;
          padding: 20px;
          background: white;
          border-radius: 10px;
          margin: 20px 0;
          font-family: monospace;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #6c757d;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔐 STEM Inspire Admin</h1>
        <p>Two-Factor Authentication</p>
      </div>
      <div class="content">
        <h2>Hello Admin,</h2>
        <p>You've requested to log in to your STEM Inspire admin account. Please use the verification code below to complete your login.</p>
        
        <div class="code">${code}</div>
        
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        
        <div class="warning">
          ⚠️ <strong>Security Alert:</strong> If you did not attempt to log in, please ignore this email and consider changing your password.
        </div>
        
        <p>Best regards,<br>
        <strong>STEM Inspire Team</strong></p>
      </div>
      <div class="footer">
        <p>This is an automated message, please do not reply to this email.</p>
        <p>&copy; ${new Date().getFullYear()} STEM Inspire. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

    const text = `
    STEM Inspire Admin - Two-Factor Authentication
    
    Hello Admin,
    
    You've requested to log in to your STEM Inspire admin account. 
    Please use the verification code below to complete your login:
    
    ${code}
    
    This code will expire in 10 minutes.
    
    Security Alert: If you did not attempt to log in, please ignore this email 
    and consider changing your password.
    
    Best regards,
    STEM Inspire Team
    
    This is an automated message, please do not reply to this email.
  `;

    await transporter.sendMail({
        from: `"STEM Inspire" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔐 Admin Login Verification Code",
        text,
        html,
    });
};

// Send password reset email (optional)
export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f21ea7; color: white; padding: 20px; text-align: center; }
        .button { display: inline-block; padding: 12px 24px; background: #17cfdc; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Password Reset Request</h1></div>
        <h2>Hello,</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;

    await transporter.sendMail({
        from: `"STEM Inspire" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request",
        html,
    });
};