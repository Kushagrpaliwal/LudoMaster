import mongoose from "mongoose";

const GameRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  entryFee: {
    type: Number,
    required: true,
  },
  playerCount: {
    type: Number,
    required: true,
    enum: [2, 4], // Only 2 or 4 players allowed
  },
  prizePool: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdBy: {
    type: String,
    default: 'admin',
  },
}, {
  timestamps: true,
});

// Create index for efficient queries
GameRoomSchema.index({ playerCount: 1, status: 1 });

const GameRoom = mongoose.models.GameRoom || mongoose.model("GameRoom", GameRoomSchema);

export default GameRoom;
