import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../Models/model.js';
import Progress from '../Models/Progress.js';
import CodingExperience from '../Models/CodingExperience.js';
import generateToken from '../Utils/generateToken.js';

async function findOrCreateUser(profile, provider) {
  const email = profile.emails && profile.emails[0]?.value;
  if (!email && provider !== 'github') {
    throw new Error('No email found in profile');
  }
  
  // For GitHub, if email is private, use a fallback
  const userEmail = email || `${profile.username}@users.noreply.github.com`;

  let user = await User.findOne({ email: userEmail });

  if (!user) {
    user = new User({
      username: profile.displayName || profile.username || userEmail.split('@')[0],
      email: userEmail,
      provider: provider,
      providerId: profile.id,
      avatarUrl: profile.photos && profile.photos[0]?.value,
      isVerified: true
    });
    await user.save();
    
    // Create related documents
    await Progress.create({ userId: user._id });
    await CodingExperience.create({ userId: user._id }); // Create empty experience
  } else {
    // Update existing user with latest info
    user.provider = provider;
    user.providerId = profile.id;
    user.isVerified = true;
    if (!user.avatarUrl && profile.photos && profile.photos[0]?.value) {
      user.avatarUrl = profile.photos[0].value;
    }
    await user.save();
    
    // Ensure progress exists
    const existingProgress = await Progress.findOne({ userId: user._id });
    if (!existingProgress) {
        await Progress.create({ userId: user._id });
    }
    const existingExp = await CodingExperience.findOne({ userId: user._id });
    if (!existingExp) {
        await CodingExperience.create({ userId: user._id });
    }
  }

  const token = generateToken(user._id);
  return { user, token };
}

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const { user, token } = await findOrCreateUser(profile, 'google');
        return done(null, { ...user.toObject(), token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback'
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const { user, token } = await findOrCreateUser(profile, 'github');
        return done(null, { ...user.toObject(), token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;

export default passport;