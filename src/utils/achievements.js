export const getAchievements = (history, overallTimeSpent, overallWordsTyped) => {
  const totalTests = history.length;
  const peakWpm = totalTests > 0 ? Math.max(...history.map(item => item.wpm || 0)) : 0;
  const averageAccuracy = totalTests > 0 
    ? Math.round(history.reduce((sum, item) => sum + (item.accuracy ?? 100), 0) / totalTests)
    : 100;
  const perfectRunsCount = history.filter(item => (item.accuracy ?? 0) === 100).length;

  return [
    {
      id: 'first_test',
      title: 'First Step',
      description: 'Complete 1 typing practice run',
      unlocked: totalTests >= 1,
      emoji: '🐣',
      color: 'cyan'
    },
    {
      id: 'humble_beginnings',
      title: 'Humble Beginnings',
      description: 'Achieve a speed of 30 WPM or more',
      unlocked: peakWpm >= 30,
      emoji: '🐢',
      color: 'lime'
    },
    {
      id: 'ten_tests',
      title: 'Decathlon Typist',
      description: 'Complete 10 typing practice runs',
      unlocked: totalTests >= 10,
      emoji: '🔥',
      color: 'purple'
    },
    {
      id: 'centurion',
      title: 'Centurion Typist',
      description: 'Complete 25 typing practice runs',
      unlocked: totalTests >= 25,
      emoji: '💯',
      color: 'orange'
    },
    {
      id: 'unstoppable_force',
      title: 'Unstoppable Force',
      description: 'Complete 50 typing practice runs',
      unlocked: totalTests >= 50,
      emoji: '💥',
      color: 'magenta'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Achieve a speed of 50 WPM or more',
      unlocked: peakWpm >= 50,
      emoji: '⚡',
      color: 'magenta'
    },
    {
      id: 'sonic',
      title: 'Sonic Velocity',
      description: 'Achieve a speed of 80 WPM or more',
      unlocked: peakWpm >= 80,
      emoji: '🚀',
      color: 'magenta'
    },
    {
      id: 'keyboard_hero',
      title: 'Keyboard Hero',
      description: 'Achieve a speed of 100 WPM or more',
      unlocked: peakWpm >= 100,
      emoji: '👑',
      color: 'purple'
    },
    {
      id: 'godspeed',
      title: 'Godspeed Velocity',
      description: 'Achieve a speed of 120 WPM or more',
      unlocked: peakWpm >= 120,
      emoji: '🌌',
      color: 'cyan'
    },
    {
      id: 'perfect_accuracy',
      title: 'Flawless Flow',
      description: 'Hit 100% accuracy on any practice run',
      unlocked: perfectRunsCount >= 1,
      emoji: '🎯',
      color: 'purple'
    },
    {
      id: 'untouchable',
      title: 'Untouchable Skill',
      description: 'Hit 100% accuracy on 5 practice runs',
      unlocked: perfectRunsCount >= 5,
      emoji: '🏆',
      color: 'orange'
    },
    {
      id: 'steady_hands',
      title: 'Steady Hands',
      description: 'Complete a run with 40+ WPM and 100% accuracy',
      unlocked: history.some(item => (item.wpm >= 40) && (item.accuracy ?? 0) === 100),
      emoji: '🧘',
      color: 'lime'
    },
    {
      id: 'accuracy_master',
      title: 'Precision Master',
      description: 'Maintain 95%+ average accuracy (min 5 runs)',
      unlocked: totalTests >= 5 && averageAccuracy >= 95,
      emoji: '🔮',
      color: 'cyan'
    },
    {
      id: 'perfectionist',
      title: 'Flawless Habit',
      description: 'Maintain 98%+ average accuracy (min 10 runs)',
      unlocked: totalTests >= 10 && averageAccuracy >= 98,
      emoji: '💎',
      color: 'purple'
    },
    {
      id: 'word_smith',
      title: 'Word Smith',
      description: 'Accumulate a total of 1,000 words practiced',
      unlocked: overallWordsTyped >= 1000,
      emoji: '📚',
      color: 'orange'
    },
    {
      id: 'lexicon_master',
      title: 'Lexicon Master',
      description: 'Accumulate a total of 10,000 words practiced',
      unlocked: overallWordsTyped >= 10000,
      emoji: '📖',
      color: 'purple'
    },
    {
      id: 'daily_grind',
      title: 'Daily Grind',
      description: 'Accumulate 5 minutes of practice time',
      unlocked: overallTimeSpent >= 300,
      emoji: '☕',
      color: 'lime'
    },
    {
      id: 'marathon',
      title: 'Zen Master',
      description: 'Accumulate 15 minutes of typing practice',
      unlocked: overallTimeSpent >= 900,
      emoji: '🧸',
      color: 'cyan'
    },
    {
      id: 'time_lord',
      title: 'Time Lord',
      description: 'Accumulate 1 hour of typing practice',
      unlocked: overallTimeSpent >= 3600,
      emoji: '⏳',
      color: 'orange'
    }
  ];
};
