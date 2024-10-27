import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email sending function
export async function POST(request) {
  const { subject, message, subscribers } = await request.json();

  // Log incoming data for debugging
  console.log('Incoming request data:', { subject, message, subscribers });

  // Validate input
  if (!subject || !message || !subscribers || !Array.isArray(subscribers) || subscribers.length === 0) {
    return NextResponse.json({ error: 'Subject, message, and subscribers are required.' }, { status: 400 });
  }

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  try {
    // Send email to each subscriber
    const promises = subscribers.map((subscriber) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: subject,
        html: `
          <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
              <div style="background-color: #1e90ff; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">${subject}</h1>
                <p style="margin: 0; font-size: 16px;">We have an important message for you!</p>
              </div>
              <div style="padding: 20px; line-height: 1.6;">
                <p style="font-size: 16px; color: #333;">${message}</p>
                <p style="margin-top: 20px; font-size: 14px; color: #555;">Thank you for being a part of our community!</p>
              </div>
              <div style="background-color: #f9f9f9; padding: 15px; text-align: center;">
                <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                <a href="#" style="color: #1e90ff; text-decoration: none; font-weight: bold;">Unsubscribe</a>
              </div>
            </div>
          </div>
        `,
      };

      return transporter.sendMail(mailOptions); // Send email for each subscriber
    });

    // Wait for all email promises to complete
    await Promise.all(promises);

    return NextResponse.json({ message: 'Emails sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ error: 'Error sending emails. Please try again later.' }, { status: 500 });
  }
}
