const suits = ['S', 'H', 'D', 'C'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const cardValue = {
  A: 1, '2': 2, '3': 3, '4': 4,
  '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, '10': 10, J: 11, Q: 12, K: 13
};

function generateDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        rank,
        suit,
        value: cardValue[rank],
        code: `${rank}${suit}`,
        image: `/cards/${rank}${suit}${suit}.png`
      });
    }
  }
  return deck;
}

function drawTwoCards(deck) {
  // Randomly select two different cards from the deck
  const firstIndex = Math.floor(Math.random() * deck.length);
  let secondIndex = Math.floor(Math.random() * deck.length);
  
  // Ensure we don't pick the same card twice
  while (secondIndex === firstIndex) {
    secondIndex = Math.floor(Math.random() * deck.length);
  }
  
  const dragonCard = deck[firstIndex];
  const tigerCard = deck[secondIndex];
  
  console.log("Dragon Card drawn:", dragonCard);
  console.log("Tiger Card drawn:", tigerCard);
  console.log("Dragon Value:", dragonCard.value, "Tiger Value:", tigerCard.value);
  
  return [dragonCard, tigerCard];
}

function determineWinner(dragonCard, tigerCard) {
  if (dragonCard.value > tigerCard.value) return 'Dragon';
  if (tigerCard.value > dragonCard.value) return 'Tiger';
  return 'Tied';
}

module.exports = {
  generateDeck,
  drawTwoCards,
  determineWinner
};
