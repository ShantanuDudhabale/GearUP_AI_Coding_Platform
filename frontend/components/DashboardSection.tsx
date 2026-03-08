'use client';

import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Flame } from 'lucide-react';
import { DashboardStats } from '@/store/useAppStore';

interface DashboardSectionProps {
  stats: DashboardStats;
}

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}

const StatsCard = ({ icon: Icon, label, value, color }: StatsCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`p-6 rounded-xl border ${color} backdrop-blur-sm`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-white/60 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      </div>
      <Icon className="w-8 h-8 opacity-60" />
    </div>
  </motion.div>
);

export default function DashboardSection({ stats }: DashboardSectionProps) {
  return (
    <section className="w-full px-4 py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Learning Dashboard
          </h2>
          <p className="text-lg text-gray-600 dark:text-white/60">
            Track your progress and celebrate your achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Trophy}
            label="Completed Lessons"
            value={stats.completedLessons}
            color="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700"
          />
          <StatsCard
            icon={Zap}
            label="Saved Code Snippets"
            value={stats.savedCodes}
            color="bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700"
          />
          <StatsCard
            icon={Flame}
            label="Current Streak"
            value={stats.streak}
            color="bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700"
          />
          <StatsCard
            icon={Zap}
            label="Total XP"
            value={stats.xp}
            color="bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-700"
          />
        </div>

        {/* Weak Topics */}
        {stats.weakTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-300 dark:border-orange-700 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">Topics to Review</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.weakTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Badges */}
        {stats.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Badges Earned</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {stats.badges.map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className="p-4 bg-yellow-100 dark:bg-yellow-950/30 border border-yellow-400 dark:border-yellow-700 rounded-lg text-center"
                >
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white capitalize">{badge}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
