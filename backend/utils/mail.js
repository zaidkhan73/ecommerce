import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";
import sgMail from "@sendgrid/mail";
import { v4 as uuidv4 } from "uuid";


dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// Create a test account or replace with real credentials.
// SendGrid transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASS,
  },
});


export const sendPasswordMail = async (to, otp, username) => {
  try {
    const response = await axios.post(
      process.env.MAIL_SERVER_ENDPOINT,
      {
        to,
        subject: "Reset your password",
        html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 30px 20px;
            }
            
            .header h1 {
                margin-bottom: 10px;
                font-size: 28px;
                font-weight: 600;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #555;
            }
            
            .message {
                font-size: 16px;
                color: #666;
                margin-bottom: 30px;
                line-height: 1.5;
            }
            
            .otp-container {
                background-color: #f8f9ff;
                border: 2px dashed #667eea;
                border-radius: 10px;
                padding: 25px;
                margin: 30px 0;
                text-align: center;
            }
            
            .otp-label {
                font-size: 14px;
                color: #888;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #667eea;
                letter-spacing: 8px;
                margin: 10px 0;
                font-family: 'Courier New', monospace;
            }
            
            .otp-validity {
                font-size: 12px;
                color: #999;
                margin-top: 10px;
            }
            
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                color: #856404;
            }
            
            .security-tips {
                background-color: #e8f4fd;
                border-left: 4px solid #3498db;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
            }
            
            .security-tips h3 {
                color: #2980b9;
                margin-bottom: 10px;
                font-size: 16px;
            }
            
            .security-tips ul {
                padding-left: 20px;
            }
            
            .security-tips li {
                font-size: 14px;
                color: #34495e;
                margin-bottom: 5px;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #eee;
            }
            
            .footer p {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
            }
            
            .footer .contact {
                font-size: 12px;
                color: #999;
            }
            
            .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            
            .button:hover {
                transform: translateY(-2px);
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                }
                
                .content {
                    padding: 20px 15px;
                }
                
                .otp-code {
                    font-size: 28px;
                    letter-spacing: 4px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🍴 Agnishikha Password Reset</h1>
                <p>Secure your food delivery account</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello ${username || "User"},
                </div>
                
                <div class="message">
                    We received a request to reset your Agnishikha account password. To keep your 
                    food delivery account secure, please use the One-Time Password (OTP) below:
                </div>
                
                <div class="otp-container">
                    <div class="otp-label">Your OTP Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="otp-validity">Valid for 10 minutes</div>
                </div>
                
                <div class="warning">
                    ⚠️ <strong>Security Notice:</strong> If you didn't request this password reset, 
                    please ignore this email and your password will remain unchanged.
                </div>
                
                <div class="security-tips">
                    <h3>🛡️ Security Tips:</h3>
                    <ul>
                        <li>Never share your OTP with anyone</li>
                        <li>Our team will never ask for your OTP over phone or email</li>
                        <li>Complete the password reset process within 10 minutes</li>
                        <li>Use a strong, unique password for your account</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated message from Agnishikha Food Delivery.</p>
                <div class="contact">
                    Need help? Contact us at support@Agnishikha.com<br>
                    © 2024 Agnishikha. All rights reserved.
                </div>
            </div>
        </div>
    </body>
    </html>`,
        from: process.env.EMAIL,
        smtpId: process.env.SMTP_ID
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_MAIL_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.log("error in sending email:", error.message);
  }
};




export const sendVerificationMail = async (to, otp) => {
  const msg = {
    to, // Recipient
    from: {
      email: process.env.FROM_EMAIL,   // verified sender email
      name: "Agnishikha"               // optional, app name
    }, // Verified sender
    subject: "Your OTP for Verification",
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending verification email to ${to}:`, error);
    if (error.response) console.error(error.response.body);
  }
};


export const sendNewOrderMail = async (
  orderId,
  userEmail,
  payment_method,
  total_amount,
  online_amount,
  cod_amount,
  discount,
  address,
  timestamp = new Date().toLocaleString()
) => {
  const adminMail = process.env.ADMIN_EMAIL; // ADD THIS IN .env FILE

  const mailOption = {
    from: process.env.EMAIL,
    to: adminMail,
    subject: `🛒 New Order Placed - Order #${orderId}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>New Order Notification</title>
<style>
  body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
  .email-container {
    max-width: 650px;
    background: #fff;
    margin: auto;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #eee;
  }
  .header {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    padding: 20px;
    text-align: center;
    color: white;
  }
  .content {
    padding: 25px;
  }
  .info-box {
    margin-top: 15px;
    padding: 20px;
    background: #eef2ff;
    border-left: 5px solid #4f46e5;
    border-radius: 6px;
  }
  .info-box p { margin: 6px 0; font-size: 15px; }
  .footer {
    background: #fafafa;
    padding: 18px;
    text-align: center;
    font-size: 12px;
    color: #777;
    border-top: 1px solid #ddd;
  }
</style>
</head>

<body>
  <div class="email-container">
    <div class="header">
      <h2>📦 New Order Received!</h2>
    </div>

    <div class="content">
      <p>Hello Admin,</p>
      <p>A new order has been successfully placed on Agnishikha Store.</p>

      <div class="info-box">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <p><strong>Payment Method:</strong> ${payment_method}</p>
        <p><strong>Total Amount:</strong> ₹${total_amount}</p>
        <p><strong>Paid Now:</strong> ₹${online_amount}</p>
        <p><strong>COD Remaining:</strong> ₹${cod_amount}</p>
        <p><strong>Discount:</strong> ₹${discount}</p>
        <p><strong>Delivery Address:</strong> ${address}</p>
        <p><strong>Order Time:</strong> ${timestamp}</p>
      </div>

      <p style="margin-top: 25px;">Please review and process the order from the admin dashboard.</p>
    </div>

    <div class="footer">
      © 2024 Agnishikha. Auto Notification | Do not reply
    </div>
  </div>
</body>
</html>`
  };

  return sendMailPromise(mailOptions);
};


export const sendDeliveryOtpMail = async (
  userName,
  userEmail,
  orderId,
  otp,
  timestamp = new Date().toLocaleString()
) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: `🚚 Delivery Verification OTP - Order #${orderId}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Delivery OTP</title>
<style>
  body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
  .email-container {
    max-width: 650px;
    background: #fff;
    margin: auto;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #eee;
  }
  .header {
    background: linear-gradient(135deg, #16a34a, #22c55e);
    padding: 20px;
    text-align: center;
    color: white;
  }
  .content {
    padding: 25px;
  }
  .otp-box {
    margin-top: 20px;
    padding: 20px;
    background: #dcfce7;
    border-left: 5px solid #16a34a;
    border-radius: 6px;
    text-align: center;
  }
  .otp-code {
    font-size: 32px;
    letter-spacing: 5px;
    font-weight: bold;
    color: #166534;
  }
  .footer {
    background: #fafafa;
    padding: 18px;
    text-align: center;
    font-size: 12px;
    color: #777;
    border-top: 1px solid #ddd;
  }
</style>
</head>

<body>
  <div class="email-container">
    <div class="header">
      <h2>🚚 Order Out for Delivery</h2>
    </div>

    <div class="content">
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Your order <strong>#${orderId}</strong> is now out for delivery 🎉</p>
      <p>Please provide the OTP below to the delivery person upon arrival:</p>

      <div class="otp-box">
        <p class="otp-code">${otp}</p>
      </div>

      <p style="margin-top: 5px;">Timestamp: <strong>${timestamp}</strong></p>
      
      <p style="margin-top: 25px;">⚠️ Keep this OTP confidential. Do not share with anyone except the delivery partner.</p>
    </div>

    <div class="footer">
      © 2024 Agnishikha. Secure Delivery Notification
    </div>
  </div>
</body>
</html>`
  };

  return sendMailPromise(mailOptions);
};
