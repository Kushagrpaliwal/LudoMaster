"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

const LudoBoard = () => {
  // Game room selection state - set to false for direct start
  const [showGameList, setShowGameList] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState({ id: 'free', name: 'Free Play', entryFee: 0, prizePool: 0 });
  const [hasJoined, setHasJoined] = useState(false);
  const [hasRedArrow, sethasRedArrow] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(10);
  const [paymentTimerActive, setPaymentTimerActive] = useState(false);
  const paymentIntervalRef = useRef(null);
  const displayIntervalRef = useRef(null);
  const [hasAutoJoined, setHasAutoJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const sessionTimeoutRef = useRef(null);
  const [showExitModal, setShowExitModal] = useState(false);
  // const [LudoJoiningTimer , setLudoJoiningTimer] = useState(0);

  const [diceValue, setDiceValue] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  // Turn order: Red (0) -> Blue (2) -> Yellow (1) -> Green (3)
  const TURN_ORDER = [0, 2, 1, 3];
  const [currentPlayer, setCurrentPlayer] = useState(0); // start with Red (User)

  const getNextPlayer = (player) => {
    const idx = TURN_ORDER.indexOf(player);
    const nextIdx = (idx + 1) % TURN_ORDER.length;
    return TURN_ORDER[nextIdx];
  };
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [consecutiveSixes, setConsecutiveSixes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  });
  const [gameState, setGameState] = useState({
    players: {
      0: {
        // Red player (Human)
        color: "red",
        tokens: [
          {
            id: 0,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 1,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 2,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 3,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
        ],
      },
      1: {
        // Yellow player (Bot)
        color: "yellow",
        tokens: [
          {
            id: 0,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 1,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 2,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 3,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
        ],
      },
      2: {
        // Blue player (Bot)
        color: "blue",
        tokens: [
          {
            id: 0,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 1,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 2,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 3,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
        ],
      },
      3: {
        // Green player (Bot)
        color: "green",
        tokens: [
          {
            id: 0,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 1,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 2,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
          {
            id: 3,
            position: -1,
            isHome: true,
            isFinished: false,
            isInHomeStretch: false,
          },
        ],
      },
    },
    winner: null,
    gameStarted: false,
    gamePaid: false,
  });
  const [selectedToken, setSelectedToken] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameMessage, setGameMessage] = useState("Game starting...");
  const [botThinking, setBotThinking] = useState(false);
  const [userWallet, setUserWallet] = useState(1000);
  const [gameProcessed, setGameProcessed] = useState(false);
  const [isMovingToken, setIsMovingToken] = useState(false); // Track if token is currently moving
  const [isAutoMoving, setIsAutoMoving] = useState(false); // Track if token is moving automatically

  // Auto-start the game on component mount
  useEffect(() => {
    const sessionId = localStorage.getItem("currentFourPlayerLudoSessionId");

    if (sessionId) {
      // There's an active 4-player session - restore the game
      console.log("Found active 4-player session, restoring game...");
      restoreGameSession(sessionId);
    } else {
      // No active session - auto-start a new free play game
      console.log("Starting new 4-player free play game...");
      setShowGameList(false);
      setShowPaymentModal(false);

      // Start the game directly after a short delay
      setTimeout(() => {
        handleJoinGame({ id: 'free', name: 'Free Play', entryFee: 0, prizePool: 0 });
      }, 500);
    }
  }, []);

  //ludo joining timer
  // useEffect(()=>{
  //   const interval = setInterval(()=>{
  //     setLudoJoiningTimer(prev=> prev + 1);
  //   },1000);
  //   return () => clearInterval(interval);
  // },[]);
  // Empty dependency array - only run once

  // Timer functions
  const startTimer = (playerIndex) => {
    // Prevent starting multiple timers
    if (timerActive || timerIntervalRef.current) {
      console.log("Timer already active, ignoring start request");
      return;
    }

    console.log("Starting timer for player", playerIndex);
    setTimerActive(true);
    setTimeLeft(15);
    setTimerExpired(false); // Reset expired flag
    setLastTimeoutTurn(null); // Reset timeout turn tracking
    timeoutProcessedRef.current = false; // Reset timeout processed flag

    const interval = setInterval(() => {
      // Double-check if timer is still active and not expired
      if (timerExpired || timeoutProcessedRef.current) {
        clearInterval(interval);
        timerIntervalRef.current = null;
        return;
      }

      setTimeLeft((prev) => {
        // Play timer audio in last 5 seconds (only once per second)
        if (prev <= 5 && prev > 1 && !audioPlayedRef.current) {
          if (timerAudioRef.current) {
            timerAudioRef.current.volume = 0.6;
            timerAudioRef.current.currentTime = 0;
            timerAudioRef.current.play().catch((err) => {
              console.warn("Could not play timer sound:", err);
            });
            audioPlayedRef.current = true; // Mark as played
          }
        }

        // Reset audio flag for next second
        if (prev > 1) {
          audioPlayedRef.current = false;
        }

        if (prev <= 1 && !timerExpired && !timeoutProcessedRef.current) {
          // Time's up - add a red dot (only once)
          console.log("Timer expired - adding red dot for player", playerIndex);
          timeoutProcessedRef.current = true; // Mark as processed
          setTimerExpired(true); // Prevent multiple executions

          // Stop timer audio
          if (timerAudioRef.current) {
            timerAudioRef.current.pause();
            timerAudioRef.current.currentTime = 0;
          }

          // Immediately clear the interval to prevent further executions
          clearInterval(interval);
          timerIntervalRef.current = null;
          setTimerActive(false);

          // Add exactly one red dot
          setRedDots((prevDots) => {
            console.log(
              "Current red dots:",
              prevDots[playerIndex],
              "Adding 1 more"
            );
            const newRedDots = {
              ...prevDots,
              [playerIndex]: prevDots[playerIndex] + 1,
            };

            // Check if all dots are red (user can also lose this way)
            if (newRedDots[playerIndex] >= 3) {
              // Player loses
              setGameState((prev) => ({
                ...prev,
                winner: 1, // Bot wins
              }));
              setGameMessage("You lost! Too many timeouts!");
              // Stop timer when player loses
              stopTimer();
            }

            return newRedDots;
          });

          // When timer expires, advance to next player (for both user and bot)
          const nextPlayer = getNextPlayer(playerIndex);
          setCurrentPlayer(nextPlayer);
          setBotNeedsToRoll(false);
          setGameMessage(
            nextPlayer === 0
              ? "Time's up! Your turn."
              : "Time's up! Bot's turn."
          );

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerIntervalRef.current = interval;
  };

  const stopTimer = () => {
    console.log("Stopping timer");
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Stop timer audio
    if (timerAudioRef.current) {
      timerAudioRef.current.pause();
      timerAudioRef.current.currentTime = 0;
    }

    setTimerActive(false);
    setTimeLeft(15);
    setTimerExpired(false); // Reset expired flag
    setLastTimeoutTurn(null); // Reset timeout turn tracking
    timeoutProcessedRef.current = false; // Reset timeout processed flag
    audioPlayedRef.current = false; // Reset audio played flag
  };

  // Fetch user wallet balance
  // Fetch user wallet balance (Disabled for free play)
  const fetchWalletBalance = async () => { };
  const [botNeedsToRoll, setBotNeedsToRoll] = useState(false);
  const [hasRolledThisTurn, setHasRolledThisTurn] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);

  // Timer system for player turns
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [redDots, setRedDots] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 }); // Track red dots for each player
  const [timerExpired, setTimerExpired] = useState(false); // Prevent multiple expirations
  const [lastTimeoutTurn, setLastTimeoutTurn] = useState(null); // Track which turn had a timeout
  const timerIntervalRef = useRef(null); // Use ref to track interval
  const timeoutProcessedRef = useRef(false); // Use ref to track if timeout was processed
  const audioPlayedRef = useRef(false); // Use ref to track if audio was played this second
  const starSoundPlayingRef = useRef(false); // Use ref to track if star sound is currently playing

  const audioRef = useRef(null);
  const diceAudioRef = useRef(null);
  const timerAudioRef = useRef(null);
  const tokenHopAudioRef = useRef(null);
  const gameWonAudioRef = useRef(null);
  const tokenCaptureAudioRef = useRef(null);
  const tokenCaptureSoundRef = useRef(null);
  const starSoundRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (paymentIntervalRef.current) {
        clearTimeout(paymentIntervalRef.current);
      }
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, []);

  // Ensure audio is loaded
  useEffect(() => {
    if (tokenHopAudioRef.current) {
      tokenHopAudioRef.current.load();
      console.log("Token hop audio loaded");

      // Test sound on load
      tokenHopAudioRef.current.addEventListener("canplaythrough", () => {
        console.log("Token hop audio can play through");
      });

      tokenHopAudioRef.current.addEventListener("error", (e) => {
        console.error("Token hop audio error:", e);
      });
    }
  }, []);

  // Game rooms - fetched from API
  const [GAME_ROOMS1, setGAME_ROOMS1] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // Fetch game rooms from API
  useEffect(() => {
    const fetchGameRooms = async () => {
      try {
        const response = await fetch('/api/gamerooms?playerCount=4');
        const data = await response.json();
        if (data.success) {
          // Map rooms to match expected format
          const mappedRooms = data.rooms.map((room, index) => ({
            id: room._id,
            name: room.name,
            entryFee: room.entryFee,
            prizePool: room.prizePool,
            status: room.status,
          }));
          setGAME_ROOMS1(mappedRooms);
        }
      } catch (error) {
        console.error('Error fetching game rooms:', error);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchGameRooms();
  }, []);

  // Complete board path - 52 positions around the board
  const boardPath = [
    // Yellow's starting path (positions 0-12) - now bot's path
    { x: 1, y: 6, section: "main", color: "yellow", isSafe: true }, // 0 - Yellow start (safe)
    { x: 2, y: 6, section: "main" }, // 1
    { x: 3, y: 6, section: "main" }, // 2
    { x: 4, y: 6, section: "main" }, // 3
    { x: 5, y: 6, section: "main" }, // 4
    { x: 6, y: 5, section: "main" }, // 5 - Corner
    { x: 6, y: 4, section: "main" }, // 6
    { x: 6, y: 3, section: "main" }, // 7
    { x: 6, y: 2, section: "main", isSafe: true }, // 8 - Safe square
    { x: 6, y: 1, section: "main" }, // 9
    { x: 6, y: 0, section: "main" }, // 10
    { x: 7, y: 0, section: "main" }, // 11
    { x: 8, y: 0, section: "main" }, // 12

    // Red's starting path (positions 13-25) - now user's path
    { x: 8, y: 1, section: "main", color: "red", isSafe: true }, // 13 - Red start (safe)
    { x: 8, y: 2, section: "main" }, // 14
    { x: 8, y: 3, section: "main" }, // 15
    { x: 8, y: 4, section: "main" }, // 16
    { x: 8, y: 5, section: "main" }, // 17
    { x: 9, y: 6, section: "main" }, // 18 - Corner
    { x: 10, y: 6, section: "main" }, // 19
    { x: 11, y: 6, section: "main" }, // 20
    { x: 12, y: 6, section: "main" }, // 21
    { x: 13, y: 6, section: "main", isSafe: true }, // 22 - Safe square
    { x: 14, y: 6, section: "main" }, // 23
    { x: 14, y: 7, section: "main" }, // 24
    { x: 14, y: 8, section: "main" }, // 25

    // Yellow's path (positions 26-38) - Not active but part of board
    { x: 13, y: 8, section: "main", color: "yellow", isSafe: true }, // 26 - Yellow start
    { x: 12, y: 8, section: "main" }, // 27
    { x: 11, y: 8, section: "main" }, // 28
    { x: 10, y: 8, section: "main" }, // 29
    { x: 9, y: 8, section: "main" }, // 30
    { x: 8, y: 9, section: "main" }, // 31 - Corner
    { x: 8, y: 10, section: "main" }, // 32
    { x: 8, y: 11, section: "main" }, // 33
    { x: 8, y: 12, section: "main" }, // 34
    { x: 8, y: 13, section: "main", isSafe: true }, // 35 - Safe square
    { x: 8, y: 14, section: "main" }, // 36
    { x: 7, y: 14, section: "main" }, // 37
    { x: 6, y: 14, section: "main" }, // 38

    // Blue's path (positions 39-51) - Not active but part of board
    { x: 6, y: 13, section: "main", color: "blue", isSafe: true }, // 39 - Blue start
    { x: 6, y: 12, section: "main" }, // 40
    { x: 6, y: 11, section: "main" }, // 41
    { x: 6, y: 10, section: "main" }, // 42
    { x: 6, y: 9, section: "main" }, // 43
    { x: 5, y: 8, section: "main" }, // 44 - Corner
    { x: 4, y: 8, section: "main" }, // 45
    { x: 3, y: 8, section: "main" }, // 46
    { x: 2, y: 8, section: "main", isSafe: true }, // 47 - Safe square
    { x: 1, y: 8, section: "main" }, // 48
    { x: 0, y: 8, section: "main" }, // 49
    { x: 0, y: 7, section: "main" }, // 50
    { x: 0, y: 6, section: "main" }, // 51 - Back to Red start
  ];

  // Home stretch paths for each player
  const homeStretchPaths = {
    0: [
      // Red (user) home stretch - now using yellow's old path
      { x: 13, y: 7, section: "home", color: "red" }, // Home position 1
      { x: 12, y: 7, section: "home", color: "red" }, // Home position 2
      { x: 11, y: 7, section: "home", color: "red" }, // Home position 3
      { x: 10, y: 7, section: "home", color: "red" }, // Home position 4
      { x: 9, y: 7, section: "home", color: "red" }, // Home position 5
      { x: 8, y: 7, section: "home", color: "red" }, // Home position 6 (center)
    ],
    1: [
      // Yellow (bot) home stretch - now using red's old path
      { x: 1, y: 7, section: "home", color: "yellow" }, // Home position 1
      { x: 2, y: 7, section: "home", color: "yellow" }, // Home position 2
      { x: 3, y: 7, section: "home", color: "yellow" }, // Home position 3
      { x: 4, y: 7, section: "home", color: "yellow" }, // Home position 4
      { x: 5, y: 7, section: "home", color: "yellow" }, // Home position 5
      { x: 6, y: 7, section: "home", color: "yellow" }, // Home position 6 (center)
    ],
    2: [
      // Blue (bot) home stretch
      { x: 7, y: 13, section: "home", color: "blue" },
      { x: 7, y: 12, section: "home", color: "blue" },
      { x: 7, y: 11, section: "home", color: "blue" },
      { x: 7, y: 10, section: "home", color: "blue" },
      { x: 7, y: 9, section: "home", color: "blue" },
      { x: 7, y: 8, section: "home", color: "blue" }, // center
    ],
    3: [
      // Green (bot) home stretch
      { x: 7, y: 1, section: "home", color: "green" },
      { x: 7, y: 2, section: "home", color: "green" },
      { x: 7, y: 3, section: "home", color: "green" },
      { x: 7, y: 4, section: "home", color: "green" },
      { x: 7, y: 5, section: "home", color: "green" },
      { x: 7, y: 6, section: "home", color: "green" }, // center
    ],
  };

  // Player starting positions on the main board
  const playerStartPositions = {
    0: 26, // Red (user)
    1: 0, // Yellow (bot)
    2: 39, // Blue (bot)
    3: 13, // Green (bot)
  };

  // Function to restore game session from localStorage or API
  const restoreGameSession = async (sessionId) => {
    try {
      console.log("Restoring 4-player game session:", sessionId);

      // Check if session has expired (60 minutes)
      const sessionStartTime = localStorage.getItem(
        "fourPlayerLudoSessionStartTime"
      );
      if (sessionStartTime) {
        const startTime = parseInt(sessionStartTime);
        const currentTime = Date.now();
        const sessionAge = currentTime - startTime;
        const maxSessionAge = 60 * 60 * 1000; // 60 minutes in milliseconds

        if (sessionAge > maxSessionAge) {
          console.log("4-player session has expired, cleaning up...");
          cleanupExpiredSession();
          return;
        }
      }

      // Try to get session data from API first
      const response = await fetch(`/api/ludo/sessions?sessionId=${sessionId}`);
      const sessionData = await response.json();

      if (response.ok && sessionData.session) {
        // Restore from API data
        const session = sessionData.session;
        console.log("Restoring from API session data:", session);

        // Check if session is marked as expired
        if (session.isExpired) {
          console.log("API session is marked as expired, cleaning up...");
          cleanupExpiredSession();
          return;
        }

        // Restore room information
        const room = {
          id: session.roomId,
          name: session.roomName,
          entryFee: session.betAmount,
          prizePool: session.prizePool,
        };
        setSelectedRoom(room);

        // Restore game state
        if (session.gameState) {
          setGameState(session.gameState);
        }

        // Restore other game state
        if (session.currentPlayer !== undefined) {
          setCurrentPlayer(session.currentPlayer);
        }
        if (session.diceValue !== undefined) {
          setDiceValue(session.diceValue);
        }
        if (session.consecutiveSixes) {
          setConsecutiveSixes(session.consecutiveSixes);
        }
        if (session.gameMessage) {
          setGameMessage(session.gameMessage);
        }
        if (session.redDots) {
          setRedDots(session.redDots);
        }

        // Set game as joined and started
        setHasJoined(true);
        setShowGameList(false);
        setShowPaymentModal(false);

        // Update wallet if available
        if (sessionData.userWallet !== undefined) {
          setUserWallet(sessionData.userWallet);
        }

        // Start session timeout timer
        startSessionTimeout();

        console.log("4-player game session restored successfully");
        setGameMessage(
          "🎲 Welcome back! Your 4-player game has been restored. You're playing with 3 other players!"
        );
      } else {
        // Fallback: try to restore from localStorage
        console.log("API session not found, trying localStorage fallback...");
        restoreFromLocalStorage();
      }
    } catch (error) {
      console.error("Error restoring 4-player game session:", error);
      // Fallback: try to restore from localStorage
      restoreFromLocalStorage();
    }
  };

  // Fallback function to restore from localStorage
  const restoreFromLocalStorage = () => {
    try {
      const savedGameState = localStorage.getItem("fourPlayerLudoGameState");
      const savedRoom = localStorage.getItem("fourPlayerLudoSelectedRoom");
      const sessionStartTime = localStorage.getItem(
        "fourPlayerLudoSessionStartTime"
      );

      // Check if session has expired
      if (sessionStartTime) {
        const startTime = parseInt(sessionStartTime);
        const currentTime = Date.now();
        const sessionAge = currentTime - startTime;
        const maxSessionAge = 60 * 60 * 1000; // 60 minutes in milliseconds

        if (sessionAge > maxSessionAge) {
          console.log("4-player session has expired, cleaning up...");
          cleanupExpiredSession();
          return;
        }
      }

      if (savedGameState && savedRoom) {
        console.log("Restoring 4-player game from localStorage...");

        const gameState = JSON.parse(savedGameState);
        const room = JSON.parse(savedRoom);

        setSelectedRoom(room);
        setGameState(gameState);
        setHasJoined(true);
        setShowGameList(false);
        setShowPaymentModal(false);

        // Restore other state if available
        const savedCurrentPlayer = localStorage.getItem(
          "fourPlayerLudoCurrentPlayer"
        );
        const savedDiceValue = localStorage.getItem("fourPlayerLudoDiceValue");
        const savedConsecutiveSixes = localStorage.getItem(
          "fourPlayerLudoConsecutiveSixes"
        );
        const savedRedDots = localStorage.getItem("fourPlayerLudoRedDots");

        if (savedCurrentPlayer) setCurrentPlayer(parseInt(savedCurrentPlayer));
        if (savedDiceValue) setDiceValue(parseInt(savedDiceValue));
        if (savedConsecutiveSixes)
          setConsecutiveSixes(JSON.parse(savedConsecutiveSixes));
        if (savedRedDots) setRedDots(JSON.parse(savedRedDots));

        // Start session timeout timer
        startSessionTimeout();

        console.log("4-player game restored from localStorage");
        setGameMessage(
          "🎲 Welcome back! Your 4-player game has been restored from local storage. You're playing with 3 other players!"
        );
      } else {
        console.log("No saved 4-player game state found, showing game rooms");
        setShowGameList(true);
      }
    } catch (error) {
      console.error("Error restoring 4-player game from localStorage:", error);
      setShowGameList(true);
    }
  };

  // Room selection and payment handlers
  const handleJoinRoom = (room) => {
    console.log("handleJoinRoom called with room:", room);

    // Clear any existing timers first
    if (paymentIntervalRef.current) {
      clearTimeout(paymentIntervalRef.current);
      paymentIntervalRef.current = null;
    }
    if (displayIntervalRef.current) {
      clearInterval(displayIntervalRef.current);
      displayIntervalRef.current = null;
    }

    setSelectedRoom(room);
    setShowGameList(false);
    setShowPaymentModal(true);
    setHasAutoJoined(false);

    // Random join time between 3-10 seconds
    const randomJoinTime = Math.floor(Math.random() * 8) + 3; // 3-10 seconds
    console.log("Random join time set to:", randomJoinTime, "seconds");

    // Set initial timer value
    let currentTime = randomJoinTime;
    setPaymentTimer(currentTime);
    setPaymentTimerActive(true);

    // Store room reference for auto-join
    const selectedRoomRef = room;

    // Use a single setTimeout for auto-join instead of setInterval
    const autoJoinTimeout = setTimeout(() => {
      console.log("Auto-join timeout reached, triggering join");
      console.log("Selected room for auto-join:", selectedRoomRef);
      handleJoinGame(selectedRoomRef);
    }, randomJoinTime * 1000);

    // Visual countdown timer (separate from auto-join logic)
    const displayInterval = setInterval(() => {
      currentTime--;
      if (currentTime >= 0) {
        console.log("Countdown timer: ", currentTime, "seconds remaining");
        setPaymentTimer(currentTime);
      }
      if (currentTime <= 0) {
        clearInterval(displayInterval);
      }
    }, 1000);

    // Store the timeout and interval references for cleanup
    paymentIntervalRef.current = autoJoinTimeout;
    displayIntervalRef.current = displayInterval;
  };

  const handleBackToLobby = () => {
    // Clear payment timer
    if (paymentIntervalRef.current) {
      clearTimeout(paymentIntervalRef.current);
      paymentIntervalRef.current = null;
    }
    if (displayIntervalRef.current) {
      clearInterval(displayIntervalRef.current);
      displayIntervalRef.current = null;
    }

    // Stop session timeout timer
    stopSessionTimeout();

    // Clear all 4-player game state from localStorage
    localStorage.removeItem("currentFourPlayerLudoSessionId");
    localStorage.removeItem("fourPlayerLudoGameState");
    localStorage.removeItem("fourPlayerLudoSelectedRoom");
    localStorage.removeItem("fourPlayerLudoCurrentPlayer");
    localStorage.removeItem("fourPlayerLudoDiceValue");
    localStorage.removeItem("fourPlayerLudoConsecutiveSixes");
    localStorage.removeItem("fourPlayerLudoRedDots");
    localStorage.removeItem("fourPlayerLudoSessionStartTime");
    localStorage.removeItem("fourPlayerLudoLastSaveTime");

    // Navigate back to the home page
    window.location.href = "/";
  };

  // Function to ensure proper turn state on game start
  const ensureProperTurnState = () => {
    console.log("Ensuring proper turn state...");
    // Turn state is managed by the game logic, no override needed
    return true;
  };

  const handleExitGame = () => {
    console.log("User confirmed exit, cleaning up session...");

    // Process the game as a loss if it's still in progress
    if (hasJoined && !gameState.winner && !gameProcessed) {
      const phone = localStorage.getItem("phone");
      const sessionId = localStorage.getItem("currentLudoSessionId");

      if (phone && sessionId) {
        // Process as a loss
        fetch("/api/ludo/process-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phone,
            isWinner: false,
            prizeAmount: 0,
            roomId: selectedRoom?.id || "unknown",
            roomName: selectedRoom?.name || "Unknown Room",
          }),
        }).catch((error) => {
          console.warn("Failed to process exit as loss:", error);
        });
      }
    }

    // Clean up session
    handleBackToLobby();
  };

  const handleJoinGame = async (roomOverride = null) => {
    console.log("handleJoinGame called - Starting 4-player free play game!");

    // Prevent multiple auto-joins - set flag immediately
    if (hasAutoJoined) {
      console.log("Already auto-joined, skipping...");
      return;
    }
    setHasAutoJoined(true);

    // Use roomOverride if provided, otherwise use selectedRoom
    const roomToJoin = roomOverride || selectedRoom || { id: 'free', name: 'Free Play', entryFee: 0, prizePool: 0 };

    console.log("Starting 4-player game with room:", roomToJoin);

    // For free play, skip wallet and API calls - just start the game directly
    setGameState((prev) => ({ ...prev, gamePaid: true }));
    setHasJoined(true);
    setShowPaymentModal(false);
    setGameMessage("Roll the dice to start! You're playing with 3 bots.");

    // Generate a local session ID for free play
    const sessionId = `free4p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("currentFourPlayerLudoSessionId", sessionId);

    // Reset timer and red dots for new game
    setRedDots({ 0: 0, 1: 0, 2: 0, 3: 0 });
    stopTimer();

    // Always start from User (Red player) on new game
    setCurrentPlayer(0);
    console.log("New game - User (Red) will start first");

    // Save initial game state to localStorage
    const initialGameState = { ...gameState, gamePaid: true };
    localStorage.setItem("fourPlayerLudoGameState", JSON.stringify(initialGameState));
    localStorage.setItem("fourPlayerLudoSelectedRoom", JSON.stringify(roomToJoin));
    localStorage.setItem("fourPlayerLudoCurrentPlayer", "0");
    localStorage.setItem("fourPlayerLudoDiceValue", "6");
    localStorage.setItem("fourPlayerLudoConsecutiveSixes", JSON.stringify({ 0: 0, 1: 0, 2: 0, 3: 0 }));
    localStorage.setItem("fourPlayerLudoRedDots", JSON.stringify({ 0: 0, 1: 0, 2: 0, 3: 0 }));
    localStorage.setItem("fourPlayerLudoSessionStartTime", Date.now().toString());
    localStorage.setItem("fourPlayerLudoLastSaveTime", Date.now().toString());

    // Ensure game is started with user's turn
    console.log("Final check - ensuring User gets first turn");
    setTimeout(() => {
      setCurrentPlayer(0); // User goes first
      setGameState((prev) => ({ ...prev, gameStarted: true }));
      setBotThinking(false);
      setGameMessage("Your turn! Roll the dice!");
    }, 500);

    console.log("4-player game started successfully!");
  };

  // Payment Modal Handler
  const handlePayment = () => {
    if (userWallet >= 100) {
      setUserWallet((prev) => prev - 100);
      setGameState((prev) => ({ ...prev, gamePaid: true }));
      setShowPaymentModal(false);
      setGameMessage("Game paid! Roll dice to start!");
    } else {
      setGameMessage("Insufficient balance! Need 100 to play.");
    }
  };

  // Audio functionality
  useEffect(() => {
    const audio = audioRef.current;

    if (hasJoined && audio) {
      const playBackgroundMusic = () => {
        audio.volume = 0.3;
        audio.play().catch((err) => {
          console.warn("User interaction required to play audio", err);
        });
      };
      playBackgroundMusic();

      const handleUserInteraction = () => {
        playBackgroundMusic();
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      };

      document.addEventListener("click", handleUserInteraction);
      document.addEventListener("touchstart", handleUserInteraction);

      return () => {
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      };
    } else if (!hasJoined && audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [hasJoined]);

  // Check device orientation and size
  useEffect(() => {
    const checkOrientation = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setIsMobile(vw < 768);
      setIsPortrait(vh > vw);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Fetch wallet balance on component mount
  useEffect(() => {
    fetchWalletBalance();
  }, []);

  // Periodic session check (every 5 minutes)
  useEffect(() => {
    const sessionCheckInterval = setInterval(() => {
      const sessionId = localStorage.getItem("currentFourPlayerLudoSessionId");
      const sessionStartTime = localStorage.getItem(
        "fourPlayerLudoSessionStartTime"
      );

      if (sessionId && sessionStartTime) {
        const startTime = parseInt(sessionStartTime);
        const currentTime = Date.now();
        const sessionAge = currentTime - startTime;
        const maxSessionAge = 60 * 60 * 1000; // 60 minutes

        if (sessionAge > maxSessionAge) {
          console.log(
            "Periodic check: 4-player session has expired, cleaning up..."
          );
          cleanupExpiredSession();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, []);

  // Play background music when game starts
  useEffect(() => {
    const audio = audioRef.current;

    if (gameState.gameStarted && audio) {
      const playBackgroundMusic = () => {
        audio.volume = 0.3; // Set volume to 30%
        audio.play().catch((err) => {
          console.warn("User interaction required to play audio", err);
        });
      };

      // Try to play immediately, or wait for user interaction
      playBackgroundMusic();

      // Fallback: play on next user interaction if autoplay failed
      const handleUserInteraction = () => {
        playBackgroundMusic();
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      };

      document.addEventListener("click", handleUserInteraction);
      document.addEventListener("touchstart", handleUserInteraction);

      return () => {
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      };
    } else if (!gameState.gameStarted && audio) {
      // Stop music when game is not started
      audio.pause();
      audio.currentTime = 0;
    }
  }, [gameState.gameStarted]);

  // Bot AI logic
  useEffect(() => {
    console.log("Bot logic useEffect triggered:", {
      currentPlayer,
      botThinking,
      isRolling,
      isMovingToken,
      gameStarted: gameState.gameStarted,
      winner: gameState.winner,
      botNeedsToRoll,
    });

    if (
      currentPlayer !== 0 && // any bot: 1,2,3
      !botThinking &&
      !isRolling &&
      !isMovingToken && // Prevent bot actions during movement
      gameState.gameStarted &&
      !gameState.winner
    ) {
      console.log(
        `Starting bot turn for player ${currentPlayer} (${currentPlayer === 1
          ? "Yellow"
          : currentPlayer === 2
            ? "Blue"
            : "Green"
        } bot)...`
      );
      setBotThinking(true);
      setGameMessage(
        `Bot ${currentPlayer === 1
          ? "Yellow"
          : currentPlayer === 2
            ? "Blue"
            : "Green"
        } is thinking...`
      );
      setTimeout(() => handleBotTurn(), 1500);
    } else if (currentPlayer !== 0 && !gameState.gameStarted) {
      console.log(
        `Bot turn but game not started yet, starting game for player ${currentPlayer}...`
      );
      setGameState((prev) => ({ ...prev, gameStarted: true }));
      setTimeout(() => {
        setBotThinking(true);
        setGameMessage(
          `Bot ${currentPlayer === 1
            ? "Yellow"
            : currentPlayer === 2
              ? "Blue"
              : "Green"
          } is thinking...`
        );
        setTimeout(() => handleBotTurn(), 1500);
      }, 500);
    }
  }, [
    currentPlayer,
    gameState.gameStarted,
    gameState.winner,
    botNeedsToRoll,
    isMovingToken,
    botThinking,
  ]);

  // Timer logic for user turn
  useEffect(() => {
    if (
      currentPlayer === 0 &&
      gameState.gameStarted &&
      !gameState.winner &&
      !isMovingToken &&
      !hasRolledThisTurn
    ) {
      // Start timer when it's user's turn and they haven't rolled yet
      startTimer(0);
    } else if (currentPlayer !== 0) {
      // Stop timer when it's not user's turn
      stopTimer();
    }
  }, [
    currentPlayer,
    gameState.gameStarted,
    gameState.winner,
    isMovingToken,
    hasRolledThisTurn,
  ]);

  // Game logic functions
  const canTokenMove = (playerIndex, tokenIndex, diceValue) => {
    const token = gameState.players[playerIndex].tokens[tokenIndex];

    if (token.isFinished) return false;

    // If token is at home, can only move with 6
    if (token.isHome && diceValue === 6) return true;

    // If token is on board or in home stretch
    if (!token.isHome) {
      if (token.isInHomeStretch) {
        // In home stretch, check if can move forward (need exact number to finish)
        const currentHomePos = token.position;
        const newHomePos = currentHomePos + diceValue;
        return newHomePos <= 5; // Home stretch has positions 0-5
      } else {
        // On main board, calculate new position
        const newPosition = token.position + diceValue;
        const playerStartPos = playerStartPositions[playerIndex];

        // Calculate how many steps from start position
        let stepsFromStart;
        if (token.position >= playerStartPos) {
          stepsFromStart = token.position - playerStartPos;
        } else {
          // Token has wrapped around the board
          stepsFromStart = 52 - playerStartPos + token.position;
        }

        const newStepsFromStart = stepsFromStart + diceValue;

        // Check if token would complete a full lap (51 steps) and enter home stretch
        if (newStepsFromStart >= 51) {
          const homeStretchPos = newStepsFromStart - 51;
          return homeStretchPos <= 5; // Can enter home stretch, need exact number to finish at center
        }

        return true;
      }
    }

    return false;
  };

  const getValidMoves = (playerIndex, diceValue) => {
    const validMoves = [];
    gameState.players[playerIndex].tokens.forEach((token, index) => {
      if (canTokenMove(playerIndex, index, diceValue)) {
        validMoves.push(index);
      }
    });
    return validMoves;
  };

  // Check if a move would result in a capture
  const wouldCapture = (playerIndex, tokenIndex, diceValue) => {
    const token = gameState.players[playerIndex].tokens[tokenIndex];

    if (token.isHome || token.isFinished || token.isInHomeStretch) {
      return false;
    }

    const playerStartPos = playerStartPositions[playerIndex];

    // Calculate steps from start position
    let stepsFromStart;
    if (token.position >= playerStartPos) {
      stepsFromStart = token.position - playerStartPos;
    } else {
      stepsFromStart = 52 - playerStartPos + token.position;
    }

    const newStepsFromStart = stepsFromStart + diceValue;

    if (newStepsFromStart < 51) {
      const newPos = (playerStartPos + newStepsFromStart) % 52;
      const boardPos = boardPath[newPos];

      // Can't capture on safe squares (stars) or starting positions
      if (boardPos && boardPos.isSafe) {
        return false;
      }

      // Additional check for ALL star positions and starting positions
      // Including all visual star positions to prevent any captures on stars
      const safePositions = [
        0, // Yellow start position
        8, // First star position (safe square)
        13, // Red start position
        21, // Visual star position (Blue star)
        22, // Second star position (safe square)
        26, // Green start position
        34, // Visual star position (Blue star on vertical)
        35, // Third star position (safe square)
        39, // Blue start position
        47, // Fourth star position (safe square)
      ];

      if (safePositions.includes(newPos)) {
        return false;
      }

      // Check if any opponent token (among other 3 players) is at this position
      for (let opponent = 0; opponent < 4; opponent++) {
        if (opponent === playerIndex) continue;
        const hit = gameState.players[opponent].tokens.some(
          (oppToken) =>
            !oppToken.isHome &&
            !oppToken.isFinished &&
            !oppToken.isInHomeStretch &&
            oppToken.position === newPos
        );
        if (hit) return true;
      }
      return false;
    }

    return false;
  };

  // Check if player has any valid moves for any dice value (1-6)
  const hasAnyValidMoves = (playerIndex) => {
    for (let diceValue = 1; diceValue <= 6; diceValue++) {
      const validMoves = getValidMoves(playerIndex, diceValue);
      if (validMoves.length > 0) {
        return true;
      }
    }
    return false;
  };

  const moveToken = async (playerIndex, tokenIndex, diceValue) => {
    setIsMovingToken(true);
    const newGameState = { ...gameState };
    const token = newGameState.players[playerIndex].tokens[tokenIndex];
    let tokenCaptured = false;
    let tokenFinished = false; // Track if a token was finished during this move

    if (token.isHome && diceValue === 6) {
      // Move token out of home to starting position
      token.isHome = false;
      token.position = playerStartPositions[playerIndex];
      setGameMessage(
        `${playerIndex === 0 ? "You" : "Bot"} brought a token out!`
      );
    } else if (!token.isHome) {
      if (token.isInHomeStretch) {
        // Move in home stretch with animation
        tokenFinished = await animateHomeStretchMove(
          newGameState,
          playerIndex,
          tokenIndex,
          diceValue
        );
      } else {
        // Move on main board with animation - check for captures
        const result = await animateMainBoardMove(
          newGameState,
          playerIndex,
          tokenIndex,
          diceValue
        );
        tokenCaptured = result.captured;
        tokenFinished = result.finished;
      }
    }

    setGameState(newGameState);
    checkWinCondition(newGameState, playerIndex);

    // Handle turn switching and consecutive sixes
    if (diceValue === 6 || tokenCaptured) {
      if (diceValue === 6) {
        const newPlayerSixes = consecutiveSixes[playerIndex] + 1;
        setConsecutiveSixes((prev) => ({
          ...prev,
          [playerIndex]: newPlayerSixes,
        }));

        if (newPlayerSixes >= 3) {
          // Three consecutive sixes - turn cancelled
          setGameMessage(
            `${playerIndex === 0 ? "You" : "Bot"
            } rolled 3 sixes! Turn cancelled.`
          );
          setConsecutiveSixes((prev) => ({ ...prev, [playerIndex]: 0 }));
          setCurrentPlayer(getNextPlayer(currentPlayer));
          // Don't reset hasRolledThisTurn - turn is cancelled
        } else {
          setGameMessage(
            `${playerIndex === 0 ? "You" : "Bot"} got a 6! Roll again!`
          );
          // If it's the bot's turn, trigger another roll
          if (playerIndex !== 0) {
            setBotNeedsToRoll((prev) => !prev); // Toggle to trigger useEffect
          } else {
            // If it's the human player's turn and they got a 6, allow them to roll again
            setHasRolledThisTurn(false);
            // Start timer for user's turn
            startTimer(0);
          }
        }
      } else if (tokenCaptured) {
        // Token captured - give another turn
        setGameMessage(
          `${playerIndex === 0 ? "You" : "Bot"} captured a token! Roll again!`
        );
        // If it's the bot's turn, trigger another roll
        if (playerIndex !== 0) {
          setBotNeedsToRoll((prev) => !prev); // Toggle to trigger useEffect
        } else {
          // If it's the human player's turn and they captured, allow them to roll again
          setHasRolledThisTurn(false);
          // Start timer for user's turn
          startTimer(0);
        }
      }
    } else {
      // Check if a token was finished during this move
      if (tokenFinished) {
        setGameMessage(
          `${playerIndex === 0 ? "You" : "Bot"} finished a token! ${playerIndex === 0
            ? "You have more tokens to play. Roll again!"
            : "Bot has more tokens to play."
          }`
        );

        // If it's the user's turn, allow them to roll again
        if (playerIndex === 0) {
          setHasRolledThisTurn(false);
          setCurrentPlayer(0); // Keep user's turn
          // Start timer for user's turn
          startTimer(0);
        } else {
          // If it's bot's turn, trigger another roll
          setBotNeedsToRoll((prev) => !prev);
        }
      } else {
        // Normal turn switch - reset current player's consecutive sixes
        setConsecutiveSixes((prev) => ({ ...prev, [playerIndex]: 0 }));
        const next = getNextPlayer(currentPlayer);
        setCurrentPlayer(next);
        setGameMessage(next === 0 ? "Your turn" : "Bot's turn");
        setBotNeedsToRoll(false); // Reset bot roll trigger
        setHasRolledThisTurn(false); // Reset for new turn
      }
    }

    setSelectedToken(null);
    setPossibleMoves([]);
    setIsMovingToken(false);
    setIsAutoMoving(false); // Reset auto-moving flag

    // Stop timer when move is completed, unless user gets another turn
    if (!(diceValue === 6 || tokenCaptured || tokenFinished)) {
      stopTimer();
    }

    // Update session state
    updateSessionState(newGameState);
  };

  // Function to start session timeout timer (60 minutes)
  const startSessionTimeout = () => {
    // Clear any existing timeout
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    const sessionId = localStorage.getItem("currentFourPlayerLudoSessionId");
    if (!sessionId) return;

    console.log("Starting 60-minute session timeout for 4-player game");
    setSessionStartTime(Date.now());

    // Set timeout for 60 minutes (60 * 60 * 1000 = 3,600,000 ms)
    sessionTimeoutRef.current = setTimeout(() => {
      console.log(
        "4-player session timeout reached (60 minutes), cleaning up..."
      );
      cleanupExpiredSession();
    }, 60 * 60 * 1000);
  };

  // Function to cleanup expired session
  const cleanupExpiredSession = async () => {
    try {
      const sessionId = localStorage.getItem("currentFourPlayerLudoSessionId");
      if (!sessionId) return;

      console.log("Cleaning up expired 4-player session:", sessionId);

      // Try to update session as expired via API
      try {
        await fetch("/api/ludo/sessions/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            isExpired: true,
            expiredAt: new Date().toISOString(),
          }),
        });
      } catch (apiError) {
        console.warn("Failed to update session as expired via API:", apiError);
      }

      // Clear all localStorage data
      localStorage.removeItem("currentFourPlayerLudoSessionId");
      localStorage.removeItem("fourPlayerLudoGameState");
      localStorage.removeItem("fourPlayerLudoSelectedRoom");
      localStorage.removeItem("fourPlayerLudoCurrentPlayer");
      localStorage.removeItem("fourPlayerLudoDiceValue");
      localStorage.removeItem("fourPlayerLudoConsecutiveSixes");
      localStorage.removeItem("fourPlayerLudoRedDots");
      localStorage.removeItem("fourPlayerLudoSessionStartTime");
      localStorage.removeItem("fourPlayerLudoLastSaveTime");

      // Reset game state
      setHasJoined(false);
      setShowGameList(true);
      setShowPaymentModal(false);
      setGameState({
        players: {
          0: {
            color: "red",
            tokens: Array(4)
              .fill()
              .map((_, i) => ({
                id: i,
                position: -1,
                isHome: true,
                isFinished: false,
                isInHomeStretch: false,
              })),
          },
          1: {
            color: "yellow",
            tokens: Array(4)
              .fill()
              .map((_, i) => ({
                id: i,
                position: -1,
                isHome: true,
                isFinished: false,
                isInHomeStretch: false,
              })),
          },
          2: {
            color: "blue",
            tokens: Array(4)
              .fill()
              .map((_, i) => ({
                id: i,
                position: -1,
                isHome: true,
                isFinished: false,
                isInHomeStretch: false,
              })),
          },
          3: {
            color: "green",
            tokens: Array(4)
              .fill()
              .map((_, i) => ({
                id: i,
                position: -1,
                isHome: true,
                isFinished: false,
                isInHomeStretch: false,
              })),
          },
        },
        winner: null,
        gameStarted: false,
        gamePaid: false,
      });
      setCurrentPlayer(0);
      setDiceValue(6);
      setConsecutiveSixes({ 0: 0, 1: 0, 2: 0, 3: 0 });
      setRedDots({ 0: 0, 1: 0, 2: 0, 3: 0 });
      setGameMessage("Session expired. Please start a new game.");

      console.log("4-player session cleanup completed");
    } catch (error) {
      console.error("Error cleaning up expired session:", error);
    }
  };

  // Function to stop session timeout timer
  const stopSessionTimeout = () => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    setSessionStartTime(null);
    console.log("4-player session timeout stopped");
  };

  // Function to update session state
  const updateSessionState = async (gameState) => {
    try {
      const sessionId = localStorage.getItem("currentFourPlayerLudoSessionId");

      if (sessionId) {
        await fetch("/api/ludo/sessions/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            gameState: gameState,
            currentPlayer: currentPlayer,
            diceValue: diceValue,
            consecutiveSixes: consecutiveSixes,
            gameMessage: gameMessage,
            redDots: redDots,
          }),
        });
      }

      // Also save to localStorage as backup
      localStorage.setItem(
        "fourPlayerLudoGameState",
        JSON.stringify(gameState)
      );
      localStorage.setItem(
        "fourPlayerLudoSelectedRoom",
        JSON.stringify(selectedRoom)
      );
      localStorage.setItem(
        "fourPlayerLudoCurrentPlayer",
        currentPlayer.toString()
      );
      localStorage.setItem("fourPlayerLudoDiceValue", diceValue.toString());
      localStorage.setItem(
        "fourPlayerLudoConsecutiveSixes",
        JSON.stringify(consecutiveSixes)
      );
      localStorage.setItem("fourPlayerLudoRedDots", JSON.stringify(redDots));
      localStorage.setItem("fourPlayerLudoLastSaveTime", Date.now().toString());
    } catch (error) {
      console.error("Error updating 4-player session state:", error);
    }
  };

  // Animate token movement in home stretch
  const animateHomeStretchMove = async (
    gameState,
    playerIndex,
    tokenIndex,
    diceValue
  ) => {
    const token = gameState.players[playerIndex].tokens[tokenIndex];
    const startPos = token.position;
    const endPos = startPos + diceValue;

    // Animate step by step
    for (let step = 1; step <= diceValue; step++) {
      const currentPos = startPos + step;

      if (currentPos <= 5) {
        token.position = currentPos;
        setGameState({ ...gameState });

        // Check if token landed on a star position and play star sound
        // Only play star sound when token stops at the final position (not during intermediate steps)
        // Star positions in home stretch paths: position 3 corresponds to visual star cells
        if (currentPos === 3 && step === diceValue) {
          playStarSound();
        }

        // Play token hop sound for each step
        if (
          tokenHopAudioRef.current &&
          tokenHopAudioRef.current.readyState >= 2
        ) {
          console.log("Playing token hop sound (home stretch)...");
          tokenHopAudioRef.current.volume = 0.2;
          tokenHopAudioRef.current.currentTime = 0;

          // Add a small delay to ensure consistent audio playback
          setTimeout(() => {
            tokenHopAudioRef.current.play().catch((err) => {
              console.warn("Could not play token hop sound:", err);
            });
          }, 50);
        } else {
          console.warn(
            "Token hop audio not ready - readyState:",
            tokenHopAudioRef.current?.readyState
          );
        }

        // Wait before next step
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    // Check if token finished
    if (endPos === 5) {
      token.isFinished = true;
      token.position = 5;
      console.log(`Player ${playerIndex} finished token ${tokenIndex}!`);

      // Check if there are more tokens to play
      const remainingTokens = gameState.players[playerIndex].tokens.filter(
        (token) => !token.isFinished
      );

      if (remainingTokens.length > 0) {
        // More tokens remain - give another turn
        setGameMessage(
          `${playerIndex === 0 ? "You" : "Bot"} finished a token! ${playerIndex === 0
            ? "You have more tokens to play. Roll again!"
            : "Bot has more tokens to play."
          }`
        );

        // Play token winning sound
        playTokenWinningSound();

        // Return true to indicate token was finished
        return true;
      } else {
        // All tokens finished - this will trigger win condition
        setGameMessage(
          `${playerIndex === 0 ? "You" : "Bot"} finished a token!`
        );

        // Play token winning sound
        playTokenWinningSound();

        // Return true to indicate token was finished
        return true;
      }
    }

    // Return false if no token was finished
    return false;
  };

  // Play token winning sound
  const playTokenWinningSound = () => {
    if (tokenCaptureAudioRef.current) {
      console.log("Playing token winning sound");
      tokenCaptureAudioRef.current.volume = 0.9;
      tokenCaptureAudioRef.current.currentTime = 0;

      // Add a small delay to ensure consistent audio playback
      setTimeout(() => {
        tokenCaptureAudioRef.current.play().catch((err) => {
          console.warn("Could not play token winning sound:", err);
        });
      }, 50);
    } else {
      console.warn(
        "tokenCaptureAudioRef.current is null - cannot play token winning sound"
      );
    }
  };

  // Play token capture sound
  const playTokenCaptureSound = () => {
    if (tokenCaptureSoundRef.current) {
      console.log("Playing token capture sound");
      tokenCaptureSoundRef.current.volume = 0.8;
      tokenCaptureSoundRef.current.currentTime = 0;

      // Add a small delay to ensure consistent audio playback
      setTimeout(() => {
        tokenCaptureSoundRef.current.play().catch((err) => {
          console.warn("Could not play token capture sound:", err);
        });
      }, 50);
    } else {
      console.warn(
        "tokenCaptureSoundRef.current is null - cannot play token capture sound"
      );
    }
  };

  // Helper function to check if a position is a star position
  const isStarPosition = (position) => {
    const safePositions = [0, 8, 13, 22, 26, 35, 39, 47];
    // Visual star positions based on the board layout:
    // - Red star (right horizontal, i===3): position 22 (already included in safePositions)
    // - Blue star (bottom vertical, i===11): position 34
    // - Yellow star (left horizontal, i===14): position 8 (already included in safePositions)
    // - Green star (top vertical, i===6): position 35 (already included in safePositions)
    const visualStarPositions = [21, 34]; // Additional visual star position for blue star
    const allStarPositions = [...safePositions, ...visualStarPositions];
    return allStarPositions.includes(position);
  };

  // Play star sound when token lands on star
  const playStarSound = () => {
    // Prevent multiple star sounds from playing simultaneously
    if (starSoundPlayingRef.current) {
      console.log("Star sound already playing, skipping...");
      return;
    }

    if (starSoundRef.current && starSoundRef.current.readyState >= 2) {
      console.log("🎵 Playing star sound - token stopped on star!");
      starSoundPlayingRef.current = true;
      starSoundRef.current.volume = 0.7;
      starSoundRef.current.currentTime = 0;

      // Add a small delay to ensure the sound plays consistently
      setTimeout(() => {
        starSoundRef.current.play().catch((err) => {
          console.warn("Could not play star sound:", err);
          starSoundPlayingRef.current = false;
        });

        // Reset the flag after the sound duration (approximately 1 second)
        setTimeout(() => {
          starSoundPlayingRef.current = false;
        }, 1000);
      }, 50);
    } else {
      console.warn(
        "Star sound not ready - readyState:",
        starSoundRef.current?.readyState
      );
    }
  };

  // Animate token movement on main board
  const animateMainBoardMove = async (
    gameState,
    playerIndex,
    tokenIndex,
    diceValue
  ) => {
    const token = gameState.players[playerIndex].tokens[tokenIndex];
    const playerStartPos = playerStartPositions[playerIndex];

    // Calculate current steps from start position
    let currentStepsFromStart;
    if (token.position >= playerStartPos) {
      currentStepsFromStart = token.position - playerStartPos;
    } else {
      currentStepsFromStart = 52 - playerStartPos + token.position;
    }

    const finalStepsFromStart = currentStepsFromStart + diceValue;

    // Animate step by step
    for (let step = 1; step <= diceValue; step++) {
      const newStepsFromStart = currentStepsFromStart + step;

      if (newStepsFromStart >= 51) {
        // Enter home stretch
        const homeStretchPos = newStepsFromStart - 51;
        if (homeStretchPos <= 5) {
          token.isInHomeStretch = true;
          token.position = homeStretchPos;
          setGameState({ ...gameState });

          // Play token hop sound for each step
          if (tokenHopAudioRef.current) {
            tokenHopAudioRef.current.volume = 0.4;
            tokenHopAudioRef.current.currentTime = 0;
            tokenHopAudioRef.current.play().catch((err) => {
              console.warn("Could not play token hop sound:", err);
            });
          }

          // Wait before next step
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Check if token finished
          if (homeStretchPos === 5) {
            token.isFinished = true;
            console.log(
              `Player ${playerIndex} finished token ${tokenIndex} from main board!`
            );

            // Check if there are more tokens to play
            const remainingTokens = gameState.players[
              playerIndex
            ].tokens.filter((token) => !token.isFinished);

            if (remainingTokens.length > 0) {
              // More tokens remain - give another turn
              setGameMessage(
                `${playerIndex === 0 ? "You" : "Bot"} finished a token! ${playerIndex === 0
                  ? "You have more tokens to play. Roll again!"
                  : "Bot has more tokens to play."
                }`
              );
            } else {
              // All tokens finished - this will trigger win condition
              setGameMessage(
                `${playerIndex === 0 ? "You" : "Bot"} finished a token!`
              );
            }

            // Play token winning sound
            playTokenWinningSound();
            return { captured: false, finished: true }; // Token finished, no capture
          } else {
            setGameMessage(
              `${playerIndex === 0 ? "You" : "Bot"} entered home stretch!`
            );
            // Continue with remaining steps in home stretch
            const remainingSteps = diceValue - step;
            if (remainingSteps > 0) {
              // Call home stretch animation for remaining steps
              const finished = await animateHomeStretchMove(
                gameState,
                playerIndex,
                tokenIndex,
                remainingSteps
              );
              return { captured: false, finished: finished }; // Return finished status from home stretch
            }
            return { captured: false, finished: false }; // No capture, no finish
          }
        }
      } else {
        // Continue on main board
        const newPosition = (playerStartPos + newStepsFromStart) % 52;
        token.position = newPosition;
        setGameState({ ...gameState });

        // Check if token landed on a star position and play star sound
        // Only play star sound when token actually stops on a star position (final step)
        // if (step === diceValue && isStarPosition(newPosition)) {
        //   const finalPosition = (playerStartPos + finalStepsFromStart) % 52;
        //   const isFinalDestination = newPosition === finalPosition;

        //   if (isFinalDestination) {
        //     console.log(`🎯 Token stopped on star position ${newPosition}`);

        //     // Add a small delay to ensure the star sound plays after the hop sound
        //     setTimeout(() => {
        //       playStarSound();
        //     }, 100);
        //   }
        // }

        // Play token hop sound for each step
        if (
          tokenHopAudioRef.current &&
          tokenHopAudioRef.current.readyState >= 2
        ) {
          tokenHopAudioRef.current.volume = 0.4;
          tokenHopAudioRef.current.currentTime = 0;

          // Add a small delay to ensure consistent audio playback
          setTimeout(() => {
            tokenHopAudioRef.current.play().catch((err) => {
              console.warn("Could not play token hop sound:", err);
            });
          }, 50);
        }

        // Wait before next step
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    // Check for captures at final position
    const finalPosition = (playerStartPos + finalStepsFromStart) % 52;
    const captured = checkForCaptures(
      gameState,
      playerIndex,
      tokenIndex,
      finalPosition
    );

    // Return both capture status and whether a token was finished
    return { captured, finished: false };
  };

  const checkForCaptures = (
    gameState,
    currentPlayerIndex,
    tokenIndex,
    newPosition
  ) => {
    const boardPos = boardPath[newPosition];

    // Can't capture on safe squares (stars)
    if (boardPos && boardPos.isSafe) {
      console.log(
        `Position ${newPosition} is safe (star), no capture possible`
      );
      return false;
    }

    // Define ALL safe positions (star positions and starting positions)
    // Including all visual star positions to prevent any captures on stars
    const safePositions = [
      0, // Yellow start position
      8, // First star position (safe square)
      13, // Red start position
      21, // Visual star position (Blue star)
      22, // Second star position (safe square)
      26, // Green start position
      34, // Visual star position (Blue star on vertical)
      35, // Third star position (safe square)
      39, // Blue start position
      47, // Fourth star position (safe square)
    ];

    // Check if the new position is a safe position (star or starting position)
    if (safePositions.includes(newPosition)) {
      console.log(
        `Position ${newPosition} is a safe position (star or start), no capture possible`
      );
      return false;
    }

    // Check if there are multiple tokens of the same color at this position
    let tokensAtPosition = [];

    // Count tokens of all opponent players at this position
    for (let opponent = 0; opponent < 4; opponent++) {
      if (opponent === currentPlayerIndex) continue;
      gameState.players[opponent].tokens.forEach((otherToken, index) => {
        if (
          !otherToken.isHome &&
          !otherToken.isFinished &&
          !otherToken.isInHomeStretch &&
          otherToken.position === newPosition
        ) {
          tokensAtPosition.push({
            playerIndex: opponent,
            tokenIndex: index,
            token: otherToken,
          });
        }
      });
    }

    // If there are multiple tokens of the same color, no capture is possible
    if (tokensAtPosition.length > 1) {
      console.log(
        `Position ${newPosition} has ${tokensAtPosition.length} tokens of the same color - no capture possible`
      );
      return false;
    }

    // If there's only one token, proceed with capture
    let capturedCount = 0;
    tokensAtPosition.forEach(({ playerIndex, tokenIndex, token }) => {
      // Capture the token - send it back home
      token.isHome = true;
      token.position = -1;
      token.isInHomeStretch = false;
      capturedCount++;
      console.log(
        `Token ${tokenIndex} of player ${playerIndex} captured at position ${newPosition}`
      );
    });

    if (capturedCount > 0) {
      // Token captured - play capture sound
      console.log("🎯 Token captured!");

      // Play token capture sound
      playTokenCaptureSound();

      const captureMessage =
        capturedCount === 1
          ? `${currentPlayerIndex === 0 ? "You" : "Bot"} captured a token! 🎯`
          : `${currentPlayerIndex === 0 ? "You" : "Bot"
          } captured ${capturedCount} tokens! 🎯🎯`;

      setGameMessage(captureMessage);

      // Add a small delay to show the capture message
      setTimeout(() => {
        setGameMessage(
          currentPlayerIndex === 0
            ? "Your turn continues..."
            : "Bot's turn continues..."
        );
      }, 2000);

      return true; // Token was captured
    }

    return false; // No token was captured
  };

  const checkWinCondition = (gameState, playerIndex) => {
    const finishedTokens = gameState.players[playerIndex].tokens.filter(
      (token) => token.isFinished
    );
    console.log(
      `Checking win condition for player ${playerIndex}:`,
      finishedTokens.length,
      "finished tokens"
    );

    // Check if this is a single token win and there are more tokens to play
    if (finishedTokens.length === 1 && !gameState.winner) {
      const remainingTokens = gameState.players[playerIndex].tokens.filter(
        (token) => !token.isFinished
      );

      if (remainingTokens.length > 0) {
        // Single token won but more tokens remain - give another turn
        console.log(
          `Player ${playerIndex} finished a token! More tokens remain.`
        );
        setGameMessage(
          playerIndex === 0
            ? "🎉 Token finished! You have more tokens to play. Roll again!"
            : "🎉 Bot finished a token! Bot has more tokens to play."
        );

        // If it's the user's turn, allow them to roll again
        if (playerIndex === 0) {
          setHasRolledThisTurn(false);
          setCurrentPlayer(0); // Keep user's turn
          // Start timer for user's turn
          startTimer(0);
        } else {
          // If it's bot's turn, trigger another roll
          setBotNeedsToRoll((prev) => !prev);
        }
        return; // Don't check for full win yet
      }
    }

    if (finishedTokens.length === 4 && !gameState.winner) {
      console.log(`Player ${playerIndex} won the game!`);

      // Use setGameState to properly update winner state (prevents flickering)
      setGameState((prev) => ({
        ...prev,
        winner: playerIndex,
      }));

      // Stop timer when game ends
      stopTimer();

      // Play game winning sound
      if (gameWonAudioRef.current) {
        console.log("Playing game winning sound");
        gameWonAudioRef.current.volume = 0.9;
        gameWonAudioRef.current.currentTime = 0;
        gameWonAudioRef.current.play().catch((err) => {
          console.warn("Could not play game winning sound:", err);
        });
      } else {
        console.warn(
          "gameWonAudioRef.current is null - cannot play game winning sound"
        );
      }

      // Set appropriate message for winner
      if (playerIndex === 0) {
        setGameMessage("🎉 You won! Congratulations!");
      } else {
        setGameMessage("🤖 Bot won! Better luck next time!");
      }
    }
  };

  const handleBotTurn = async () => {
    // Bot rolls dice with animation
    setIsRolling(true);
    const botIndex = currentPlayer; // 1,2,3
    setGameMessage(
      `Bot ${botIndex === 1 ? "Yellow" : botIndex === 2 ? "Blue" : "Green"
      } is rolling dice...`
    );

    // Play dice sound for bot turn
    if (diceAudioRef.current) {
      diceAudioRef.current.volume = 0.6;
      diceAudioRef.current.currentTime = 0;
      diceAudioRef.current.play().catch((err) => {
        console.warn("Could not play dice sound:", err);
      });
    }

    // Animate dice rolling for bot
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(async () => {
      clearInterval(rollInterval);
      const botDiceValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(botDiceValue);
      setIsRolling(false);

      setTimeout(async () => {
        // botIndex is already defined above
        const validMoves = getValidMoves(botIndex, botDiceValue);

        if (validMoves.length > 0) {
          // Auto-move if there's only one valid move
          if (validMoves.length === 1) {
            setGameMessage(
              `Bot ${botIndex === 1 ? "Yellow" : botIndex === 2 ? "Blue" : "Green"
              } is moving their only available token...`
            );
            await moveToken(botIndex, validMoves[0], botDiceValue);
          } else {
            // Multiple moves available - use AI strategy
            let chosenMove = validMoves[0];

            // Priority 1: Finish a token if possible
            const finishingMoves = validMoves.filter((tokenIndex) => {
              const token = gameState.players[botIndex].tokens[tokenIndex];
              if (token.isInHomeStretch) {
                return token.position + botDiceValue === 5;
              }
              return false;
            });

            if (finishingMoves.length > 0) {
              chosenMove = finishingMoves[0];
            } else {
              // Priority 2: Move tokens out of home with 6
              const homeTokens = validMoves.filter(
                (tokenIndex) =>
                  gameState.players[botIndex].tokens[tokenIndex].isHome
              );

              if (homeTokens.length > 0 && botDiceValue === 6) {
                chosenMove = homeTokens[0];
              } else {
                // Priority 3: Move token that can capture
                const captureMoves = validMoves.filter((tokenIndex) => {
                  return wouldCapture(botIndex, tokenIndex, botDiceValue);
                });

                if (captureMoves.length > 0) {
                  chosenMove = captureMoves[0];
                } else {
                  // Priority 4: Move token furthest along
                  chosenMove = validMoves.reduce((best, current) => {
                    const bestToken = gameState.players[botIndex].tokens[best];
                    const currentToken =
                      gameState.players[botIndex].tokens[current];

                    // Prioritize tokens in home stretch
                    if (
                      bestToken.isInHomeStretch &&
                      !currentToken.isInHomeStretch
                    )
                      return best;
                    if (
                      !bestToken.isInHomeStretch &&
                      currentToken.isInHomeStretch
                    )
                      return current;

                    if (
                      bestToken.isInHomeStretch &&
                      currentToken.isInHomeStretch
                    ) {
                      return currentToken.position > bestToken.position
                        ? current
                        : best;
                    }

                    // For tokens on main board, calculate progress
                    const playerStartPos = playerStartPositions[botIndex];

                    const getBestProgress = (token) => {
                      if (token.isHome) return -1;
                      if (token.position >= playerStartPos) {
                        return token.position - playerStartPos;
                      } else {
                        return 52 - playerStartPos + token.position;
                      }
                    };

                    const bestProgress = getBestProgress(bestToken);
                    const currentProgress = getBestProgress(currentToken);

                    return currentProgress > bestProgress ? current : best;
                  });
                }
              }
            }

            await moveToken(botIndex, chosenMove, botDiceValue);
          }
        } else {
          // No valid moves
          setConsecutiveSixes((prev) => ({ ...prev, [botIndex]: 0 }));
          // Pass to next player in custom order
          const nextPlayer = getNextPlayer(botIndex);
          setCurrentPlayer(nextPlayer);
          setGameMessage(nextPlayer === 0 ? "Your turn!" : "Bot's turn!");
          setBotNeedsToRoll(false); // Reset bot roll trigger
          setHasRolledThisTurn(false); // Reset for new turn
        }

        setBotThinking(false);
      }, 1000);
    }, 1000);
  };

  const rollDice = () => {
    if (
      isRolling ||
      currentPlayer !== 0 ||
      gameState.winner ||
      !gameState.gamePaid ||
      hasRolledThisTurn || // Prevent rolling if already rolled this turn
      isMovingToken || // Prevent rolling during movement
      isAutoMoving // Prevent rolling during auto-movement
    ) {
      console.log("Dice roll blocked:", {
        isRolling,
        currentPlayer,
        winner: gameState.winner,
        gamePaid: gameState.gamePaid,
        hasRolledThisTurn,
        isMovingToken,
        isAutoMoving,
      });
      return;
    }

    // Stop timer when user rolls dice
    stopTimer();

    if (!gameState.gameStarted) {
      setGameState((prev) => ({ ...prev, gameStarted: true }));
    }

    // Play dice sound
    if (diceAudioRef.current) {
      diceAudioRef.current.volume = 0.6;
      diceAudioRef.current.currentTime = 0;
      diceAudioRef.current.play().catch((err) => {
        console.warn("Could not play dice sound:", err);
      });
    }

    setIsRolling(true);
    setHasRolledThisTurn(true);
    setGameMessage("Rolling dice...");

    // Animate dice rolling
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const newDiceValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newDiceValue);
      setIsRolling(false);

      // Check for valid moves
      const validMoves = getValidMoves(0, newDiceValue);

      if (validMoves.length > 0) {
        setPossibleMoves(validMoves);

        // Start timer for user's turn after rolling
        startTimer(0);

        // Check if any move can capture
        const captureMoves = validMoves.filter((move) =>
          wouldCapture(0, move, newDiceValue)
        );

        // Auto-move if there's only one valid move
        if (validMoves.length === 1) {
          setGameMessage(
            `You rolled ${newDiceValue}! Auto-moving your only available token...`
          );

          // Set auto-moving flag to prevent clicks
          setIsAutoMoving(true);

          // Small delay to show the message, then auto-move
          setTimeout(() => {
            moveToken(0, validMoves[0], newDiceValue);
          }, 1000);
        } else {
          // Multiple moves available - let user choose
          if (captureMoves.length > 0) {
            setGameMessage(
              `You rolled ${newDiceValue}! 🎯 You can capture an opponent token! Select a red-highlighted token. You have ${timeLeft} seconds!`
            );
          } else if (newDiceValue === 6) {
            setGameMessage(
              `You rolled ${newDiceValue}! Select a token to move. You'll get another turn! You have ${timeLeft} seconds!`
            );
          } else {
            setGameMessage(
              `You rolled ${newDiceValue}! Select a token to move. You have ${timeLeft} seconds!`
            );
          }
        }
      } else {
        setGameMessage(
          `You rolled ${newDiceValue} but have no valid moves. Next player's turn!`
        );
        setConsecutiveSixes((prev) => ({ ...prev, 0: 0 }));
        // Stop timer since user has no moves
        stopTimer();
        // Don't reset hasRolledThisTurn - turn is over
        setTimeout(() => {
          setBotThinking(false); // Ensure bot is not stuck in thinking state
          // Move to next player per TURN_ORDER
          setCurrentPlayer(getNextPlayer(0));
          setBotNeedsToRoll((prev) => !prev); // Force trigger bot
        }, 2000);
      }
    }, 1000);
  };

  // Handle token click
  const handleTokenClick = (playerIndex, tokenIndex) => {
    console.log("Token clicked:", {
      playerIndex,
      tokenIndex,
      currentPlayer,
      possibleMoves,
      isMovingToken,
    });

    // Only allow clicking on user's own tokens (playerIndex === 0)
    if (playerIndex !== 0) {
      console.log("Token click blocked: Can only click on your own tokens");
      return;
    }

    // Prevent clicking if any token is currently moving or auto-moving
    if (isMovingToken || isAutoMoving) {
      console.log(
        "Token click blocked: Token is currently moving or auto-moving"
      );
      return;
    }

    if (
      currentPlayer !== 0 ||
      gameState.winner ||
      !possibleMoves.includes(tokenIndex)
    ) {
      console.log("Token click blocked:", {
        currentPlayer,
        winner: gameState.winner,
        possibleMoves,
        isMovingToken,
      });
      return;
    }

    console.log("Moving token:", { playerIndex, tokenIndex, diceValue });

    // Stop timer when token is clicked
    stopTimer();

    moveToken(0, tokenIndex, diceValue);
  };

  // Render a token
  const renderToken = (playerIndex, tokenIndex) => {
    const token = gameState.players[playerIndex].tokens[tokenIndex];
    const isClickable =
      currentPlayer === 0 &&
      playerIndex === 0 &&
      possibleMoves.includes(tokenIndex) &&
      !isMovingToken && // Prevent clicking when any token is moving
      !isAutoMoving; // Prevent clicking when auto-moving
    const isSelected = selectedToken === tokenIndex && currentPlayer === 0;

    // Debug logging for clickable tokens
    if (playerIndex === 0 && isClickable) {
      console.log(`Token ${tokenIndex} is clickable:`, {
        currentPlayer,
        possibleMoves,
        isClickable,
      });
    }

    const tokenSize =
      isMobile && isPortrait ? "w-8 h-8" : isMobile ? "w-10 h-10" : "w-14 h-14";

    const gotiImage =
      playerIndex === 0
        ? "/ludo/redgotti.png"
        : playerIndex === 1
          ? "/ludo/yellowgotti.png"
          : playerIndex === 2
            ? "/ludo/bluegotti.png"
            : "/ludo/greengotti.png";

    // Get the color for the circle background
    const getTokenColor = (playerIndex) => {
      switch (playerIndex) {
        case 0:
          return "#CF1D1B"; // Red
        case 1:
          return "#FFDE16"; // Yellow
        case 2:
          return "#28AEFF"; // Blue
        case 3:
          return "#019F4A"; // Green
        default:
          return "#CF1D1B";
      }
    };

    return (
      <motion.div
        key={`${playerIndex}-token-${tokenIndex}`}
        className={`${tokenSize} relative cursor-default`}
        initial={{ scale: 0 }}
        animate={{
          scale: isClickable && playerIndex === 0 ? [1, 1.1, 1] : 1,
          rotate: isSelected ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          delay: tokenIndex * 0.1,
          type: "spring",
          stiffness: 260,
          damping: 20,
          scale: {
            repeat: isClickable && playerIndex === 0 ? Infinity : 0,
            duration: 1,
          },
        }}
        style={{
          zIndex: isClickable ? 10 : 1,
        }}
      >
        {/* Single colored circle for all tokens */}
        <div
          className={`absolute inset-2 rounded-full pointer-events-none`}
          style={{
            backgroundColor: getTokenColor(playerIndex),
            zIndex: 1,
            top: token.isHome ? "10%" : "auto",
          }}
        />

        {/* Simple colored circle for tokens on the board (same as home tokens) */}
        {!token.isHome && !token.isFinished && (
          <div className="relative w-full h-full  pointer-events-none">
            {/* Colored circle - same design as home tokens */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                backgroundColor: getTokenColor(playerIndex),
                zIndex: 2,
              }}
            />
          </div>
        )}

        {/* Inner circle for finished tokens in center */}
        {token.isFinished && (
          <div className="relative w-full h-full pointer-events-none">
            {/* Colored circle for finished tokens */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                backgroundColor: getTokenColor(playerIndex),
                zIndex: 2,
              }}
            />
          </div>
        )}

        {/* Clickable goti image for home tokens only (finished tokens are shown in center) */}
        {token.isHome && !token.isFinished && (
          <motion.div
            className="w-full h-full relative z-10"
            onClick={() => handleTokenClick(playerIndex, tokenIndex)}
            style={{
              cursor: isClickable && playerIndex === 0 ? "pointer" : "default",
            }}
            whileHover={{
              scale: isClickable && playerIndex === 0 ? 1.2 : 1.1,
              rotate: playerIndex === 0 ? 10 : 0,
            }}
            whileTap={{ scale: playerIndex === 0 ? 0.9 : 1 }}
          >
            <img
              src={gotiImage}
              alt={`${playerIndex === 0
                ? "Red"
                : playerIndex === 1
                  ? "Green"
                  : playerIndex === 2
                    ? "Blue"
                    : "Yellow"
                } goti ${tokenIndex + 1}`}
              className="w-full h-full absolute bottom-2 object-contain pointer-events-none"
              style={{
                filter: token.isFinished
                  ? "brightness(0.7) saturate(0.5)"
                  : "none",
              }}
            />
            {/* Clickable overlay for visual feedback */}
            {isClickable && playerIndex === 0 && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: wouldCapture(0, tokenIndex, diceValue)
                    ? "0 0 0 2px rgba(255, 0, 0, 0.8), 0 0 0 4px rgba(255, 0, 0, 0.4), 0 0 10px rgba(255, 0, 0, 0.6)"
                    : "0 0 0 2px rgba(255, 255, 0, 0.6), 0 0 0 4px rgba(255, 255, 0, 0.3)",
                  backgroundColor: wouldCapture(0, tokenIndex, diceValue)
                    ? "rgba(255, 0, 0, 0.2)"
                    : "rgba(255, 255, 0, 0.1)",
                  zIndex: 2,
                }}
              />
            )}
            {isSelected && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow:
                    "0 0 0 3px rgba(59, 130, 246, 0.8), 0 0 0 6px rgba(59, 130, 246, 0.4)",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  zIndex: 2,
                }}
              />
            )}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Render a board cell
  const renderCell = (
    color = null,
    hasStar = false,
    hasGreenImage = false,
    hasRedImage = false,
    hasBlueImage = false,
    hasYellowImage = false,
    index
  ) => {
    const starSize =
      isMobile && isPortrait
        ? "text-[12px]"
        : isMobile
          ? "text-[14px]"
          : "text-2xl";

    // Map color names to proper Tailwind classes
    const getColorClass = (color) => {
      switch (color) {
        case "red":
          return "bg-[#CF1D1B]";
        case "green":
          return "bg-[#019F4A]";
        case "blue":
          return "bg-[#28AEFF]";
        case "yellow":
          return "bg-[#FFDE16]";
        default:
          return "bg-white";
      }
    };

    return (
      <motion.div
        key={`cell-${index}`}
        className={`w-full h-full md:border-[0.5px] border-[0.1px] md:border-black border-gray-400 flex items-center justify-center ${color ? getColorClass(color) : "bg-white"
          }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.01 }}
      >
        {hasStar && (
          <div className={` flex items-center justify-center`}>
            <img
              src="/ludo/star.png"
              alt="Safe zone"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {hasGreenImage && (
          <div className="flex items-center justify-center rotate-90">
            <img
              src="/ludo/greenarrow.png"
              alt="Arrow"
              className="w-full h-full object-contain p-[2px]"
            />
          </div>
        )}

        {hasRedImage && (
          <div className="flex items-center justify-center rotate-180">
            <img
              src="/ludo/redarrow.png"
              alt="Arrow"
              className="w-full h-full object-contain p-[2px]"
            />
          </div>
        )}

        {hasBlueImage && (
          <div className="flex items-center justify-center rotate-270">
            <img
              src="/ludo/bluearrow.png"
              alt="Arrow"
              className="w-full h-full object-contain p-[2px]"
            />
          </div>
        )}

        {hasYellowImage && (
          <div className="flex items-center justify-center rotate-0">
            <img
              src="/ludo/yellowarrow.png"
              alt="Arrow"
              className="w-full h-full object-contain p-[2px]"
            />
          </div>
        )}
      </motion.div>
    );
  };

  // Render dice dots based on value
  const renderDiceDots = (diceValue, isMobile = false) => {
    const dotSize = isMobile ? "w-2 h-2" : "md:w-1 md:h-1";

    const dotPositions = {
      1: [{ top: "50%", left: "50%" }],
      2: [
        { top: "25%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
      3: [
        { top: "25%", left: "25%" },
        { top: "50%", left: "50%" },
        { top: "75%", left: "75%" },
      ],
      4: [
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
      5: [
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "50%", left: "50%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
      6: [
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "50%", left: "25%" },
        { top: "50%", left: "75%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
    };

    if (!dotPositions[diceValue]) return null;

    return dotPositions[diceValue].map((pos, index) => (
      <div
        key={index}
        className={`absolute ${dotSize} bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2`}
        style={{
          top: pos.top,
          left: pos.left,
        }}
      />
    ));
  };

  // Render dice
  const renderDice = () => {
    const diceSize =
      isMobile && isPortrait
        ? "w-14 h-14"
        : isMobile
          ? "w-12 h-12"
          : "w-20 h-20";
    const dotSize =
      isMobile && isPortrait
        ? "w-1.5 h-1.5"
        : isMobile
          ? "w-1.5 h-1.5"
          : "w-3 h-3";

    const isDiceDisabled =
      isRolling ||
      currentPlayer !== 0 ||
      gameState.winner ||
      !gameState.gamePaid ||
      hasRolledThisTurn || // Prevent rolling if already rolled this turn
      isMovingToken || // Disable during movement
      isAutoMoving || // Disable during auto-movement
      !hasAnyValidMoves(0);

    return (
      <motion.div
        className={`${diceSize} relative rounded-xl cursor-pointer flex ${isDiceDisabled
          ? "bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-gray-600 cursor-not-allowed opacity-60 shadow-lg"
          : "bg-gradient-to-br from-white via-gray-50 to-gray-100 border-2 border-gray-300 shadow-2xl hover:shadow-3xl"
          }`}
        style={{
          boxShadow: isDiceDisabled
            ? "0 10px 25px rgba(0,0,0,0.2)"
            : "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 20px rgba(59, 130, 246, 0.1)",
        }}
        onClick={rollDice}
        animate={
          isRolling
            ? {
              rotate: [0, 360, 0, 360],
              scale: [1, 0.8, 1, 0.8, 1],
              y: [0, -10, 0, -10, 0],
            }
            : {}
        }
        transition={{
          duration: isRolling ? 1 : 0.3,
          ease: "easeInOut",
          repeat: isRolling ? Infinity : 0,
        }}
        whileHover={{
          scale: isDiceDisabled ? 1 : 1.1,
          y: isDiceDisabled ? 0 : -5,
          rotateY: isDiceDisabled ? 0 : 5,
        }}
        whileTap={{
          scale: isDiceDisabled ? 1 : 0.9,
          y: isDiceDisabled ? 0 : 2,
        }}
      >
        {dotPositions[diceValue].map((pos, i) => (
          <motion.div
            key={i}
            className={`absolute ${dotSize} rounded-full flex items-center justify-center ${isDiceDisabled
              ? "bg-gradient-to-br from-gray-500 to-gray-600 shadow-inner"
              : "bg-gradient-to-br from-gray-800 to-black shadow-lg"
              }`}
            style={{
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -50%)",
              boxShadow: isDiceDisabled
                ? "inset 0 2px 4px rgba(0,0,0,0.3)"
                : "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: i * 0.05,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </motion.div>
    );
  };

  // Payment Modal Component
  // Static payment modal component - no timer display to prevent blinking
  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-purple-400">
          <div className="text-center">
            <div className="text-6xl mb-6 text-black">🔍</div>

            <h2 className="text-3xl font-bold text-black mb-4 drop-shadow-lg">
              Finding 4 Players...
            </h2>

            <p className="text-black/90 text-xs mb-6 drop-shadow">
              Searching for 3 opponents in {selectedRoom?.name}
            </p>

            {/* <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/30">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Room:</span>
                  <span className="font-bold text-lg text-yellow-200">
                    {selectedRoom?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Entry Fee:</span>
                  <span className="font-bold text-lg text-green-200">
                    {selectedRoom?.entryFee}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Prize Pool:</span>
                  <span className="font-bold text-lg text-yellow-200">
                    {selectedRoom?.prizePool}
                  </span>
                </div>
              </div>
            </div> */}

            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <div
                className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-yellow-600 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="w-3 h-3 bg-green-600 rounded-full animate-pulse"
                style={{ animationDelay: "0.6s" }}
              ></div>
            </div>

            <div className="flex gap-3">
              {/* <button
                onClick={handleBackToLobby}
                className="flex-1 py-3 px-6 bg-white/20 text-white rounded-lg font-bold text-lg hover:bg-white/30 transition-colors shadow-lg border border-white/30"
              >
                Cancel Search
              </button>
               */}
              {/* <button
                onClick={() => {
                  console.log("Manual join button clicked");
                  handleJoinGame();
                }}
                className="flex-1 py-3 px-6 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
              >
                Join Now
              </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Winning Screen Component
  const WinningScreen = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    // Play win sound when user wins
    useEffect(() => {
      if (gameState.winner === 0 && !gameProcessed) {
        if (gameWonAudioRef.current) {
          gameWonAudioRef.current.volume = 0.9;
          gameWonAudioRef.current.currentTime = 0;
          gameWonAudioRef.current.play().catch((err) => {
            console.warn("Could not play win sound:", err);
          });
        }
      }
    }, [gameState.winner, gameProcessed]);

    return (
      <AnimatePresence>
        {gameState.winner === 0 && !gameProcessed && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-yellow-300"
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🏆
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  CONGRATULATIONS!
                </motion.h2>

                <motion.p
                  className="text-white/90 text-lg mb-6 drop-shadow"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  You won the Ludo game! 🎉
                </motion.p>

                <motion.div
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/30"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Prize Money:</span>
                    <span className="font-bold text-xl text-yellow-200">
                      {selectedRoom?.prizePool || 200}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">New Balance:</span>
                    <span className="font-bold text-xl text-green-200">
                      {userWallet + (selectedRoom?.prizePool || 200)}
                    </span>
                  </div>
                </motion.div>

                <motion.button
                  onClick={async () => {
                    if (isProcessing) return; // Prevent multiple clicks
                    setIsProcessing(true);

                    try {
                      const phone = localStorage.getItem("phone");
                      const sessionId = localStorage.getItem(
                        "currentFourPlayerLudoSessionId"
                      );

                      console.log(
                        "Processing win - Phone:",
                        phone,
                        "SessionId:",
                        sessionId
                      );
                      console.log("Selected room:", selectedRoom);

                      if (!phone || !sessionId) {
                        alert("Session data not found");
                        setIsProcessing(false);
                        return;
                      }

                      // Process result via API
                      const resultResponse = await fetch(
                        "/api/ludo/process-result",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            phone: phone,
                            isWinner: true,
                            prizeAmount: selectedRoom.prizePool,
                            roomId: selectedRoom.id,
                            roomName: selectedRoom.name,
                          }),
                        }
                      );

                      const resultData = await resultResponse.json();
                      console.log("Process result response:", resultData);

                      if (resultResponse.ok) {
                        // Update session as completed
                        await fetch("/api/ludo/sessions/update", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            sessionId: sessionId,
                            isCompleted: true,
                            result: {
                              isWinner: true,
                              prizeAmount: selectedRoom.prizePool,
                            },
                          }),
                        });

                        console.log(
                          "Updated wallet balance:",
                          resultData.newBalance
                        );
                        setUserWallet(resultData.newBalance);
                        setGameProcessed(true); // Mark game as processed

                        // Stop session timeout timer
                        stopSessionTimeout();

                        localStorage.removeItem(
                          "currentFourPlayerLudoSessionId"
                        );
                        // Clear all 4-player game state from localStorage
                        localStorage.removeItem("fourPlayerLudoGameState");
                        localStorage.removeItem("fourPlayerLudoSelectedRoom");
                        localStorage.removeItem("fourPlayerLudoCurrentPlayer");
                        localStorage.removeItem("fourPlayerLudoDiceValue");
                        localStorage.removeItem(
                          "fourPlayerLudoConsecutiveSixes"
                        );
                        localStorage.removeItem("fourPlayerLudoRedDots");
                        localStorage.removeItem(
                          "fourPlayerLudoSessionStartTime"
                        );
                        // Navigate to ludo page after successful processing
                        window.location.href = "games/ludo/FourPlayerLudo";
                      } else {
                        console.error("Failed to process result:", resultData);
                        alert(
                          "Failed to process result: " +
                          (resultData.error || "Unknown error")
                        );
                        setGameProcessed(true); // Mark game as processed on error
                      }
                    } catch (error) {
                      console.error("Error processing result:", error);
                      alert("Failed to process result");
                      setGameProcessed(true); // Mark game as processed on error
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  className="w-full py-3 px-6 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-yellow-50 transition-colors shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/games/ludo/FourPlayerLudo">
                    {isProcessing ? "Processing..." : "Play Again"}
                  </Link>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Losing Screen Component
  const LosingScreen = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    return (
      <AnimatePresence>
        {gameState.winner === 1 && !gameProcessed && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-gray-500"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -50 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              <div className="text-center">
                <motion.h2
                  className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  GAME OVER YOU LOST!
                </motion.h2>

                <motion.p
                  className="text-white/90 text-lg mb-6 drop-shadow"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Better luck next time!
                </motion.p>

                <motion.div
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">
                      Your Balance:
                    </span>
                    <span className="font-bold text-xl text-yellow-200">
                      {userWallet}
                    </span>
                  </div>
                </motion.div>

                <motion.button
                  onClick={async () => {
                    if (isProcessing) return; // Prevent multiple clicks
                    setIsProcessing(true);

                    try {
                      const phone = localStorage.getItem("phone");
                      const sessionId = localStorage.getItem(
                        "currentFourPlayerLudoSessionId"
                      );

                      console.log(
                        "Processing loss - Phone:",
                        phone,
                        "SessionId:",
                        sessionId
                      );
                      console.log("Selected room:", selectedRoom);

                      if (!phone || !sessionId) {
                        alert("Session data not found");
                        setIsProcessing(false);
                        return;
                      }

                      // Process result via API
                      const resultResponse = await fetch(
                        "/api/ludo/process-result",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            phone: phone,
                            isWinner: false,
                            prizeAmount: 0,
                            roomId: selectedRoom.id,
                            roomName: selectedRoom.name,
                          }),
                        }
                      );

                      const resultData = await resultResponse.json();
                      console.log("Process result response:", resultData);

                      if (resultResponse.ok) {
                        // Update session as completed
                        await fetch("/api/ludo/sessions/update", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            sessionId: sessionId,
                            isCompleted: true,
                            result: {
                              isWinner: false,
                              prizeAmount: 0,
                            },
                          }),
                        });

                        console.log(
                          "Updated wallet balance:",
                          resultData.newBalance
                        );
                        setUserWallet(resultData.newBalance);

                        // Stop session timeout timer
                        stopSessionTimeout();

                        localStorage.removeItem(
                          "currentFourPlayerLudoSessionId"
                        );
                        // Clear all 4-player game state from localStorage
                        localStorage.removeItem("fourPlayerLudoGameState");
                        localStorage.removeItem("fourPlayerLudoSelectedRoom");
                        localStorage.removeItem("fourPlayerLudoCurrentPlayer");
                        localStorage.removeItem("fourPlayerLudoDiceValue");
                        localStorage.removeItem(
                          "fourPlayerLudoConsecutiveSixes"
                        );
                        localStorage.removeItem("fourPlayerLudoRedDots");
                        localStorage.removeItem(
                          "fourPlayerLudoSessionStartTime"
                        );
                        // Navigate to ludo page after successful processing
                        window.location.href = "/games/ludo/FourPlayerLudo";
                      } else {
                        console.error("Failed to process result:", resultData);
                        alert(
                          "Failed to process result: " +
                          (resultData.error || "Unknown error")
                        );
                      }
                    } catch (error) {
                      console.error("Error processing result:", error);
                      alert("Failed to process result");
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  className="w-full py-3 px-6 bg-white text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/games/ludo/TwoPlayerLudo">
                    {isProcessing ? "Processing..." : "Return to Ludo"}
                  </Link>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Render tokens on board

  const renderBoardTokens = () => {
    const tokens = [];
    const positionGroups = {};

    // First, group tokens by their position
    Object.keys(gameState.players).forEach((playerIndex) => {
      gameState.players[playerIndex].tokens.forEach((token, tokenIndex) => {
        if (!token.isHome) {
          let boardPos;

          if (token.isFinished) {
            // Finished tokens go to their respective colored areas in center home
            if (playerIndex === "0") {
              // Red tokens go to red area (right side of center)
              boardPos = { x: 8, y: 7, section: "center", color: "red" };
            } else if (playerIndex === "1") {
              // Yellow tokens go to yellow area (left side of center)
              boardPos = { x: 6, y: 7, section: "center", color: "yellow" };
            } else if (playerIndex === "2") {
              // Blue tokens go to blue area (bottom of center)
              boardPos = { x: 7, y: 8, section: "center", color: "blue" };
            } else if (playerIndex === "3") {
              // Green tokens go to green area (top of center)
              boardPos = { x: 7, y: 6, section: "center", color: "green" };
            }
          } else if (token.isInHomeStretch) {
            // Token is in home stretch
            boardPos = homeStretchPaths[playerIndex][token.position];
          } else {
            // Token is on main board
            boardPos = boardPath[token.position];
          }

          if (boardPos) {
            const positionKey = `${boardPos.x}-${boardPos.y}`;
            if (!positionGroups[positionKey]) {
              positionGroups[positionKey] = [];
            }
            positionGroups[positionKey].push({
              playerIndex,
              tokenIndex,
              boardPos,
              token,
            });
          }
        }
      });
    });

    // Now render tokens with offsets for multiple tokens on same position
    Object.keys(positionGroups).forEach((positionKey) => {
      const tokensAtPosition = positionGroups[positionKey];
      const basePos = tokensAtPosition[0].boardPos;

      tokensAtPosition.forEach((tokenData, index) => {
        const { playerIndex, tokenIndex, boardPos, token } = tokenData;

        const tokenSize =
          isMobile && isPortrait
            ? "w-8 h-8"
            : isMobile
              ? "w-6 h-6"
              : "w-12 h-12";

        const gotiImage =
          playerIndex === "0"
            ? "/ludo/redgotti.png"
            : playerIndex === "1"
              ? "/ludo/yellowgotti.png"
              : playerIndex === "2"
                ? "/ludo/bluegotti.png"
                : "/ludo/greengotti.png";

        // Calculate offset for multiple tokens
        let offsetX = 0;
        let offsetY = 0;
        let zIndex = 9999;

        if (tokensAtPosition.length > 1) {
          // Stack tokens with more visible offsets
          const angle = (index / tokensAtPosition.length) * 2 * Math.PI;
          const radius = isMobile && isPortrait ? 20 : isMobile ? 16 : 24; // Increased radius for better visibility
          offsetX = Math.cos(angle) * radius;
          offsetY = Math.sin(angle) * radius;

          // Ensure user tokens (playerIndex === "0") are ALWAYS above bot tokens
          if (playerIndex === "0") {
            zIndex = 20000; // User tokens get very high z-index
          } else {
            zIndex = 10000; // Bot tokens get much lower z-index
          }
        } else {
          // Single token - user tokens should still be on top
          if (playerIndex === "0") {
            zIndex = 20000;
          } else {
            zIndex = 10000;
          }
        }

        tokens.push(
          <motion.div
            key={`board-token-${playerIndex}-${tokenIndex}`}
            className={`absolute ${tokenSize}`}
            style={{
              left: `${(boardPos.x / 15) * 100}%`,
              top: `${(boardPos.y / 15) * 100}%`,
              transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
              zIndex: zIndex,
              // Add glow effect for stacked tokens
              filter:
                tokensAtPosition.length > 1 && index === 0
                  ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.4))"
                  : "none",
            }}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            layoutId={`token-${playerIndex}-${tokenIndex}`}
          >
            <motion.div
              className="w-full h-full relative"
              onClick={
                playerIndex === "0"
                  ? () => handleTokenClick(parseInt(playerIndex), tokenIndex)
                  : undefined
              }
              style={{
                cursor:
                  currentPlayer === 0 &&
                    playerIndex === "0" &&
                    possibleMoves.includes(tokenIndex) &&
                    !isMovingToken
                    ? "pointer"
                    : "default",
                // Only allow clicking on user tokens (playerIndex === "0") and when not moving or auto-moving
                pointerEvents:
                  playerIndex === "0" && !isMovingToken && !isAutoMoving
                    ? "auto"
                    : "none",
              }}
              whileHover={{
                scale:
                  currentPlayer === 0 &&
                    playerIndex === "0" &&
                    possibleMoves.includes(tokenIndex) &&
                    !isMovingToken &&
                    !isAutoMoving
                    ? 1.2
                    : 1.1,
                rotate:
                  currentPlayer === 0 &&
                    playerIndex === "0" &&
                    !isMovingToken &&
                    !isAutoMoving
                    ? 10
                    : 0,
              }}
              whileTap={{
                scale:
                  currentPlayer === 0 &&
                    playerIndex === "0" &&
                    !isMovingToken &&
                    !isAutoMoving
                    ? 0.9
                    : 1,
              }}
            >
              <img
                src={gotiImage}
                alt={`${playerIndex === "0"
                  ? "Red"
                  : playerIndex === "1"
                    ? "Yellow"
                    : playerIndex === "2"
                      ? "Blue"
                      : "Green"
                  } goti ${tokenIndex + 1}`}
                className="w-full h-full object-contain absolute md:-top-5 -top-3 md:-left-1 -left-1 z-999 pointer-events-none"
                style={{
                  // Add special styling for finished tokens in center home
                  filter: token.isFinished
                    ? "brightness(1.2) saturate(1.5) drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))"
                    : "none",
                  transform: token.isFinished ? "scale(1.1)" : "scale(1)",
                }}
              />

              {/* Token count indicator for stacked tokens - only show on first token */}
              {tokensAtPosition.length > 1 && index === 0 && (
                <>
                  {(() => {
                    // Count tokens by color
                    const redTokens = tokensAtPosition.filter(
                      (t) => t.playerIndex === "0"
                    ).length;
                    const yellowTokens = tokensAtPosition.filter(
                      (t) => t.playerIndex === "1"
                    ).length;
                    const blueTokens = tokensAtPosition.filter(
                      (t) => t.playerIndex === "2"
                    ).length;
                    const greenTokens = tokensAtPosition.filter(
                      (t) => t.playerIndex === "3"
                    ).length;

                    // Get all colors present
                    const colorsPresent = [];
                    if (redTokens > 0)
                      colorsPresent.push({
                        color: "red",
                        count: redTokens,
                        bgColor: "#CF1D1B",
                        textColor: "#fff",
                      });
                    if (yellowTokens > 0)
                      colorsPresent.push({
                        color: "yellow",
                        count: yellowTokens,
                        bgColor: "#FFDE16",
                        textColor: "#000",
                      });
                    if (blueTokens > 0)
                      colorsPresent.push({
                        color: "blue",
                        count: blueTokens,
                        bgColor: "#28AEFF",
                        textColor: "#fff",
                      });
                    if (greenTokens > 0)
                      colorsPresent.push({
                        color: "green",
                        count: greenTokens,
                        bgColor: "#019F4A",
                        textColor: "#fff",
                      });

                    // If only one color, show single indicator
                    if (colorsPresent.length === 1) {
                      const colorInfo = colorsPresent[0];
                      return (
                        <motion.div
                          className="absolute -top-4 md:-right-1 right-[0.5px] text-white rounded-full flex items-center justify-center pointer-events-none z-10000"
                          style={{
                            width:
                              isMobile && isPortrait
                                ? "16px"
                                : isMobile
                                  ? "14px"
                                  : "18px",
                            height:
                              isMobile && isPortrait
                                ? "16px"
                                : isMobile
                                  ? "14px"
                                  : "18px",
                            fontSize:
                              isMobile && isPortrait
                                ? "10px"
                                : isMobile
                                  ? "8px"
                                  : "11px",
                            fontWeight: "bold",
                            zIndex: 10001,
                            border: "1px solid white",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                            backgroundColor: colorInfo.bgColor,
                            color: colorInfo.textColor,
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: 0.2,
                          }}
                        >
                          {colorInfo.count}
                        </motion.div>
                      );
                    }

                    // If multiple colors, show indicators for each color
                    return (
                      <div className="absolute -top-4 md:-right-1 right-[0.5px] flex flex-col gap-1 pointer-events-none z-10000">
                        {colorsPresent.map((colorInfo, colorIndex) => (
                          <motion.div
                            key={colorInfo.color}
                            className="rounded-full flex items-center justify-center"
                            style={{
                              width:
                                isMobile && isPortrait
                                  ? "14px"
                                  : isMobile
                                    ? "12px"
                                    : "16px",
                              height:
                                isMobile && isPortrait
                                  ? "14px"
                                  : isMobile
                                    ? "12px"
                                    : "16px",
                              fontSize:
                                isMobile && isPortrait
                                  ? "8px"
                                  : isMobile
                                    ? "6px"
                                    : "10px",
                              fontWeight: "bold",
                              zIndex: 10001 + colorIndex,
                              border: "1px solid white",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                              backgroundColor: colorInfo.bgColor,
                              color: colorInfo.textColor,
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                              delay: 0.2 + colorIndex * 0.1,
                            }}
                          >
                            {colorInfo.count}
                          </motion.div>
                        ))}
                      </div>
                    );
                  })()}
                </>
              )}

              {/* Finished token indicator - crown or star */}
              {token.isFinished && (
                <motion.div
                  className="absolute -top-2 -right-2 text-yellow-400 pointer-events-none"
                  style={{
                    fontSize:
                      isMobile && isPortrait
                        ? "12px"
                        : isMobile
                          ? "10px"
                          : "14px",
                    zIndex: 10002,
                    filter: "drop-shadow(0 0 4px rgba(0,0,0,0.8))",
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.3,
                  }}
                ></motion.div>
              )}

              {/* Clickable overlay for visual feedback - only for user tokens when not moving */}
              {currentPlayer === 0 &&
                playerIndex === 0 &&
                possibleMoves.includes(tokenIndex) &&
                !isMovingToken && (
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow: wouldCapture(0, tokenIndex, diceValue)
                        ? "0 0 0 2px rgba(255, 0, 0, 0.8), 0 0 0 4px rgba(255, 0, 0, 0.4), 0 0 10px rgba(255, 0, 0, 0.6)"
                        : "0 0 0 2px rgba(255, 255, 0, 0.6), 0 0 0 4px rgba(255, 255, 0, 0.3)",
                      backgroundColor: wouldCapture(0, tokenIndex, diceValue)
                        ? "rgba(255, 0, 0, 0.2)"
                        : "rgba(255, 255, 0, 0.1)",
                      zIndex: 10000,
                    }}
                  />
                )}

              {/* Special indicator for clickable user tokens in mixed stacks */}
              {currentPlayer === 0 &&
                playerIndex === 0 &&
                possibleMoves.includes(tokenIndex) &&
                tokensAtPosition.length > 1 && (
                  <motion.div
                    className="absolute -bottom-1 -left-1 text-green-400 pointer-events-none"
                    style={{
                      fontSize:
                        isMobile && isPortrait
                          ? "10px"
                          : isMobile
                            ? "8px"
                            : "12px",
                      zIndex: 10002,
                      filter: "drop-shadow(0 0 4px rgba(0,0,0,0.8))",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.4,
                    }}
                  >
                    👆
                  </motion.div>
                )}
              {selectedToken === tokenIndex &&
                currentPlayer === 0 &&
                playerIndex === 0 && (
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow:
                        "0 0 0 3px rgba(59, 130, 246, 0.8), 0 0 0 6px rgba(59, 130, 246, 0.4)",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      zIndex: 10000,
                    }}
                  />
                )}
            </motion.div>
          </motion.div>
        );
      });
    });

    return tokens;
  };

  // Show loading screen while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen w-screen bg-[url('/ludo/Google.jpeg')] bg-cover bg-center flex flex-col items-center justify-center overflow-hidden">
  //       <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-purple-400">
  //         <div className="text-center">
  //           <div className="text-6xl mb-6">🎲🎲🎲🎲</div>
  //           <h2 className="text-2xl font-bold text-gray-800 mb-4">
  //             Loading 4-Player Ludo...
  //           </h2>
  //           <p className=\"text-gray-600 mb-4\">Preparing your game</p>
  //           <div className="flex items-center justify-center space-x-2">
  //             <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
  //             <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
  //             <div className="w-3 h-3 bg-yellow-600 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
  //             <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Show authentication error if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen bg-[url('/ludo/Google.jpeg')] bg-cover bg-center flex flex-col items-center justify-center overflow-hidden">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-red-400">
          <div className="text-center">
            <div className="text-6xl mb-6">🔒🎲</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to play 4-Player Ludo. You will be redirected to the
              login page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                (window.location.href =
                  "/profile/login?redirect=/games/ludo/FourPlayerLudo")
                }
                className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg"
              >
                Login Now
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors shadow-lg"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[url('/ludo/Google.jpeg')] bg-cover bg-center flex flex-col items-center justify-center overflow-hidden">
      <PaymentModal />
      <WinningScreen />
      <LosingScreen />
      {/* <TestLudoAPI /> */}

      {/* Audio Control Button */}
      {/* <button
        onClick={() => {
          if (audioRef.current) {
            if (musicMuted) {
              audioRef.current.muted = false;
              setMusicMuted(false);
            } else {
              audioRef.current.muted = true;
              setMusicMuted(true);
            }
          }
        }}
        style={{ position: "fixed", top: 20, right: 20, zIndex: 99999 }}
        className="bg-black bg-opacity-60 text-yellow-300 px-3 py-2 rounded-full shadow-lg hover:bg-opacity-80 transition-all duration-200"
      >
        {musicMuted ? "🔇" : "🔊"}
      </button> */}

      {/* Back to Lobby Button - Only show when in game */}
      {/* {hasJoined && (
        <button
          onClick={handleBackToLobby}
          style={{ position: "fixed", top: 20, left: 20, zIndex: 99999 }}
          className="bg-black bg-opacity-60 text-white px-3 py-2 rounded-full shadow-lg hover:bg-opacity-80 transition-all duration-200"
        >
          ← Back to Lobby
        </button>
      )} */}

      {/* Game Room Selection */}
      {showGameList && (
        <motion.div
          className="w-full bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back to Dashboard Button */}
          <div className="flex items-start justify-start w-full z-50 bg-transparent p-2">
            {/* <Link 
          href="/games/ludo" 
          className="flex z-50 bg-white backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <Image 
            src="/home.png" 
            alt="Back to Dashboard" 
            width={24} 
            height={24} 
            className="w-8 h-8 "
          />
        </Link> */}

            {/* Test Button */}
            {/* <button
          onClick={() => {
            console.log("Test button clicked - testing capture and win sounds...");
            
            // Test win sound first
            if (gameWonAudioRef.current) {
              console.log("Testing win sound...");
              gameWonAudioRef.current.volume = 0.9;
              gameWonAudioRef.current.currentTime = 0;
              gameWonAudioRef.current.play().catch((err) => {
                console.warn("Win sound test failed:", err);
              });
            } else {
              console.warn("gameWonAudioRef.current is null");
            }
            
            // Test capture sound after 1 second
            setTimeout(() => {
              if (tokenCaptureAudioRef.current) {
                console.log("Testing capture sound...");
                tokenCaptureAudioRef.current.volume = 0.9;
                tokenCaptureAudioRef.current.currentTime = 0;
                tokenCaptureAudioRef.current.play().catch((err) => {
                  console.warn("Capture sound test failed:", err);
                });
              } else {
                console.warn("tokenCaptureAudioRef.current is null");
              }
            }, 1500);
          }}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors shadow-lg"
        >
          🔊 Test Sounds
        </button> */}
          </div>
          <div className="text-center md:mb-16 mb-8 px-4 md:px-6 lg:px-8">
            <h1 className="text-2xl md:text-6xl font-black tracking-tight text-black md:mb-4 mb-2 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
              <Link href="/dashboard">
                <FaArrowLeft />
              </Link>
              🎲 Four Player Ludo Game Rooms
            </h1>
            <p className="text-xs md:text-2xl font-light text-black max-w-xl mx-auto md:mb-10 mb-5">
              Join a room, outsmart your opponents, and claim your rewards!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-10 gap-5 w-full">
              {roomsLoading ? (
                <div className="col-span-full text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                  <p className="mt-4 text-gray-600">Loading game rooms...</p>
                </div>
              ) : GAME_ROOMS1.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-600">No game rooms available at the moment.</p>
                </div>
              ) : (
                GAME_ROOMS1.map((room) => (
                  <motion.div
                    key={room.id}
                    whileHover={{ scale: 1.06, rotateY: 5 }}
                    whileTap={{ scale: 0.98, rotateY: -3 }}
                    onClick={() => handleJoinRoom(room)}
                    className=" group relative overflow-hidden rounded-lg
                            hover:border-yellow-400/60 ring-1 ring-inset ring-indigo-400/10 group-hover:ring-yellow-400/20
                              bg-white shadow-lg
                              backdrop-blur-md transition-all duration-300
                              cursor-pointer 
                              hover:scale-[1.06] hover:-translate-y-3 hover:shadow-[0_0_25px_#eab30855]
                              active:scale-100 border-1 border-gray-300"
                  >
                    {/* Glow overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-50 transition duration-500 z-0 pointer-events-none" />

                    {/* Optional badge */}
                    {/* <div className="absolute top-4 left-4 bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-10">
                    Room #{room.id}
                  </div> */}

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-1 md:space-y-1">
                      <h3 className="md:text-2xl text-xs font-extrabold text-black bg-[#E3E6F7] group-hover:text-yellow-400 transition-all duration-300 md:pt-4 pt-2 md:pb-4 pb-2 ">
                        {room.name}
                      </h3>

                      <div className="flex flex-row gap-4 items-center justify-center text-xs md:text-base">
                        {/* Entry Fee Card */}
                        <div className="flex flex-col justify-center items-center rounded-xl p-3 ">
                          <span className="text-black font-light flex items-center gap-2 md:text-sm text-md pb-1">
                            Entry Fee &nbsp;
                          </span>
                          <span className="w-[100px] text-center text-black font-bold drop-shadow-md md:text-lg text-xl p-2 rounded-full bg-[#E3E6F7]">
                            {room.entryFee}
                          </span>
                        </div>

                        {/* Prize Pool Card */}
                        <div className="flex flex-col justify-between items-center  p-3">
                          <span className="text-black font-light flex items-center gap-2 md:text-sm text-md pb-1">
                            Prize Pool &nbsp;
                          </span>
                          <span className="w-[100px] text-center text-black font-bold drop-shadow-md md:text-lg text-xl p-2 rounded-full bg-[#FFE700]">
                            {room.prizePool}
                          </span>
                        </div>
                      </div>

                      {/* <p className="text-indigo-300 text-xs md:text-sm italic">
                      {room.description}
                    </p> */}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Room Selection Modal */}
      {/* {selectedRoom && !hasJoined && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎲</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Join {selectedRoom.name}
              </h2>
              <p className="text-gray-600 mb-6">
                Pay {selectedRoom.entryFee} to start playing!
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Entry Fee:</span>
                  <span className="font-bold text-lg text-red-600">
                    {selectedRoom.entryFee}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Prize Pool:</span>
                  <span className="font-bold text-lg text-green-600">
                    {selectedRoom.prizePool}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Your Wallet:</span>
                  <span className="font-bold text-lg text-green-600">
                    {userWallet}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBackToLobby}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleJoinGame}
                  disabled={userWallet < selectedRoom.entryFee}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay & Play
                </button>
              </div>

              {userWallet < selectedRoom.entryFee && (
                <p className="text-red-500 text-sm mt-3">
                  Insufficient balance to play
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )} */}
      {/* 
      {isMobile && isPortrait && (
        <motion.div
          className="w-full text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-white">Ludo Game</h1>
        </motion.div>
      )} */}
      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 animate-fade-in">
            <h2 className="text-lg font-bold mb-4">⚠️ Confirm Exit</h2>
            <p className="mb-6">Are you sure you want to exit the game?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowExitModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleExitGame}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Board - Only show when joined */}
      {hasJoined && (
        <div className=" flex flex-col items-center justify-center gap-2 ">
          {/* Back to Dashboard Button */}
          <div
            onClick={() => setShowExitModal(true)}
            className="flex items-start justify-start w-full z-50 bg-transparent p-2"
          >
            <Link
              href="/games/ludo/FourPlayerLudo"
              className="flex z-50 bg-white backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <Image
                src="/home.png"
                alt="Back to Dashboard"
                width={24}
                height={24}
                className="w-8 h-8 "
              />
            </Link>

            {/* Test Button */}
            {/* <button
          onClick={() => {
            console.log("Test button clicked - testing capture and win sounds...");
            
            // Test win sound first
            if (gameWonAudioRef.current) {
              console.log("Testing win sound...");
              gameWonAudioRef.current.volume = 0.9;
              gameWonAudioRef.current.currentTime = 0;
              gameWonAudioRef.current.play().catch((err) => {
                console.warn("Win sound test failed:", err);
              });
            } else {
              console.warn("gameWonAudioRef.current is null");
            }
            
            // Test capture sound after 1 second
            setTimeout(() => {
              if (tokenCaptureAudioRef.current) {
                console.log("Testing capture sound...");
                tokenCaptureAudioRef.current.volume = 0.9;
                tokenCaptureAudioRef.current.currentTime = 0;
                tokenCaptureAudioRef.current.play().catch((err) => {
                  console.warn("Capture sound test failed:", err);
                });
              } else {
                console.warn("tokenCaptureAudioRef.current is null");
              }
            }, 1500);
          }}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors shadow-lg"
        >
          🔊 Test Sounds
        </button> */}
          </div>
          {/* Player Info Boxes - Top Row */}
          <div className="flex flex-row gap-2 md:gap-4 lg:gap-6 w-full ">
            <div className="flex p-2 w-full">
              {/* 5 Points around the circle - Bot Timer (now yellow in top-left) */}
              <div
                className={`flex flex-row gap-1 justify-center items-center p-2 border-2 border-black rounded-full ${timerActive && currentPlayer === 1
                  ? "bg-yellow-300 border-yellow-500"
                  : "bg-gray-300"
                  }`}
              >
                <div
                  className={`w-3 h-3 border-[1.5px] border-black rounded-full ${redDots[1] >= 1
                    ? "bg-[radial-gradient(circle,theme(colors.red.400),black)]"
                    : "bg-[radial-gradient(circle,theme(colors.green.400),black)]"
                    }`}
                ></div>
                <div
                  className={`w-3 h-3 border-[1.5px] border-black rounded-full ${redDots[1] >= 2
                    ? "bg-[radial-gradient(circle,theme(colors.red.400),black)]"
                    : "bg-[radial-gradient(circle,theme(colors.green.400),black)]"
                    }`}
                ></div>
                <div
                  className={`w-3 h-3 border-[1.5px] border-black rounded-full ${redDots[1] >= 3
                    ? "bg-[radial-gradient(circle,theme(colors.red.400),black)]"
                    : "bg-[radial-gradient(circle,theme(colors.green.400),black)]"
                    }`}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex p-2">
                {/* 3 Points around the circle - User (No Timer) */}
                <div className="flex flex-row gap-1 justify-center items-center p-2 border-2 border-black rounded-full bg-gray-300">
                  <div className="w-3 h-3 border-[1.5px] border-black bg-[radial-gradient(circle,theme(colors.green.400),black)] rounded-full"></div>
                  <div className="w-3 h-3 border-[1.5px] border-black bg-[radial-gradient(circle,theme(colors.green.400),black)] rounded-full"></div>
                  <div className="w-3 h-3 border-[1.5px] border-black bg-[radial-gradient(circle,theme(colors.green.400),black)] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-2 md:gap-4 lg:gap-6 w-full ">
            <div className="flex flex-row w-full">
              <div className="flex items-center justify-center">
                <div
                  className={`${isMobile && isPortrait
                    ? "w-12 h-12"
                    : isMobile
                      ? "w-14 h-14"
                      : "w-10 h-10"
                    } border-t-2 border-l-2 border-b-2 border-[#CFBC40] flex items-center justify-center relative
  ${timerActive && currentPlayer === 1
                      ? "bg-black "
                      : "bg-gradient-to-r from-[#0150BD] to-[#9EC7C8]"
                    }`}
                >
                  {timerActive && currentPlayer === 1 ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className=" text-white px-2 py-1 text-xs font-bold">
                        {timeLeft}s
                      </div>
                    </div>
                  ) : (
                    <Image
                      src="/ludo/yellowgotti.png"
                      alt="centered"
                      width={isMobile && isPortrait ? 25 : isMobile ? 32 : 20}
                      height={isMobile && isPortrait ? 25 : isMobile ? 32 : 20}
                      className="object-contain"
                    />
                  )}
                </div>
              </div>
              <div
                className={`${isMobile && isPortrait
                  ? "w-20 h-20"
                  : isMobile
                    ? "w-20 h-10"
                    : "w-24 h-12"
                  } border-2 rounded-lg border-[#CFBC40]  bg-[#A8CAAB] p-1`}
              >
                <div className="border border-black w-full h-full rounded-sm bg-gradient-to-b from-[#F8E4E9] to-[#E1A9A5] flex items-center justify-center">
                  {/* Dice shows for the active player in this seat (yellow) */}
                  {currentPlayer === 1 && (
                    <motion.div
                      className={`${isMobile && isPortrait
                        ? "w-12 h-12"
                        : isMobile
                          ? "w-5 h-5"
                          : "w-6 h-6"
                        } bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative`}
                      onClick={rollDice}
                      animate={isRolling ? { rotate: 360 } : {}}
                      transition={{
                        duration: 0.5,
                        repeat: isRolling ? Infinity : 0,
                        ease: "linear",
                      }}
                    >
                      {/* Dice dots */}
                      {diceValue > 0 &&
                        renderDiceDots(diceValue, isMobile && isPortrait)}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-row">
              <div
                className={`${isMobile && isPortrait
                  ? "w-20 h-20"
                  : isMobile
                    ? "w-20 h-10"
                    : "w-24 h-12"
                  } border-2 rounded-lg border-[#CFBC40] p-1 bg-[#A8CAAB]`}
              >
                <div className="border border-black w-full h-full rounded-sm bg-gradient-to-b from-[#F8E4E9] to-[#E1A9A5] flex items-center justify-center">
                  {/* Dice for Green player */}
                  {currentPlayer === 3 && (
                    <motion.div
                      className={`${isMobile && isPortrait
                        ? "w-12 h-12"
                        : isMobile
                          ? "w-5 h-5"
                          : "w-6 h-6"
                        } bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative`}
                      onClick={rollDice}
                      animate={isRolling ? { rotate: 360 } : {}}
                      transition={{
                        duration: 0.5,
                        repeat: isRolling ? Infinity : 0,
                        ease: "linear",
                      }}
                    >
                      {/* Dice dots */}
                      {diceValue > 0 &&
                        renderDiceDots(diceValue, isMobile && isPortrait)}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div
                  className={`${isMobile && isPortrait
                    ? "w-12 h-12"
                    : isMobile
                      ? "w-10 h-8"
                      : "w-10 h-10"
                    } border-t-2 border-r-2 border-b-2 border-[#CFBC40] flex items-center justify-center p-1 bg-gradient-to-r from-[#0150BD] to-[#9EC7C8]`}
                >
                  <img
                    src="/ludo/greengotti.png"
                    alt="centered"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Ludo board */}
          <motion.div
            className={`${isMobile && isPortrait
              ? "w-[95vw] h-[95vw]"
              : isMobile
                ? "w-[90vw] h-[90vw]"
                : "w-[550px] h-[550px]"
              }  bg-white/10 backdrop-blur-md overflow-visible relative shadow-[0_25px_50px_rgba(0,0,0,0.5)] transform-style-preserve-3d`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {renderBoardTokens()}

            {/* Top row with yellow (bot) and green homes */}
            <div className="flex h-[40%]">
              {/* Yellow (bot) home - now in red's old position */}
              <motion.div
                className={`w-[40%] h-full ${isMobile && isPortrait
                  ? "border-[22px]"
                  : isMobile
                    ? "border-[6px]"
                    : "border-[35px]"
                  } border-[#FFDE16] bg-white ${isMobile && isPortrait ? "p-0.5" : isMobile ? "p-1" : "p-4"
                  } relative`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  className={`grid grid-cols-2 place-items-center justify-items-center ${isMobile && isPortrait
                    ? "gap-0.5"
                    : isMobile
                      ? "gap-1"
                      : "gap-4"
                    } h-full items-center`}
                >
                  {[0, 1, 2, 3].map((i) => renderToken(1, i))}
                </div>
              </motion.div>

              {/* Vertical path (top) */}
              <div className="w-[20%] h-full">
                <div className="grid grid-cols-3 grid-rows-6 h-full">
                  {Array(18)
                    .fill()
                    .map((_, i) => {
                      let color = null;
                      let hasStar = false;
                      let hasGreenImage = false;
                      let hasRedImage = false;
                      let hasBlueImage = false;
                      let hasYellowImage = false;

                      // Green path (top vertical)
                      if (i === 1) {
                        color = "white";
                        hasStar = false;
                        hasGreenImage = true; // Add this to show the image
                      }
                      if (i === 4) color = "green";
                      if (i === 5) {
                        color = "green";
                        hasStar = false;
                      }
                      if (i === 6) {
                        color = "white";
                        hasStar = true;
                      }
                      if (i === 7) color = "green";
                      if (i === 10) color = "green";
                      if (i === 13) color = "green";
                      if (i === 16) color = "green";

                      return renderCell(
                        color,
                        hasStar,
                        hasGreenImage,
                        hasRedImage,
                        hasBlueImage,
                        hasYellowImage,
                        i
                      );
                    })}
                </div>
              </div>

              {/* Green home (bot) */}
              <motion.div
                className={`w-[40%] h-full ${isMobile && isPortrait
                  ? "border-[22px]"
                  : isMobile
                    ? "border-[6px]"
                    : "border-[35px]"
                  } border-green-600 bg-green-100 ${isMobile && isPortrait ? "p-0.5" : isMobile ? "p-1" : "p-4"
                  } relative`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className={`grid grid-cols-2 place-items-center justify-items-center ${isMobile && isPortrait
                    ? "gap-0.5"
                    : isMobile
                      ? "gap-1"
                      : "gap-4"
                    } h-full items-center`}
                >
                  {[0, 1, 2, 3].map((i) => renderToken(3, i))}
                </div>
              </motion.div>
            </div>

            {/* Middle row */}
            <div className="flex h-[20%]">
              {/* Horizontal path (left) */}
              <div className="w-[40%] h-full">
                <div className="grid grid-cols-6 grid-rows-3 h-full">
                  {Array(18)
                    .fill()
                    .map((_, i) => {
                      let color = null;
                      let hasStar = false;
                      let hasGreenImage = false;
                      let hasRedImage = false;
                      let hasBlueImage = false;
                      let hasYellowImage = false;

                      // Yellow path (left horizontal) - now bot's path
                      if (i === 1) {
                        color = "yellow";
                        hasStar = false;
                      }
                      if (i === 7) color = "yellow";
                      if (i === 8) color = "yellow";
                      if (i === 9) color = "yellow";
                      if (i === 10) color = "yellow";
                      if (i === 11) color = "yellow";
                      if (i === 6) {
                        color = "white";
                        hasYellowImage = true;
                      }
                      if (i === 14) {
                        color = "white";
                        hasStar = true;
                      }

                      return renderCell(
                        color,
                        hasStar,
                        hasGreenImage,
                        hasRedImage,
                        hasBlueImage,
                        hasYellowImage,
                        i + 18
                      );
                    })}
                </div>
              </div>

              {/* Center home */}
              <motion.div
                className="w-[20%] h-full "
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              // transition={{ delay: 0.5 }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                // animate={{ rotate: 360 }}
                // transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="flex items-center justify-center md:border-1 md:border-black border-1 border-gray-400 z-999">
                    <div
                      className={`w-0 h-0  ${isMobile && isPortrait
                        ? "border-t-[38px] border-r-[38px] border-b-[38px] border-l-[38px]"
                        : isMobile
                          ? "border-t-[40px] border-r-[40px] border-b-[36px] border-l-[36px]"
                          : "border-t-[54px] border-r-[54px] border-b-[54px] border-l-[54px]" // smaller desktop
                        } border-t-[#019F4A] border-r-[#CF1D1B] border-b-[#28AEFF] border-l-[#FFDE16]`}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Horizontal path (right) */}
              <div className="w-[40%] h-full">
                <div className="grid grid-cols-6 grid-rows-3 h-full">
                  {Array(18)
                    .fill()
                    .map((_, i) => {
                      let color = null;
                      let hasStar = false;
                      let hasGreenImage = false;
                      let hasRedImage = false;
                      let hasBlueImage = false;
                      let hasYellowImage = false;

                      // Red path (right horizontal) - now user's path
                      if (i === 3) {
                        color = "white";
                        hasStar = true;
                      }
                      if (i === 6) color = "red";
                      if (i === 7) color = "red";
                      if (i === 8) color = "red";
                      if (i === 9) color = "red";
                      if (i === 10) color = "red";
                      if (i === 11) {
                        color = "white";
                        hasRedImage = true;
                      }
                      if (i === 16) {
                        color = "red";
                        hasStar = false;
                      }

                      return renderCell(
                        color,
                        hasStar,
                        hasGreenImage,
                        hasRedImage,
                        hasBlueImage,
                        hasYellowImage,
                        i + 36
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Bottom row with blue and yellow homes */}
            <div className="flex h-[40%]">
              {/* Blue home (bot) */}
              <motion.div
                className={`w-[40%] h-full ${isMobile && isPortrait
                  ? "border-[20px]"
                  : isMobile
                    ? "border-[6px]"
                    : "border-[35px]"
                  } border-[#28AFFF] bg-white ${isMobile && isPortrait ? "p-0.5" : isMobile ? "p-1" : "p-4"
                  } relative`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div
                  className={`grid grid-cols-2 place-items-center justify-items-center ${isMobile && isPortrait
                    ? "gap-0.5"
                    : isMobile
                      ? "gap-1"
                      : "gap-4"
                    } h-full items-center`}
                >
                  {[0, 1, 2, 3].map((i) => renderToken(2, i))}
                </div>
              </motion.div>

              {/* Vertical path (bottom) */}
              <div className="w-[20%] h-full">
                <div className="grid grid-cols-3 grid-rows-6 h-full">
                  {Array(18)
                    .fill()
                    .map((_, i) => {
                      let color = null;
                      let hasStar = false;
                      let hasGreenImage = false;
                      let hasRedImage = false;
                      let hasBlueImage = false;
                      let hasYellowImage = false;

                      // Blue path (bottom vertical)
                      if (i === 1) color = "blue";
                      if (i === 4) color = "blue";
                      if (i === 7) color = "blue";
                      if (i === 10) color = "blue";
                      if (i === 16) {
                        color = "white";
                        hasBlueImage = true;
                      }
                      if (i === 11) {
                        color = "white";
                        hasStar = true;
                      }
                      if (i === 12) {
                        color = "blue";
                        hasStar = false;
                      }
                      if (i === 13) color = "blue";
                      return renderCell(
                        color,
                        hasStar,
                        hasGreenImage,
                        hasRedImage,
                        hasBlueImage,
                        hasYellowImage,
                        i + 54
                      );
                    })}
                </div>
              </div>

              {/* Red (user) home - now in yellow's old position */}
              <motion.div
                className={`w-[40%] h-full ${isMobile && isPortrait
                  ? "border-[22px]"
                  : isMobile
                    ? "border-[6px]"
                    : "border-[35px]"
                  } border-red-600 bg-white ${isMobile && isPortrait ? "p-0.5" : isMobile ? "p-1" : "p-4"
                  } relative`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className={`grid grid-cols-2 place-items-center justify-items-center ${isMobile && isPortrait
                    ? "gap-0.5"
                    : isMobile
                      ? "gap-1"
                      : "gap-4"
                    } h-full items-center`}
                >
                  {[0, 1, 2, 3].map((i) => renderToken(0, i))}
                </div>
              </motion.div>
            </div>
          </motion.div>
          {/* Player Info Boxes - Bottom Row */}
          <div className="flex flex-row gap-2 md:gap-4 lg:gap-6 w-full">
            <div className="flex flex-row w-full">
              <div className="flex items-center justify-center">
                <div
                  className={`${isMobile && isPortrait
                    ? "w-12 h-12"
                    : isMobile
                      ? "w-10 h-8"
                      : "w-12 h-10"
                    } border-t-2 border-l-2 border-b-2 border-[#CFBC40] flex items-center justify-center p-1 bg-gradient-to-r from-[#0150BD] to-[#9EC7C8]`}
                >
                  <img
                    src="/ludo/bluegotti.png"
                    alt="centered"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              <div
                className={`${isMobile && isPortrait
                  ? "w-20 h-20"
                  : isMobile
                    ? "w-20 h-10"
                    : "w-24 h-12"
                  } border-2 rounded-lg border-[#CFBC40] p-1 bg-[#A8CAAB]`}
              >
                <div className="border border-black w-full h-full rounded-sm bg-gradient-to-b from-[#F8E4E9] to-[#E1A9A5] flex items-center justify-center">
                  {/* Dice for Blue player */}
                  {currentPlayer === 2 && (
                    <motion.div
                      className={`${isMobile && isPortrait
                        ? "w-12 h-12"
                        : isMobile
                          ? "w-5 h-5"
                          : "w-6 h-6"
                        } bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative`}
                      onClick={rollDice}
                      animate={isRolling ? { rotate: 360 } : {}}
                      transition={{
                        duration: 0.5,
                        repeat: isRolling ? Infinity : 0,
                        ease: "linear",
                      }}
                    >
                      {/* Dice dots */}
                      {diceValue > 0 &&
                        renderDiceDots(diceValue, isMobile && isPortrait)}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-row">
              <div
                className={`${isMobile && isPortrait
                  ? "w-20 h-20"
                  : isMobile
                    ? "w-20 h-10"
                    : "w-24 h-12"
                  } border-2 rounded-lg border-[#CFBC40] p-1 bg-[#A8CAAB]`}
              >
                <div className="border border-black w-full h-full rounded-sm bg-gradient-to-b from-[#F8E4E9] to-[#E1A9A5] flex items-center justify-center">
                  {/* Dice for Red (user) player */}
                  {currentPlayer === 0 && (
                    <motion.div
                      className={`${isMobile && isPortrait
                        ? "w-12 h-12"
                        : isMobile
                          ? "w-5 h-5"
                          : "w-6 h-6"
                        } bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative`}
                      onClick={rollDice}
                      animate={isRolling ? { rotate: 360 } : {}}
                      transition={{
                        duration: 0.5,
                        repeat: isRolling ? Infinity : 0,
                        ease: "linear",
                      }}
                    >
                      {/* Dice dots */}
                      {diceValue > 0 &&
                        renderDiceDots(diceValue, isMobile && isPortrait)}
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div
                  className={`${isMobile && isPortrait
                    ? "w-12 h-12"
                    : isMobile
                      ? "w-10 h-8"
                      : "w-12 h-10"
                    } border-t-2 border-r-2 border-b-2 border-[#CFBC40] flex items-center justify-center relative
                 ${timerActive
                      ? "bg-black"
                      : " p-1 bg-gradient-to-r from-[#0150BD] to-[#9EC7C8]"
                    }`}
                >
                  {timerActive && currentPlayer === 0 ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <div className="bg-black text-white text-xs font-bold ">
                        {timeLeft}s
                      </div>
                    </div>
                  ) : (
                    <img
                      src="/ludo/redgotti.png"
                      alt="centered"
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-2 md:gap-4 lg:gap-6 w-full ">
            <div className="flex w-full">
              <div className="flex w-full p-2">
                {/* 3 Points around the circle - Yellow (bot) */}
                <div className="flex flex-row gap-1 justify-center items-center p-2 border-2 border-black rounded-full bg-gray-300">
                  <div className="w-3 h-3 border-[1.5px] border-black bg-[radial-gradient(circle,theme(colors.green.400),black)] rounded-full"></div>
                  <div className="w-3 h-3 border-[1.5px] border-black bg-[radial-gradient(circle,theme(colors.green.400),black)] rounded-full"></div>
                  <div className="w-3 h-3 border-[1.5px] border-black bg-[radial-gradient(circle,theme(colors.green.400),black)] rounded-full"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex w-full  p-2">
                {/* 3 Points around the circle - Red (user) */}
                <div
                  className={`flex flex-row gap-1 justify-center items-center p-2 border-2 border-black rounded-full ${timerActive && currentPlayer === 0
                    ? "bg-yellow-300 border-yellow-500"
                    : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`w-3 h-3 border-[1.5px] border-black rounded-full ${redDots[0] >= 1
                      ? "bg-[radial-gradient(circle,theme(colors.red.400),black)]"
                      : "bg-[radial-gradient(circle,theme(colors.green.400),black)]"
                      }`}
                  ></div>
                  <div
                    className={`w-3 h-3 border-[1.5px] border-black rounded-full ${redDots[0] >= 2
                      ? "bg-[radial-gradient(circle,theme(colors.red.400),black)]"
                      : "bg-[radial-gradient(circle,theme(colors.green.400),black)]"
                      }`}
                  ></div>
                  <div
                    className={`w-3 h-3 border-[1.5px] border-black rounded-full ${redDots[0] >= 3
                      ? "bg-[radial-gradient(circle,theme(colors.red.400),black)]"
                      : "bg-[radial-gradient(circle,theme(colors.green.400),black)]"
                      }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Game controls */}
          {/* <div className="flex flex-col md:w-[20vw] w-[90vw]"> */}
          {/* <motion.div
          className={`${
            isMobile && isPortrait ? "mt-4" : isMobile ? "mt-2" : "mt-6"
          } flex flex-col items-center justify-center gap-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4">
            {!isMobile && (
              <div className="flex flex-col gap-1">
                <span className="text-white text-sm font-medium">
                  Roll the dice from player boxes
                </span>
                <span className="text-white/70 text-xs">Click dice in player boxes above</span>
              </div>
            )}
          </div>
        </motion.div> */}

          {/* Timer Display Only - Fixed Height */}
          {/* <motion.div
            className="text-center h-12 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {timerActive ? (
              <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30 inline-block">
                <p className={`text-white font-bold text-lg ${timeLeft <= 5 ? 'text-red-400' : 'text-yellow-300'}`}>
                  ⏰ {timeLeft}s
                </p>
              </div>
            ) : (
              <div className="h-8 w-20"></div> // Invisible placeholder to maintain height
            )}
          </motion.div> */}

          {/* Game Status */}
          {/* <motion.div
          className={`${
            isMobile && isPortrait ? "mt-3" : isMobile ? "mt-2" : "mt-3"
          } flex justify-center gap-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex gap-4">
            <div
              className={`text-center ${
                currentPlayer === 0 ? "opacity-100" : "opacity-60"
              }`}
            >
              <div className="w-3 h-3 bg-red-600 rounded-full mx-auto mb-1"></div>
              <p
                className={`text-white font-medium ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                You
              </p>
            </div>
            <div
              className={`text-center ${
                currentPlayer === 1 ? "opacity-100" : "opacity-60"
              }`}
            >
              <div className="w-3 h-3 bg-green-600 rounded-full mx-auto mb-1"></div>
              <p
                className={`text-white font-medium ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                Player
              </p>
            </div>
          </div>
        </motion.div> */}

          {/* Wallet Display */}
          {/* <motion.div
          className={`${
            isMobile && isPortrait ? "mt-3" : isMobile ? "mt-2" : "mt-3"
          } text-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
            <p
              className={`text-white/80 font-medium ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              💰 Wallet: {userWallet}
            </p>
          </div>
        </motion.div> */}
          {/* </div> */}
        </div>
      )}

      {/* Background Music Audio */}
      {/* <audio
        ref={audioRef}
        loop
        preload="auto"
        style={{ display: "none" }}
      >
        <source src="/Gameaudio/NewBgAudio/feel-vibes-rampb-and-soul-music-227492.mp3" type="audio/mpeg" />
      </audio> */}

      {/* Token Click Sound */}

      {/* Dice Sound */}
      <audio ref={diceAudioRef} preload="auto" style={{ display: "none" }}>
        <source src="/Gameaudio/dicesound.mpeg" />
      </audio>

      {/* Timer Sound */}
      <audio ref={timerAudioRef} preload="auto" style={{ display: "none" }}>
        <source src="/Gameaudio/tick.mp3" />
      </audio>

      {/* Token Hop Sound */}
      <audio ref={tokenHopAudioRef} preload="auto" style={{ display: "none" }}>
        <source src="/Gameaudio/tokenMove.mp3" type="audio/mpeg" />
        {/* <source src="/Gameaudio/click.mp3" type="audio/mpeg" /> */}
      </audio>

      {/* Game Won Sound */}
      <audio ref={gameWonAudioRef} preload="auto" style={{ display: "none" }}>
        <source src="/Gameaudio/GameWon.mp3" type="audio/mpeg" />
      </audio>

      {/* Token Winning Sound - Plays when an individual token reaches finish line */}
      <audio
        ref={tokenCaptureAudioRef}
        preload="auto"
        style={{ display: "none" }}
      >
        <source src="/Gameaudio/tokenIN.mp3" type="audio/mpeg" />
      </audio>

      {/* Token Capture Sound - Plays when a token is captured */}
      <audio
        ref={tokenCaptureSoundRef}
        preload="auto"
        style={{ display: "none" }}
      >
        <source src="/Gameaudio/TokenCapture.mp3" type="audio/mpeg" />
      </audio>

      {/* Star Sound - Plays when a token lands on a star */}
      {/* <audio ref={starSoundRef} preload="auto" style={{ display: "none" }}>
        <source src="/Gameaudio/Tokenstar.mp3" type="audio/mpeg" />
      </audio> */}
    </div>
  );
};

export default LudoBoard;
