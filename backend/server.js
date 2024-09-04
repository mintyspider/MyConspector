import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccountKey from './myconspector-firebase-adminsdk-ashvx-82f1ab0443.json' assert { type: 'json' };
import { getAuth } from 'firebase-admin/auth';

import User from './Schema/User.js';

const server = express();
server.use(express.json());
server.use(cors());
const PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

// Formatting the data to be sent to the database
const formatData = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY,
    { expiresIn: '1h', audience: 'your-app', issuer: 'your-app' }
  );
  return {
    accessToken,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// Generating username
const generateUsername = async (email) => {
  let baseUsername = email.split('@')[0];
  let username = baseUsername;
  let count = 0;

  while (await User.exists({ 'personal_info.username': username })) {
    count++;
    username = baseUsername + count;
  }

  return username;
};

// Signing up
server.post('/signup', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Validation
    if (fullname.length < 3) {
      return res.status(403).json({ error: 'Fullname must be at least 3 characters long' });
    }

    if (!email || !emailRegex.test(email)) {
      return res.status(403).json({ error: 'Invalid email format' });
    }

    if (!password || !passwordRegex.test(password)) {
      return res.status(403).json({
        error: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      });
    }

    const username = await generateUsername(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username,
      },
    });

    await user.save();

    return res.status(200).json({ user: formatData(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(500).json({ error: 'Email already exists' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Signing in
server.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ 'personal_info.email': email });
    if (!user) {
      return res.status(403).json({ error: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, user.personal_info.password);
    if (!isMatch) {
      return res.status(403).json({ error: 'Password is incorrect. Please try again' });
    }

    return res.status(200).json(formatData(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Google Auth
server.post('/google-auth', async (req, res) => {
  try {
    const { accessToken } = req.body;
    const decodedUser = await getAuth().verifyIdToken(accessToken);
    const { email, name } = decodedUser;

    let user = await User.findOne({ 'personal_info.email': email }).select(
      'personal_info.fullname personal_info.username google_auth'
    );

    if (user) {
      if (!user.google_auth) {
        return res.status(403).json({ error: 'Log in with email and password because this email was signed up without Google' });
      }
    } else {
      const username = await generateUsername(email);

      user = new User({
        personal_info: {
          fullname: name,
          email,
          username,
        },
        google_auth: true,
      });

      await user.save();
    }

    return res.status(200).json(formatData(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Authentication failed. Try another Google account or log in with email and password',
    });
  }
});

server.listen(PORT, () => {
  console.log('Listening on port => ' + PORT);
  console.log('MongoDB database is connected');
});
