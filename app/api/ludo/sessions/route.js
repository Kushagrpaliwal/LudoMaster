import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import LudoSession from "@/app/models/LudoSession";

// GET - Get all sessions for a player
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const sessions = await LudoSession.find({ 
      playerPhone: phone,
      isCompleted: true 
    })
    .sort({ createdAt: -1 })
    .limit(50);

    return NextResponse.json({
      success: true,
      sessions: sessions,
    });

  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new session
export async function POST(request) {
  try {
    await dbConnect();

    const { 
      roomId, 
      roomName, 
      playerPhone, 
      betAmount, 
      prizePool 
    } = await request.json();

    if (!roomId || !roomName || !playerPhone || !betAmount || !prizePool) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique session ID with better uniqueness
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const sessionId = `ludo_${timestamp}_${randomPart}`;

    // Create initial game state
    const initialGameState = {
      players: {
        0: {
          color: "red",
          tokens: [
            { id: 0, position: -1, isHome: true, isFinished: false, isInHomeStretch: false },
            { id: 1, position: -1, isHome: true, isFinished: false, isInHomeStretch: false },
            { id: 2, position: -1, isHome: true, isFinished: false, isInHomeStretch: false },
            { id: 3, position: -1, isHome: true, isFinished: false, isInHomeStretch: false },
          ],
        },
        1: {
          color: "green",
          tokens: [
            { id: 0, position: -1, isHome: true, isFinished: false, isInHomeStretch: false },
            { id: 1, position: -1, isHome: true, isFinished: false, isInHomeStretch: false },
            { id: 2, position: -1, isHome: true, isFinished: false, isInHomeStretch: false },
            { id: 3, position: -1, isHome: true, isFinished: false, isInHomeStretch: false },
          ],
        },
      },
      winner: null,
      gameStarted: false,
      gamePaid: true,
    };

    console.log("Creating session with data:", {
      sessionId,
      roomId,
      roomName,
      playerPhone,
      betAmount,
      prizePool
    });

    const session = new LudoSession({
      sessionId,
      roomId,
      roomName,
      playerPhone,
      betAmount,
      prizePool,
      gameState: initialGameState,
      startTime: new Date(),
    });

    console.log("Session object created, saving...");
    await session.save();
    console.log("Session saved successfully");

    return NextResponse.json({
      success: true,
      message: "Session created successfully",
      sessionId: sessionId,
      session: session,
    });

  } catch (error) {
    console.error("Error creating session:", error);
    
    // Check for specific error types
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: "Validation error: " + error.message },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Session already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
} 