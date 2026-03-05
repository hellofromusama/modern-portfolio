import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'hellofromusama@gmail.com',
        pass: process.env.EMAIL_PASS || 'your_app_password_here' // You'll need to create an app password
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'hellofromusama@gmail.com',
      to: 'hellofromusama@gmail.com',
      subject: `Portfolio Contact: ${subject || 'New Message'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">New Portfolio Contact Form Submission</h2>
          <hr style="border: 1px solid #eee;">

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'No subject'}</p>

          <h3 style="color: #555;">Message:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
            ${message.replace(/\n/g, '<br>')}
          </div>

          <hr style="border: 1px solid #eee; margin-top: 20px;">
          <p style="color: #666; font-size: 12px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
      text: `
Portfolio Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

Message:
${message}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!'
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send email. Please try again.'
    }, { status: 500 });
  }
}