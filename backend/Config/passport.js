import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../Models/model.js';
import Progress from '../Models/Progress.js';
import generateToken from '../Utils/generateToken.js';

async function ensureProgress(userId) {
  const existing = await Progress.findOne({ userId });
  if (!existing) {
    await Progress.create({ userId });
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0]?.value;
        if (!email) {
          return done(null, false);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            username: profile.displayName || email.split('@')[0],
            email,
            provider: 'google',
            providerId: profile.id,
            avatarUrl: profile.photos && profile.photos[0]?.value,
            isVerified: true
          });
          await user.save();
          await ensureProgress(user._id);
        } else {
          // make sure provider flags are consistent
          user.provider = 'google';
          user.providerId = profile.id;
          user.isVerified = true;
          if (!user.avatarUrl && profile.photos && profile.photos[0]?.value) {
            user.avatarUrl = profile.photos[0].value;
          }
          await user.save();
          await ensureProgress(user._id);
        }

        const token = generateToken(user._id);
        return done(null, { token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback'
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // GitHub may not always provide email in profile; prefer primary email if present
        const email =
          (profile.emails && profile.emails[0]?.value) ||
          `${profile.username}@users.noreply.github.com`;

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            username: profile.displayName || profile.username,
            email,
            provider: 'github',
            providerId: profile.id,
            avatarUrl: profile.photos && profile.photos[0]?.value,
            isVerified: true
          });
          await user.save();
          await ensureProgress(user._id);
        } else {
          user.provider = 'github';
          user.providerId = profile.id;
          user.isVerified = true;
          if (!user.avatarUrl && profile.photos && profile.photos[0]?.value) {
            user.avatarUrl = profile.photos[0].value;
          }
          await user.save();
          await ensureProgress(user._id);
        }

        const token = generateToken(user._id);
        return done(null, { token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../Models/model.js';
import Progress from '../Models/Progress.js';
import CodingExperience from '../Models/CodingExperience.js';
import generateToken from '../Utils/generateToken.js';

// called after successful social login/user existence check
async function findOrCreateUser(profile, provider) {
  const email = profile.emails && profile.emails[0] && profile.emails[0].value;
  if (!email) throw new Error('No email found in profile');

  // try to find existing user
  let user = await User.findOne({ email });
  if (!user) {
    const username = profile.displayName || email.split('@')[0];
    user = new User({
      username,
      email,
      password: '', // social accounts won't use local password
      isVerified: true
    });
    await user.save();
    // create related documents
    await Progress.create({ userId: user._id });
  }
  // always return user plus JWT token
  const token = generateToken(user._id);
  return { user, token };
}

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await findOrCreateUser(profile, 'google');
    // attach token to user object for convenience
    result.user.token = result.token;
    done(null, result.user);
  } catch (err) {
    done(err);
  }
}));

// GitHub strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/api/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await findOrCreateUser(profile, 'github');
    result.user.token = result.token;
    done(null, result.user);
  } catch (err) {
    done(err);
  }
}));

export default passport;