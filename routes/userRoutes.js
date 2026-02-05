import express, { response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ 
      success: false,
      error: 'Email already in use' 
    });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({ email: normalizedEmail, password: hashedPassword });
  await user.save();

  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    response: {
      email: user.email,
      id: user._id,
      accessToken: user.accessToken,
    },
  });
} catch (error) {
  return res.status(400).json({
    success: false,
    message: 'Sorry, I could not create a user',
    response: error.message,
  });
}
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (user && passwordMatch) {
      return res.json({
        success: true,
        message: 'Login successful',
        response: {
          email: user.email,
          id: user._id,
          accessToken: user.accessToken,
        },
      });
    } 
    
    else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        info: 'https://http.dog/401',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      response: error,
    });
  }
});

export default router;
