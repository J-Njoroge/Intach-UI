# Job Platform

A scalable web-based job platform connecting Applicants, Recruiters, and Admins, featuring skill-based job recommendations, secure PDF resume uploads, M-Pesa premium payments, and robust user management. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it prioritizes security, performance, and user experience.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Key Code Snippets](#key-code-snippets)
  - [API Route: Job Application](#api-route-job-application)
  - [Payment: M-Pesa Integration](#payment-m-pesa-integration)
  - [Models: Application and User](#models-application-and-user)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Roles**:
  - **Applicants**: Browse jobs, apply with SOP and PDF resumes, purchase premium subscriptions.
  - **Recruiters**: Post, manage, and delete jobs, review applications.
  - **Admins**: Oversee users and jobs system-wide.
- **Job Recommendations**: Matches Applicants to jobs based on skills.
- **Secure File Uploads**: Validates PDF resumes using Multer.
- **M-Pesa Payments**: Processes premium subscriptions via STK Push (sandbox).
- **Security**: JWT authentication, bcrypt password hashing, input validation.
- **Notifications**: Real-time feedback via `SetPopupContext`.

## Technologies
- **Frontend**: React, Material-UI, Axios
- **Backend**: Node.js, Express.js, Multer (file uploads)
- **Database**: MongoDB, Mongoose
- **Authentication**: jsonwebtoken, bcrypt
- **Payment**: M-Pesa STK Push API (sandbox)
- **Testing**: Postman, MongoDB Compass
- **Environment**: dotenv for secure configuration

## Installation
### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Postman (for testing)
- M-Pesa sandbox credentials

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/job-platform.git
   cd job-platform


Install Dependencies:

Backend:cd backend
npm install


Frontend:cd ../frontend
npm install




Configure Environment Variables:

Create backend/.env with:MONGO_URI=mongodb://localhost:27017/jobPlatform
JWT_SECRET=your_jwt_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
PORT=5000




Run MongoDB:

Start MongoDB locally (mongod) or use MongoDB Atlas.


Start the Application:

Backend:cd backend
npm start


Runs on http://localhost:5000.


Frontend:cd frontend
npm start


Runs on http://localhost:3000.




Seed Test Data (Optional):

Use MongoDB Compass to add test users (e.g., email: "applicant@test.com", password: "password123", type: "applicant").



Key Code Snippets
Below are critical implementations showcasing the system’s core functionality, security, and data management.
API Route: Job Application
This route (POST /api/jobs/:jobId/applications) in backend/routes/job.js handles Applicant job applications, including PDF resume uploads, with JWT authentication and Multer validation.
// File: backend/routes/job.js
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const Job = require('../models/Job');
const Application = require('../models/Application');
const multer = require('multer');
const path = require('path');

// Configure Multer for PDF uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('document');

router.post('/:jobId/applications', jwtAuth, upload, async (req, res) => {
  const { sop } = req.body;
  const { jobId } = req.params;
  const userId = req.user._id;
  const documentPath = req.file ? req.file.path : null;

  try {
    if (req.user.type !== 'applicant') {
      return res.status(403).json({ success: false, message: 'Only applicants can apply' });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'Already applied' });
    }
    if (job.maxApplicants <= job.applications.length || new Date(job.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Application closed' });
    }
    const application = new Application({
      userId,
      recruiterId: job.userId,
      jobId,
      sop,
      document: documentPath,
      status: 'applied',
      dateOfApplication: new Date(),
    });
    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

Purpose: This route ensures secure, Applicant-only job applications with PDF validation, integrating frontend (JobTile.js), backend, and MongoDB. It’s tested with Postman (Section 4.4.2).
Payment: M-Pesa Integration
This code (POST /api/payment) in backend/routes/payment.js implements M-Pesa STK Push for premium subscriptions, using sandbox credentials and HTTPS requests.
// File: backend/routes/payment.js
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const PaymentModel = require('../models/PaymentModel');
const axios = require('axios');
require('dotenv').config();

router.post('/', jwtAuth, async (req, res) => {
  const { phone, amount } = req.body;
  const userId = req.user._id;

  try {
    // Validate input
    if (!phone || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid phone or amount' });
    }

    // Generate M-Pesa access token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const { data: { access_token } } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` },
    });

    // Prepare STK Push request
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');
    const stkPushData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: 'https://your-callback-url.com/callback',
      AccountReference: `JobPlatform-${userId}`,
      TransactionDesc: 'Premium Subscription',
    };

    // Initiate STK Push
    const { data } = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', stkPushData, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (data.ResponseCode === '0') {
      // Save payment record
      const payment = new PaymentModel({ userId, phone, amount, dateOfPayment: new Date() });
      await payment.save();
      res.json({ success: true, payment });
    } else {
      res.status(400).json({ success: false, message: 'Payment initiation failed' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Payment error' });
  }
});

Purpose: This enables secure payment processing for premium features, critical for monetization. It’s tested in the M-Pesa sandbox with Postman (Section 4.4.4).
Models: Application and User
These Mongoose schemas (Application.js and User.js) define the data structure for applications and users, ensuring data integrity and relationships.
// File: backend/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  sop: { type: String, required: true, maxLength: 1000 },
  document: { type: String }, // Path to PDF resume
  status: { type: String, enum: ['applied', 'accepted', 'rejected'], default: 'applied' },
  dateOfApplication: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);

// File: backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['applicant', 'recruiter', 'admin'], required: true },
  dateOfCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

Purpose: These models enforce data validation and relationships (e.g., ref for userId), enabling secure and scalable data management. They support all API routes and are verified with MongoDB Compass.
API Endpoints
Authentication

POST /api/auth/signup: Register a user.
POST /api/auth/login: Authenticate and return JWT.

Jobs

POST /api/jobs: Create a job (Recruiter, JWT).
GET /api/jobs/recommended: Skill-based job recommendations (Applicant, JWT).
DELETE /api/jobs/:jobId: Delete a job (Recruiter, JWT).
POST /api/jobs/:jobId/applications: Apply with SOP and PDF (Applicant, JWT).

Payments

POST /api/payment: M-Pesa STK Push payment (Applicant/Recruiter, JWT).

Admin

GET /api/admin/users: List users (Admin, JWT).
DELETE /api/admin/jobs/:jobId: Delete any job (Admin, JWT).

Testing

Tool: Postman
Approach:
Unit Testing: Validated endpoints (e.g., POST /api/auth/login).
Integration Testing: Chained workflows (login → apply → update status).
Security Testing: Tested unauthorized access (e.g., 401 for missing JWT).
Performance Testing: Simulated load on GET /api/jobs.


Test Case Example:
Endpoint: POST /api/jobs/:jobId/applications
Input: Form-data with PDF, SOP, JWT
Expected: 200 OK, application saved
Result: PDF validated, non-PDFs rejected


Verification: MongoDB Compass for database checks.
Documentation: Section 4.4, CHAPTER_FOUR in progress.docx.

Project Structure
job-platform/
├── backend/
│   ├── models/ (User.js, Job.js, Application.js, PaymentModel.js)
│   ├── routes/ (auth.js, job.js, payment.js, admin.js)
│   ├── middleware/ (jwtAuth.js)
│   ├── uploads/ (PDF storage)
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/ (JobTile.js, PostedJobs.js, Payment.js, Login.js)
│   │   ├── App.js
│   │   └── index.js
├── media/ (screenshots)
├── CHAPTER_FOUR in progress.docx
└── README.md

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
MIT License. See LICENSE for details.```
