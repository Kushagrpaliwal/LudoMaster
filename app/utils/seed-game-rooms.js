// Script to seed initial game rooms
// Run with: node app/utils/seed-game-rooms.js

const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here';

const GameRoomSchema = new mongoose.Schema({
  name: String,
  entryFee: Number,
  playerCount: Number,
  prizePool: Number,
  status: String,
  createdBy: String,
}, { timestamps: true });

const GameRoom = mongoose.models.GameRoom || mongoose.model('GameRoom', GameRoomSchema);

const seedRooms = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing rooms (optional)
    // await GameRoom.deleteMany({});
    // console.log('Cleared existing rooms');

    // 2-Player Rooms
    const twoPlayerRooms = [
      { name: "Beginner's Luck", entryFee: 5, playerCount: 2 },
      { name: "Classic Ludo", entryFee: 10, playerCount: 2 },
      { name: "High Roller", entryFee: 25, playerCount: 2 },
      { name: "The Pantheon", entryFee: 50, playerCount: 2 },
      { name: "The Royal Court", entryFee: 100, playerCount: 2 },
      { name: "The Grand Arena", entryFee: 500, playerCount: 2 },
      { name: "Champion's Circle", entryFee: 1000, playerCount: 2 },
    ];

    // 4-Player Rooms
    const fourPlayerRooms = [
      { name: "Beginner's Luck", entryFee: 5, playerCount: 4 },
      { name: "Classic Ludo", entryFee: 10, playerCount: 4 },
      { name: "High Roller", entryFee: 25, playerCount: 4 },
      { name: "The Pantheon", entryFee: 50, playerCount: 4 },
      { name: "The Royal Court", entryFee: 100, playerCount: 4 },
      { name: "The Grand Arena", entryFee: 500, playerCount: 4 },
      { name: "Champion's Circle", entryFee: 1000, playerCount: 4 },
    ];

    const allRooms = [...twoPlayerRooms, ...fourPlayerRooms].map(room => ({
      ...room,
      prizePool: Math.round(room.playerCount * room.entryFee * 0.9), // Default 90%, admin can change
      status: 'active',
      createdBy: 'admin',
    }));

    await GameRoom.insertMany(allRooms);
    console.log(`Successfully seeded ${allRooms.length} game rooms`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding rooms:', error);
    process.exit(1);
  }
};

seedRooms();
