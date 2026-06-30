// Creates (or promotes) an admin user.
// Usage:
//   node seed/createAdmin.js
//   node seed/createAdmin.js --email admin@trailmark.com --password Secret123 --username "Admin"
//
// If a user with this email already exists, it just promotes them to admin
// (and resets the password if --password is provided). Otherwise it creates
// a brand new, pre-verified admin user.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const readline = require('readline');
const User = require('../models/User');

dotenv.config();

// ─── Parse CLI args (--key value) ────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
};

const prompt = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not set. Add it to your .env file first.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let email = getArg('email');
    let password = getArg('password');
    let username = getArg('username');
    let contactNumber = getArg('contact');

    // Fall back to interactive prompts if not passed as flags
    if (!email) email = await prompt('Admin email: ');
    if (!password) password = await prompt('Admin password (min 6 chars): ');
    if (!username) username = (await prompt('Admin name [Admin]: ')) || 'Admin';
    if (!contactNumber) contactNumber = (await prompt('Contact number [0000000000]: ')) || '0000000000';

    if (!email || !password || password.length < 6) {
      console.error('A valid email and a password of at least 6 characters are required.');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const existing = await User.findOne({ email });

    if (existing) {
      existing.role = 'admin';
      existing.isVerified = true;
      if (getArg('password')) {
        existing.password = hashedPassword;
      }
      await existing.save();
      console.log(`Existing user "${email}" has been promoted to admin.`);
    } else {
      await User.create({
        username,
        contactNumber,
        email,
        password: hashedPassword,
        role: 'admin',
        isVerified: true, // skip OTP flow for seeded admins
      });
      console.log(`Admin user created: ${email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

run();
