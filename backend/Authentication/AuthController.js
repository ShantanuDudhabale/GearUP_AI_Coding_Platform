import bcrypt from 'bcrypt';
import User from '../Models/model.js';
import generateToken from '../Utils/generateToken.js';

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password, dob } = req.body;

    // validate dob range (example: between 1900-01-01 and today)
    if (dob) {
      const date = new Date(dob);
      const min = new Date('1900-01-01');
      const max = new Date();
      if (isNaN(date.getTime()) || date < min || date > max) {
        return res.status(400).json({ message: 'Date of birth is invalid' });
      }
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      // additional profile data
      dob: dob ? new Date(dob) : undefined
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        dob: newUser.dob,
        token: generateToken(newUser._id)
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        dob: user.dob,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
