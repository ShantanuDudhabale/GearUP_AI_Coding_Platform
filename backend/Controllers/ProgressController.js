import Progress from '../Models/Progress.js';

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found for user' });
    }

    return res.status(200).json({
      message: 'User progress fetched successfully',
      progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

