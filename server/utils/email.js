const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ─── SEND OTP EMAIL ──────────────────────────────────────────────────────────
const sendOtpEmail = async (email, otp, action) => {
  try {
    const subject =
      action === 'account_verification'
        ? 'Verify Your Account - OTP Code'
        : 'Activity Booking Confirmation - OTP Code';

    const text =
      action === 'account_verification'
        ? `Welcome! Your OTP for account verification is: ${otp}\n\nThis code expires in 5 minutes.`
        : `Your OTP for activity booking confirmation is: ${otp}\n\nThis code expires in 5 minutes.`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email} for action: ${action}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${email}:`, error);
    throw error;
  }
};

// ─── SEND BOOKING CONFIRMATION ───────────────────────────────────────────────
const sendBookingConfirmation = async (userEmail, userName, activityName, date, startTime, endTime) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Booking Confirmed - ${activityName}`,
      text: `Hello ${userName},\n\nYour booking has been confirmed!\n\nActivity: ${activityName}\nDate: ${date}\nTime: ${startTime} - ${endTime}\n\nThank you for booking with us!`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending booking confirmation to ${userEmail}:`, error);
    throw error;
  }
};

// ─── SEND BOOKING CANCELLATION ───────────────────────────────────────────────
const sendBookingCancellation = async (userEmail, userName, activityName, reason) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Booking Cancelled - ${activityName}`,
      text: `Hello ${userName},\n\nUnfortunately your booking for "${activityName}" has been cancelled.\n\nReason: ${reason}\n\nIf you have any questions, please contact us.\n\nThank you.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking cancellation email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending cancellation email to ${userEmail}:`, error);
    throw error;
  }
};

module.exports = { sendOtpEmail, sendBookingConfirmation, sendBookingCancellation };
