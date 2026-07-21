const GLASS_SIZE_ML = 250; // 1 glass = 250ml

/**
 * Convert milliliters to ounces
 */
export const mlToOz = (ml) => {
  return Math.round(ml * 0.033814);
};

/**
 * Convert ounces to milliliters
 */
export const ozToMl = (oz) => {
  return Math.round(oz * 29.5735);
};

/**
 * Convert milliliters to glasses
 */
export const mlToGlasses = (ml) => {
  return Math.round(ml / 250);
};

/**
 * Convert glasses to milliliters
 */
export const glassesToMl = (glasses) => {
  return Math.round(glasses * 250);
};

/**
 * Convert amount to target unit
 */
export const convertAmount = (ml, targetUnit) => {
  switch (targetUnit) {
    case 'glasses':
      return mlToGlasses(ml);
    case 'oz':
      return mlToOz(ml);
    default:
      return ml;
  }
};

/**
 * Format amount with unit
 */
export const formatAmountWithUnit = (ml, unit) => {
  const amount = convertAmount(ml, unit);
  if (unit === 'glasses') {
    return `${amount} glass${amount !== 1 ? 'es' : ''}`;
  }
  return `${amount} ${unit}`;
};

/**
 * Suggest daily goal based on weight (weight in kg * 33ml)
 */
export const suggestDailyGoal = (weightKg) => {
  // Default recommendation: 8 glasses per day (2000ml)
  // Weight-based: ~30-35ml per kg
  const weightBased = weightKg ? Math.round(weightKg * 33) : 2000;
  const defaultGlasses = glassesToMl(8); // 8 glasses
  return Math.max(weightBased, defaultGlasses);
};

/**
 * Format amount with unit for display
 */
export const formatAmountWithUnitForDisplay = (amount, unit) => {
  const converted = convertAmount(amount, unit);
  if (unit === 'glasses') {
    const glassText = converted === 1 ? 'glass' : 'glasses';
    return `${converted} ${glassText}`;
  }
  return `${converted} ${unit}`;
};

/**
 * Get preset amounts based on unit
 */
export const getPresetAmounts = (unit) => {
  switch (unit) {
    case 'glasses':
      return [1, 2, 3]; // 1, 2, 3 glasses
    case 'oz':
      return [8, 16, 24]; // 8oz, 16oz, 24oz
    default:
      return [250, 500, 750]; // ml fallback
  }
};

/**
 * Validate weight input
 */
export const isValidWeight = (weight) => {
  const num = parseFloat(weight);
  return !isNaN(num) && num > 20 && num < 300;
};

/**
 * Validate daily goal input
 */
export const isValidDailyGoal = (goal) => {
  const num = parseFloat(goal);
  return !isNaN(num) && num > 500 && num < 10000;
};
