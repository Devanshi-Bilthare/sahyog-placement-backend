const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const Contact = require('../models/contactModel');  // Assuming this is the correct path

const createEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate input
  if (!name || !email || !phone || !subject || !message) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Create a new enquiry in the database
  const enquiry = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
  });

  // Configure the email transport using nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service
    auth: {
      user: 'devanshibilthare@gmail.com', // your email address
      pass: 'aknqibzvlmsdypmf', // your email password
    },
  });

  // Define the email options
  const mailOptions = {
    from: email, // sender address
    to: 'devanshibilthare@gmail.com', // owner's email address
    subject: `sahyog placement New Enquiry: ${subject}`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Subject: ${subject}
      Message: ${message}
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500);
      throw new Error('Failed to send email');
    } else {
      res.status(201).json({
        message: 'Enquiry created and email sent successfully',
        enquiry,
      });
    }
  });
});

const getAll = asyncHandler(async (req, res) => {
    const allEnquiry = await Contact.find()

    res.json(allEnquiry)
});

module.exports = { createEnquiry,getAll };
