import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/model.js';
import Progress from '../Models/Progress.js';
import CodingExperience from '../Models/CodingExperience.js';
import generateToken from '../Utils/generateToken.js';

// Get current authenticated user's full profile
export const getMe = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const progress = await Progress.findOne({ userId });
    const codingExp = await CodingExperience.findOne({ userId });

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        age: user.age,
        bio: user.bio,
        provider: user.provider,
        isVerified: user.isVerified,
        preferences: user.preferences,
        progress: progress || null,
        codingExperience: codingExp || null,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Register a new user
export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      dob,
      bio,
      avatarUrl,
      preferences,
      // optional coding experience fields
      yearsExperience,
      primaryLanguages,
      secondaryLanguages,
      githubUrl,
      portfolioUrl,
      description
    } = req.body;

    // validate dob range (example: between 1900-01-01 and today)
    let age;
    if (dob) {
      const date = new Date(dob);
      const min = new Date('1900-01-01');
      const max = new Date();
      if (isNaN(date.getTime()) || date < min || date > max) {
        return res.status(400).json({ message: 'Date of birth is invalid' });
      }
      // calculate age in years
      const diff = Date.now() - date.getTime();
      age = new Date(diff).getUTCFullYear() - 1970;
    }

    // enforce gmail-only addresses for manual registration
    if (!/@gmail\.com$/i.test(email)) {
      return res.status(400).json({ message: 'Only valid Gmail accounts can register' });
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
      provider: 'local',
      // additional profile data
      age: age, // undefined if no dob provided
      bio: bio || '',
      avatarUrl: avatarUrl || null,
      preferences: preferences || {}
    });

    await newUser.save();

    // create related documents
    await Progress.create({ userId: newUser._id });
    await CodingExperience.create({ userId: newUser._id });

    // update coding experience if initial fields were provided
    if (
      yearsExperience ||
      (primaryLanguages && primaryLanguages.length) ||
      (secondaryLanguages && secondaryLanguages.length) ||
      githubUrl ||
      portfolioUrl ||
      description
    ) {
      await CodingExperience.findOneAndUpdate(
        { userId: newUser._id },
        {
          yearsExperience: yearsExperience || 0,
          primaryLanguages: primaryLanguages || [],
          secondaryLanguages: secondaryLanguages || [],
          githubUrl: githubUrl || null,
          portfolioUrl: portfolioUrl || null,
          description: description || ''
        },
        { upsert: true }
      );
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        age: newUser.age,
        bio: newUser.bio,
        avatarUrl: newUser.avatarUrl,
        preferences: newUser.preferences,
        isVerified: newUser.isVerified,
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
    // include populated related documents so client can hydrate state
    const user = await User.findOne({ email })
      .populate('progress codingExperiences interactions');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // prevent password login for OAuth-only accounts
    if (user.provider !== 'local') {
      return res.status(400).json({ message: 'Use Google/GitHub login for this account' });
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
        age: user.age,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences,
        isVerified: user.isVerified,
        progress: user.progress,
        codingExperiences: user.codingExperiences,
        interactions: user.interactions,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// Verify email using a signed token (:token should be a JWT with userId)
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired verification token' });
  }
};

// Delete current authenticated user's account and related data
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Promise.all([
      Progress.deleteOne({ userId }),
      CodingExperience.deleteMany({ userId }),
      // remove all interactions by this user
      (await import('../Models/Interaction.js')).default.deleteMany({ userId })
    ]);

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

