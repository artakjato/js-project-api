import express, { response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ 
      success: false,
      error: 'Email already in use' 
    });
  }

  const salt = bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({ email, password: hashedPassword });
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
  res.status(400).json({
    success: false,
    message: 'Could not create user',
    response: error,
  });
}
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        success: true,
        message: 'Login successful',
        response: {
          email: user.email,
          id: user._id,
          accessToken: user.accessToken,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        response: null,
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
