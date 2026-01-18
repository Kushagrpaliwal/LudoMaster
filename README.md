# LudoMaster 🎲

A premium real-time multiplayer Ludo game built with Next.js, Socket.io, and MongoDB. Experience the classic board game with stunning visuals, smooth animations, and intelligent gameplay.

## ✨ Features

- **🎮 Multiple Game Modes**
  - **2 Player Mode**: Classic 1v1 head-to-head battles
  - **4 Player Mode**: Epic 4-player free-for-all showdowns
- **🤖 Smart AI Opponents**: Intelligent bots that adapt to your playing style for offline practice
- **⚡ Real-time Multiplayer**: Instant matchmaking and seamless live gameplay using Socket.io
- **🎨 Premium UI/UX**:
  - Glassmorphism design aesthetic
  - 3D-style dice rolls and token animations
  - Smooth transitions with Framer Motion
- **📱 Fully Responsive**: Optimized experience for both mobile and desktop devices
- **🏆 Live Stats**: Real-time player counts and dynamic leaderboards
- **💸 100% Free**: No pay-to-win mechanics, just pure skill and strategy

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Animations**: Framer Motion, React Icons
- **Real-time**: Socket.io (Client & Server)
- **Backend**: Express, Node.js
- **Database**: MongoDB (Mongoose)

## 🚀 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LudoBhoot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/ludomaster

   # Socket.io Server
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   PORT=3001
   ```

4. **Start the Development Server**
   Run the full game stack (Next.js app + Socket.io server):
   ```bash
   npm run start-game
   ```

   This will start:
   - Next.js frontend on `http://localhost:3000`
   - Game server on `http://localhost:3001`

## 🕹️ How to Play

1. **Select Mode**: Choose between 2-Player or 4-Player mode.
2. **Roll Dice**: Click the dice to roll. You need a 6 to open a token.
3. **Move Tokens**: Strategize your moves to race all your tokens to the center 'Home' triangle.
4. **Capture**: Land on opponents' tokens to send them back to start.
5. **Win**: The first player to get all 4 tokens Home wins the game!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
