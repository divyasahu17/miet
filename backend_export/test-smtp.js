import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

emailTransporter.verify((error, success) => {
  if (error) {
    console.log('SMTP configuration error:', error.message);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});
