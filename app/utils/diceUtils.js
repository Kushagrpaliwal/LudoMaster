// Dice utilities for 7UpDown game

function generateDice() {
  // Returns array of 3 dice rolls (1-6)
  return [1, 2].map(() => Math.floor(Math.random() * 6) + 1);
}

function sumDice(diceArr) {
  return diceArr.reduce((sum, val) => sum + val, 0);
}

function determine7UpDown(diceArr) {
  const sum = sumDice(diceArr);
  return sum >= 11 ? '7 Up' : '7 Down';
}

module.exports = {
  generateDice,
  sumDice,
  determine7UpDown
}; 