import Interaction from '../Models/Interaction.js';
import Progress from '../Models/Progress.js';

export const createInteraction = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      type,
      questionText,
      questionType,
      detectedLanguage,
      dificultyLevel,
      chatHistory,
      // search-related fields
      searchQuery,
      searchFilters,
      searchResultsCount,
      topic,
      responseTimeMs,
      feedback,
      // progress-related fields
      completionPercentage,
      xp_points,
      level,
      solvedQuestions,
      strikeCount,
      HighestStreak,
      ExamplesSolved,
      achievements,
      favoriteLanguages,
      sessionId
    } = req.body;

    // Create interaction document
    const interaction = await Interaction.create({
      userId,
      type,
      questionText,
      questionType,
      detectedLanguage,
      dificultyLevel,
      chatHistory: chatHistory || [],
      searchQuery: searchQuery || null,
      searchFilters: searchFilters || {},
      searchResultsCount: searchResultsCount ?? null,
      topic: topic || null,
      responseTimeMs: responseTimeMs ?? null,
      feedback: feedback || ''
    });

    // Update progress stats for this user
    const progress = await Progress.findOne({ userId });

    if (progress) {
      const updates = {
        totalInteractions: (progress.totalInteractions || 0) + 1,
        lastInteraction: new Date()
      };

      if (type === 'like') updates.likes = (progress.likes || 0) + 1;
      else if (type === 'dislike') updates.dislikes = (progress.dislikes || 0) + 1;

      if (detectedLanguage) {
        const current = progress.languageStats.get(detectedLanguage) || 0;
        progress.languageStats.set(detectedLanguage, current + 1);
      }

      if (dificultyLevel) {
        const current = progress.difficultyStats.get(dificultyLevel) || 0;
        progress.difficultyStats.set(dificultyLevel, current + 1);
      }

      if (topic) {
        const current = progress.topicStats.get(topic) || 0;
        progress.topicStats.set(topic, current + 1);
      }

      // Sync specific fields if provided
      const syncFields = {
        completionPercentage, xp_points, level, solvedQuestions,
        strikeCount, HighestStreak, ExamplesSolved, achievements,
        favoriteLanguages
      };
      
      Object.entries(syncFields).forEach(([key, val]) => {
        if (val !== undefined) progress[key] = val;
      });

      if (sessionId) progress.sessions.push(sessionId);

      // Recompute "mostly interacted" helpers
      const entriesToMax = (entries) => {
        let bestKey = null, bestVal = -Infinity;
        for (const [key, value] of entries) {
          if (value > bestVal) { bestVal = value; bestKey = key; }
        }
        return bestKey;
      };

      progress.mostlyIteractedLanguage = entriesToMax(Array.from(progress.languageStats.entries()));
      progress.mostlyIteractedDifficulty = entriesToMax(Array.from(progress.difficultyStats.entries()));
      progress.mostlyIteractedTopic = entriesToMax(Array.from(progress.topicStats.entries()));

      await progress.save();
    }

    return res.status(201).json({
      message: 'Interaction stored successfully',
      interaction
    });

    return res.status(201).json({
      message: 'Interaction stored successfully',
      interaction
    });
  } catch (error) {
    console.error('Create interaction error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUserInteractions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      searchQuery,
      topic,
      detectedLanguage,
      dificultyLevel,
      type
    } = req.query;

    const filter = { userId };

    if (searchQuery) {
      // case-insensitive partial match on stored search query
      filter.searchQuery = { $regex: searchQuery, $options: 'i' };
    }
    if (topic) {
      filter.topic = topic;
    }
    if (detectedLanguage) {
      filter.detectedLanguage = detectedLanguage;
    }
    if (dificultyLevel) {
      filter.dificultyLevel = dificultyLevel;
    }
    if (type) {
      filter.type = type;
    }

    const interactions = await Interaction.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'User interactions fetched successfully',
      interactions
    });
  } catch (error) {
    console.error('Get interactions error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


