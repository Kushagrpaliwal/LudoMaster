import mongoose from "mongoose";

const LudoSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  playerPhone: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  prizePool: {
    type: Number,
    required: true,
  },
  gameState: {
    players: {
      0: {
        color: String,
        tokens: [{
          id: Number,
          position: Number,
          isHome: Boolean,
          isFinished: Boolean,
          isInHomeStretch: Boolean,
        }],
      },
      1: {
        color: String,
        tokens: [{
          id: Number,
          position: Number,
          isHome: Boolean,
          isFinished: Boolean,
          isInHomeStretch: Boolean,
        }],
      },
    },
    winner: {
      type: Number,
      default: null,
    },
    gameStarted: {
      type: Boolean,
      default: false,
    },
    gamePaid: {
      type: Boolean,
      default: false,
    },
  },
  currentPlayer: {
    type: Number,
    default: 0,
  },
  diceValue: {
    type: Number,
    default: 6,
  },
  consecutiveSixes: {
    0: { type: Number, default: 0 },
    1: { type: Number, default: 0 },
  },
  gameMessage: {
    type: String,
    default: "Game started",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  result: {
    isWinner: {
      type: Boolean,
      default: null,
    },
    prizeAmount: {
      type: Number,
      default: 0,
    },
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: null,
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
}, {
  timestamps: true,
});

// Create index for efficient queries
LudoSessionSchema.index({ playerPhone: 1, createdAt: -1 });
LudoSessionSchema.index({ isCompleted: 1 });

const LudoSession = mongoose.models.LudoSession || mongoose.model("LudoSession", LudoSessionSchema);

export default LudoSession; 