// Utility functions to handle enum value conversion between old and new 7 Up Down values

/**
 * Converts old enum values to new enum values for 7 Up Down game
 * @param {string} oldValue - The old enum value (left, middle, right)
 * @returns {string} - The new enum value (down, seven, up)
 */
function convertOldEnumToNew(oldValue) {
  const conversionMap = {
    'left': 'down',
    'middle': 'seven', 
    'right': 'up'
  };
  
  return conversionMap[oldValue] || oldValue;
}

/**
 * Converts new enum values back to old enum values (if needed for backward compatibility)
 * @param {string} newValue - The new enum value (down, seven, up)
 * @returns {string} - The old enum value (left, middle, right)
 */
function convertNewEnumToOld(newValue) {
  const conversionMap = {
    'down': 'left',
    'seven': 'middle',
    'up': 'right'
  };
  
  return conversionMap[newValue] || newValue;
}

/**
 * Normalizes enum values to ensure consistency (converts old to new)
 * @param {string} value - Any enum value
 * @returns {string} - Normalized to new enum values
 */
function normalizeEnumValue(value) {
  return convertOldEnumToNew(value);
}

/**
 * Checks if a value is an old enum value that needs conversion
 * @param {string} value - The value to check
 * @returns {boolean} - True if it's an old enum value
 */
function isOldEnumValue(value) {
  return ['left', 'middle', 'right'].includes(value);
}

/**
 * Processes bet history array to convert old enum values to new ones
 * @param {Array} betHistory - Array of bet history objects
 * @returns {Array} - Updated bet history with normalized enum values
 */
function normalizeBetHistory(betHistory) {
  if (!Array.isArray(betHistory)) return betHistory;
  
  return betHistory.map(bet => ({
    ...bet,
    betOn: normalizeEnumValue(bet.betOn)
  }));
}

module.exports = {
  convertOldEnumToNew,
  convertNewEnumToOld,
  normalizeEnumValue,
  isOldEnumValue,
  normalizeBetHistory
}; 