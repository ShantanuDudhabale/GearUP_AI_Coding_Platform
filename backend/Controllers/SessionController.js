import Session from '../Models/Session.js';

export const getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await Session.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createOrUpdateSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, title, messages } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }

    const session = await Session.findOneAndUpdate(
      { id: sessionId, userId },
      { title, messages, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Session saved successfully', session });
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const result = await Session.deleteOne({ id: sessionId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
