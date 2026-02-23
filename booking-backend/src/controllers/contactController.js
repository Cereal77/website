const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Contact = require('../models/Contact');

// Temporary storage for pending verifications (in-memory)
// In production, consider using Redis or a PendingContact collection
const pendingVerifications = new Map();

// Email validation regex - stricter validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

// Validate email format
const isValidEmail = (email) => {
  // Check basic format
  if (!emailRegex.test(email)) return false;
  
  // Check minimum length
  if (email.length < 5) return false;
  
  // Check if it starts or ends with a dot
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  // Check if it has consecutive dots
  if (email.includes('..')) return false;
  
  // Check if local part is too short
  const [localPart] = email.split('@');
  if (localPart.length < 1) return false;
  
  return true;
};

// Create Nodemailer transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Gmail transporter error:', error);
  } else {
    console.log('Gmail transporter ready:', success);
  }
});

// Send Contact Email
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    console.log('Pending verification from:', email);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Store in temporary memory (will be deleted after verification or timeout)
    pendingVerifications.set(verificationToken, {
      name,
      email,
      message,
      createdAt: new Date(),
    });

    console.log('Pending verification stored, token:', verificationToken);

    // Send verification email to user
    const baseURL = process.env.BASE_URL || 'https://ikomyutweb-4.onrender.com';
    const verifyLink = `${baseURL}/api/contact/verify/${verificationToken}`;
    
    const verificationMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Please verify your message',
      html: `
        <h2>Thank You for Contacting Us</h2>
        <p>Hi ${name},</p>
        <p>We received your message. Please verify your email by clicking the button below:</p>
        <p><a href="${verifyLink}" style="background-color: #009432; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a></p>
        <p>Or copy and paste this link:<br><a href="${verifyLink}">${verifyLink}</a></p>
        <p><strong>Your Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        <p>Best regards,<br>The iKomyut Team</p>
      `,
    };

    // Send verification email
    try {
      await transporter.sendMail(verificationMailOptions);
      console.log('Verification email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError.message);
      // Still return success to user, but message won't be verified
    }

    // Always return success to user (they submitted the form)
    res.status(200).json({
      message: 'Thank you! Check your email to verify your message.',
      status: 'ok',
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      message: 'Failed to process your message. Please try again later.',
      error: error.message,
    });
  }
};

// Verify Contact Email
exports.verifyContactEmail = async (req, res) => {
  try {
    const { token } = req.params;

    console.log('Verifying token:', token);

    // Find verification data from temporary storage
    const pendingData = pendingVerifications.get(token);

    if (!pendingData) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    // Create contact in database only after verification
    const contact = await Contact.create({
      name: pendingData.name,
      email: pendingData.email,
      message: pendingData.message,
      isVerified: true,
    });

    console.log('Contact saved to database after verification:', contact._id);

    // Delete from temporary storage
    pendingVerifications.delete(token);

    // Send admin notification email
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New Verified Message from ${contact.name}`,
      html: `
        <h2>New Contact Message (Verified)</h2>
        <p><strong>From:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message.replace(/\n/g, '<br>')}</p>
      `,
    };

    try {
      await transporter.sendMail(adminMailOptions);
      console.log('Admin notification sent');
    } catch (emailError) {
      console.error('Failed to send admin email:', emailError.message);
    }

    // Redirect to success page
    res.send(`
      <html>
        <head>
          <title>Email Verified</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
            .container { text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .success-icon { font-size: 60px; color: #009432; margin-bottom: 20px; }
            h1 { color: #333; margin: 0 0 10px; }
            p { color: #666; margin: 10px 0; }
            a { color: #009432; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h1>Email Verified!</h1>
            <p>Thank you for verifying your email.</p>
            <p>Your message has been received and we will get back to you soon.</p>
            <p><a href="https://ikomyutweb-6.onrender.com">Return to website</a></p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Verification error:', error.message);
    res.status(500).json({
      message: 'Failed to verify email. Please try again.',
      error: error.message,
    });
  }
};

