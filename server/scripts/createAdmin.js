const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    const email = 'admin@plantshop.com';
    const password = 'admin123'; // Default password

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    console.log(`Admin created successfully:\nEmail: ${email}\nPassword: ${password}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
