const router = require('express').Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const Nursery = require('../models/Nursery');
const Feedback = require('../models/Feedback');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../services/emailService');

// --- USER ROUTES (Customers) ---
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, phoneNumber } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedUser = await User.create({ email, password: hashedPassword, fullName, phoneNumber });
    const token = jwt.sign({ id: savedUser.id, role: 'user' }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        uid: savedUser.id,
        email: savedUser.email,
        displayName: savedUser.fullName,
        phoneNumber: savedUser.phoneNumber,
        role: 'user',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Email not found' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        uid: user.id,
        email: user.email,
        displayName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: 'user',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- PASSWORD RESET ROUTES ---
router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;

    // Check all collections
    let user = await User.findOne({ where: { email } });
    let collection = 'user';
    if (!user) {
      user = await Admin.findOne({ where: { email } });
      collection = 'admin';
    }
    if (!user) {
      user = await Nursery.findOne({ where: { email } });
      collection = 'nursery';
    }

    if (!user)
      return res.status(404).json({ message: 'Email not found. Please check and try again.' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Try to send real email, fallback to console
    let emailSent = false;
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_gmail@gmail.com') {
      try {
        await sendOtpEmail(email, otp);
        emailSent = true;
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
      }
    }

    if (!emailSent) {
      console.log(
        `\n📧 [PASSWORD RESET OTP] Email: ${email} | OTP: ${otp} | Type: ${collection}\n`,
      );
    }

    res.json({
      message: emailSent ? `OTP sent to ${email}` : 'OTP generated (email not configured)',
      otp: emailSent ? undefined : otp, // Only expose OTP in response if email not configured
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check all collections
    let user = await User.findOne({ where: { email } });
    if (!user) user = await Admin.findOne({ where: { email } });
    if (!user) user = await Nursery.findOne({ where: { email } });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ADMIN ROUTES ---
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET);
    res.json({ token, user: { uid: admin.id, email: admin.email, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/admin/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedAdmin = await Admin.create({ email, password: hashedPassword });
    const token = jwt.sign({ id: savedAdmin.id, role: 'admin' }, process.env.JWT_SECRET);
    res.json({ token, user: { uid: savedAdmin.id, email: savedAdmin.email, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- NURSERY ROUTES ---
router.post('/nursery/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const nursery = await Nursery.findOne({ where: { email } });
    if (!nursery) return res.status(400).json({ message: 'Nursery not found' });

    const validPass = await bcrypt.compare(password, nursery.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: nursery.id, role: 'nursery' }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        uid: nursery.id,
        email: nursery.email,
        displayName: nursery.storeName,
        role: 'nursery',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/nursery/signup', async (req, res) => {
  try {
    const { email, password, storeName, licenseNumber, phoneNumber, location } = req.body;

    const existingNursery = await Nursery.findOne({ where: { email } });
    if (existingNursery)
      return res
        .status(400)
        .json({ message: 'Email already exists! Please use a different email or log in.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedNursery = await Nursery.create({
      email,
      password: hashedPassword,
      storeName,
      licenseNumber,
      phoneNumber,
      location,
      status: 'pending',
    });
    const token = jwt.sign({ id: savedNursery.id, role: 'nursery' }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        uid: savedNursery.id,
        email: savedNursery.email,
        displayName: savedNursery.storeName,
        role: 'nursery',
      },
    });
  } catch (err) {
    console.error('Nursery Registration Error:', err);
    res
      .status(500)
      .json({ message: err.errors ? err.errors.map(e => e.message).join(', ') : err.message });
  }
});

// Admin fetching all nurseries
router.get('/nurseries', async (req, res) => {
  try {
    const nurseries = await Nursery.findAll();
    res.json(
      nurseries.map(n => ({
        id: n.id,
        name: n.storeName,
        location: n.location,
        contact: n.email,
        status: n.status,
      })),
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/nurseries/:id/approve', async (req, res) => {
  try {
    await Nursery.update({ status: 'approved' }, { where: { id: req.params.id } });
    res.json({ message: 'Nursery approved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/nurseries/:id/reject', async (req, res) => {
  try {
    await Nursery.update({ status: 'rejected' }, { where: { id: req.params.id } });
    res.json({ message: 'Nursery rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/nurseries/:id', async (req, res) => {
  try {
    const { name, location, contact } = req.body;
    await Nursery.update(
      { storeName: name, location, email: contact },
      { where: { id: req.params.id } },
    );
    res.json({ message: 'Nursery updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/nurseries/:id', async (req, res) => {
  try {
    await Nursery.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Nursery deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ME ROUTE (Unified) ---
router.post('/me', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.json({ user: null });

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;
    let endpointRole = verified.role;

    if (endpointRole === 'admin') {
      user = await Admin.findByPk(verified.id);
    } else if (endpointRole === 'nursery') {
      user = await Nursery.findByPk(verified.id);
    } else {
      user = await User.findByPk(verified.id);
      endpointRole = 'user'; // Default fallback
    }

    if (!user) return res.json({ user: null });

    const safeUser = {
      uid: user.id,
      email: user.email,
      role: endpointRole,
    };

    if (user.fullName) safeUser.displayName = user.fullName;
    if (user.storeName) safeUser.displayName = user.storeName;
    if (user.phoneNumber) safeUser.phoneNumber = user.phoneNumber;

    res.json({ user: safeUser });
  } catch (err) {
    res.json({ user: null });
  }
});

// --- FEEDBACK ROUTES ---

// Submit feedback (public)
router.post('/feedback', async (req, res) => {
  try {
    const { name, email, rating, category, message } = req.body;
    if (!name || !email || !rating || !message) {
      return res.status(400).json({ message: 'Name, email, rating, and message are required.' });
    }
    const feedback = await Feedback.create({
      name,
      email,
      rating: Number(rating),
      category: category || 'General',
      message,
    });
    res.json({ message: 'Feedback submitted successfully!', feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all feedback (admin)
router.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a feedback entry (admin)
router.delete('/feedback/:id', async (req, res) => {
  try {
    await Feedback.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const Contact = require('../models/Contact');

// --- CONTACT ROUTES ---

// Submit contact message (public)
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }
    const contact = await Contact.create({
      name,
      email,
      subject: subject || '(No subject)',
      message,
    });
    res.json({ message: 'Message sent successfully!', contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all contact messages (admin)
router.get('/contact', async (req, res) => {
  try {
    const messages = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a contact message (admin)
router.delete('/contact/:id', async (req, res) => {
  try {
    await Contact.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
