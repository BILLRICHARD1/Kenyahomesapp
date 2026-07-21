import { getTodayKey, getYesterdayKey, getDaysBetween } from './dateUtils';

/**
 * Check and update streak based on user's hydration history
 * This should be called when the app opens
 */
export const checkAndUpdateStreak = async (userData) => {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  
  const { dailyGoal, logs, streaks } = userData;
  
  // Initialize streaks if they don't exist
  if (!streaks) {
    userData.streaks = {
      current: 0,
      longest: 0,
      lastCompletedDate: null,
    };
  }
  
  const yesterdayLog = logs[yesterday] || { intake: 0 };
  const todayLog = logs[today] || { intake: 0 };
  
  const yesterdayMetGoal = yesterdayLog.intake >= dailyGoal;
  const todayMetGoal = todayLog.intake >= dailyGoal;
  
  // If yesterday's goal was met and lastCompletedDate is not today
  if (yesterdayMetGoal && streaks.lastCompletedDate !== today) {
    // Increment streak only if we haven't already counted today
    if (streaks.lastCompletedDate !== yesterday) {
      userData.streaks.current += 1;
      userData.streaks.lastCompletedDate = yesterday;
    }
  }
  
  // If lastCompletedDate is older than yesterday and today's intake is not yet at goal
  if (streaks.lastCompletedDate) {
    const daysSinceLastCompletion = getDaysBetween(streaks.lastCompletedDate, today);
    if (daysSinceLastCompletion > 1 && !todayMetGoal) {
      // Streak is broken
      userData.streaks.current = 0;
    }
  }
  
  // Update longest streak if current is greater
  if (userData.streaks.current > userData.streaks.longest) {
    userData.streaks.longest = userData.streaks.current;
  }
  
  // If today's goal is met, update lastCompletedDate to today
  if (todayMetGoal && streaks.lastCompletedDate !== today) {
    userData.streaks.lastCompletedDate = today;
  }
  
  return userData;
};

/**
 * Check if a specific date's goal was met
 */
export const wasGoalMetOnDate = (userData, dateKey) => {
  const log = userData.logs[dateKey];
  return log ? log.intake >= userData.dailyGoal : false;
};
