import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

// OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH2_CLIENT_ID,
  process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN, // Long-lived refresh token from OAuth2 Playground
});
const accessToken = await oauth2Client.getAccessToken(); // Retrieve another of the short-lived access token

// Nodemailer integration - create the SMTP transporter here.
let smtpTransport: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
try {
  smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN,
      accessToken: accessToken.token, // Ensure this is the resolved token
    },
  } as SMTPTransport.Options);
} catch (error) {
  console.error('Failed to create SMTP Transport:', error);
}

// The email-sending function
export async function sendEmail(orderId: string, userEmail: string, title: string) {
  try {
    const info = await smtpTransport.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `delivery: [Order #${orderId}]`,
      html: `<p>Hey,</p>
      <p>Congratulations on your <em>brand new</em><br>
      &nbsp;&nbsp;&nbsp;... &nbsp;<strong>${title}</strong> .</p><br>
        <p>Sincerely,<br/>ayw.corporate</p>`,
    });

    console.log('[email-service] Email sent successfully:', info);
  } catch (error) {
    console.error('[email-service] Failed to send email:', error);
    throw error;
  }
}
