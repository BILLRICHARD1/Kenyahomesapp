/**
 * Get today's date as YYYY-MM-DD
 */
export const getTodayKey = () => {
  const today = new Date();
  return formatDateKey(today);
};

/**
 * Get yesterday's date as YYYY-MM-DD
 */
export const getYesterdayKey = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateKey(yesterday);
};

/**
 * Format a date as YYYY-MM-DD
 */
export const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get the number of days between two date strings (YYYY-MM-DD)
 */
export const getDaysBetween = (dateStr1, dateStr2) => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Get day of week label for a date string
 */
export const getDayOfWeekLabel = (dateStr, short = false) => {
  const date = new Date(dateStr);
  const days = short 
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Get the start and end dates of the current week (Monday to Sunday)
 */
export const getCurrentWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust so Monday is 0
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    start: formatDateKey(monday),
    end: formatDateKey(sunday),
  };
};

/**
 * Get array of date keys for the current week (Monday to Sunday)
 */
export const getCurrentWeekDates = () => {
  const { start } = getCurrentWeekRange();
  const dates = [];
  const startDate = new Date(start);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(formatDateKey(date));
  }
  
  return dates;
};

/**
 * Get time-aware greeting
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

/**
 * Format date for display
 */
export const formatDateDisplay = (dateStr) => {
  const date = new Date(dateStr);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get day of year (1-366) for rotating tips
 */
export const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
