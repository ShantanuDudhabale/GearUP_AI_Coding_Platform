/**
 * Input Validation Middleware
 * Validates email, password, and other user inputs
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateSignup = (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (!username || !validateUsername(username)) {
    return res.status(400).json({ error: 'Username must be 3-20 characters (alphanumeric and underscore only)' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  next();
};

export const validateChatMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'object') {
    return res.status(400).json({ error: 'Invalid message format' });
  }

  if (!message.content || message.content.trim().length === 0) {
    return res.status(400).json({ error: 'Message content cannot be empty' });
  }

  if (message.content.length > 10000) {
    return res.status(400).json({ error: 'Message content is too long (max 10000 characters)' });
  }

  next();
};
