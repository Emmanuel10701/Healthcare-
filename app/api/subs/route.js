import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '../../../libs/prisma'; // Adjust the import according to your project structure

export async function POST(request) {
  const { email } = await request.json();

  // Validate email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  try {
    // Check if the email already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return NextResponse.json({ error: 'Email already exists.' }, { status: 409 }); // Conflict status
    }

    // Create a new subscription
    const subscription = await prisma.subscription.create({
      data: {
        email,
      },
    });

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject = 'Welcome to Prescripto!';
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/assets/assets_frontend/logo.svg`; // Ensure this points to the correct URL

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #1e90ff; padding: 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">
                <img src="${logoUrl}" alt="Logo" width="176" height="50" />
              </h1>
              <p style="margin: 0; font-size: 16px;">Thank you for subscribing!</p>
            </div>
            <div style="padding: 20px; line-height: 1.6;">
              <p style="font-size: 16px; color: #333;">
                Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
              </p>
              <p style="margin-top: 20px; font-size: 14px; color: #555;">Stay tuned for updates!</p>
              <a href="http://localhost:3000/allsoctors" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #1e90ff; color: white; text-decoration: none; border-radius: 5px;">Visit Our Doctors</a>
            </div>
            <div style="background-color: #f9f9f9; padding: 15px; text-align: center;">
              <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
              <a href="#" style="color: #1e90ff; text-decoration: none; font-weight: bold;">Unsubscribe</a>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions); // Send email

    return NextResponse.json({ message: 'Subscription successful!', subscription }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription or sending email:', error);
    return NextResponse.json({ error: 'Subscription failed. Please try again later.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all subscriptions ordered from the latest to the oldest
    const subscriptions = await prisma.subscription.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions.' }, { status: 500 });
  }
}
