# Dragon Tiger Game

A real-time multiplayer Dragon Tiger card game built with Next.js and Socket.io.

## Features

- Real-time game updates using Socket.io
- Beautiful animations with Framer Motion
- Responsive design for both desktop and mobile
- Bot players that simulate real betting activity
- Game history tracking
- MongoDB integration for game sessions

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory with the following content:
   ```
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/dragon-tiger

   # Socket.io Server
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

   # Server Port
   PORT=3001
   ```

3. Make sure MongoDB is running locally or update the MONGODB_URI to point to your MongoDB instance.

## Running the Game

To run both the Next.js app and the Socket.io server together:

```bash
npm run start-game
```

This will start:
- Next.js app on http://localhost:3000
- Socket.io server on http://localhost:3001

## Game Rules

Dragon Tiger is a simple card game:
- Two cards are dealt: one to Dragon and one to Tiger
- The higher card wins (Ace is lowest, King is highest)
- If cards are equal, it's a Tie
- Payouts:
  - Dragon: 1:1
  - Tiger: 1:1
  - Tie: 8:1

## Development

- The game loop is managed by `app/cron/dragonGameLoop.js`
- Socket.io server is in `app/server/dragonServer.js`
- Frontend game UI is in `app/games/dragontiger/page.js`
- Game state is synchronized between server and clients via Socket.io

## Technologies Used

- Next.js
- React
- Socket.io
- Framer Motion
- MongoDB/Mongoose
- Tailwind CSS
