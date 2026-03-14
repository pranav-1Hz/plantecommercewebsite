const router = require('express').Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const Nursery = require('../models/Nursery');
const Order = require('../models/Order'); // Added Order model import
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
      message: emailSent
        ? `OTP sent to ${email}`
        : 'Email delivery failed. OTP is shown below for debugging.',
      otp: emailSent ? undefined : otp, // Fallback for debugging
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;
    if (otp) otp = otp.trim();

    // Check all collections
    let user = await User.findOne({ where: { email } });
    if (!user) user = await Admin.findOne({ where: { email } });
    if (!user) user = await Nursery.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found in any collection' });
    }

    if (user.otp !== otp) {
      console.log(`❌ OTP Mismatch: Provided "${otp}" | Database "${user.otp}"`);
      return res.status(400).json({ message: 'The OTP code you entered is incorrect' });
    }

    if (new Date(user.otpExpires).getTime() < Date.now()) {
      console.log(
        `❌ OTP Expired: Exp "${new Date(
          user.otpExpires,
        ).toLocaleString()}" | Now "${new Date().toLocaleString()}"`,
      );
      return res.status(400).json({ message: 'This OTP has expired. Please request a new one.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
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
        phoneNumber: n.phoneNumber,
        status: n.status,
        totalSales: n.totalSales,
        rating: n.rating,
        flowerPotAvailable: n.flowerPotAvailable !== false,
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

router.put('/nurseries/:id/flower-pot', async (req, res) => {
  try {
    const { available } = req.body;
    await Nursery.update({ flowerPotAvailable: !!available }, { where: { id: req.params.id } });
    res.json({ message: 'Flower pot availability updated', flowerPotAvailable: !!available });
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
      totalSales: user.totalSales,
      rating: user.rating,
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

// Submit feedback (General fallback or specific)
router.post('/feedback', async (req, res) => {
  try {
    const { name, email, rating, category, message, nurseryId, orderId, userId } = req.body;
    if (!name || !email || !rating || !message) {
      return res.status(400).json({ message: 'Name, email, rating, and message are required.' });
    }

    const feedback = await Feedback.create({
      name,
      email,
      rating: Number(rating),
      category: category || (nurseryId ? 'Nursery Rating' : 'General'),
      message,
      nurseryId: nurseryId || null,
      orderId: orderId || null,
      userId: userId || null,
    });

    // If linked to an order, update order and nursery ratings
    if (orderId && nurseryId) {
      await Order.update({ isRated: true }, { where: { id: orderId } });
      const allFeedback = await Feedback.findAll({ where: { nurseryId } });
      const totalRating = allFeedback.reduce((sum, f) => sum + f.rating, 0);
      const avgRating = (totalRating / allFeedback.length).toFixed(1);
      await Nursery.update({ rating: avgRating }, { where: { id: nurseryId } });
    }

    res.json({ message: 'Feedback submitted successfully!', feedback });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError' && (req.body.orderId || req.body.nurseryId)) {
      return res.status(400).json({ message: 'You have already rated this order.' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Get feedback for a specific nursery
router.get('/feedback/nursery/:nurseryId', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { nurseryId: req.params.nurseryId },
      order: [['createdAt', 'DESC']],
    });
    res.json(feedbacks);
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

// --- ORDER ROUTES ---

// Place order (Customer)
router.post('/orders', async (req, res) => {
  try {
    const {
      userId,
      nurseryId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      totalAmount,
      items,
    } = req.body;

    if (!userId || !nurseryId || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing order details' });
    }

    const order = await Order.create({
      userId,
      nurseryId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      totalAmount,
      items, // Expecting JSON array
      status: 'pending',
    });

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user orders (History)
router.get('/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get nursery orders (Dashboard)
router.get('/orders/nursery/:nurseryId', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { nurseryId: req.params.nurseryId },
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (Nursery)
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // 1. Fetch the order to see current status and nursery
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const previousStatus = order.status;

    // 2. Update the status
    order.status = status;
    await order.save();

    // 3. Logic: Adjust nursery sales based on status change
    if (status === 'delivered' && previousStatus !== 'delivered') {
      // Add to sales if newly delivered
      const nursery = await Nursery.findByPk(order.nurseryId);
      if (nursery) {
        const currentSales = Number(nursery.totalSales || 0);
        const orderAmount = Number(order.totalAmount || 0);
        nursery.totalSales = currentSales + orderAmount;
        await nursery.save();
      }
    } else if (previousStatus === 'delivered' && status !== 'delivered') {
      // Subtract from sales if was delivered but now cancelled/changed back
      const nursery = await Nursery.findByPk(order.nurseryId);
      if (nursery) {
        const currentSales = Number(nursery.totalSales || 0);
        const orderAmount = Number(order.totalAmount || 0);
        nursery.totalSales = Math.max(0, currentSales - orderAmount); // Prevent negative sales
        await nursery.save();
      }
    }

    res.json({ message: 'Order status updated', status: order.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- THE END ---

module.exports = router;
