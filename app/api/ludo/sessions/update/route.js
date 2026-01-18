import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import LudoSession from "@/app/models/LudoSession";

export async function POST(request) {
  try {
    await dbConnect();

    const { 
      sessionId, 
      gameState, 
      currentPlayer, 
      diceValue, 
      consecutiveSixes, 
      gameMessage,
      isCompleted,
      result 
    } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const session = await LudoSession.findOne({ sessionId });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Update session fields
    if (gameState) session.gameState = gameState;
    if (currentPlayer !== undefined) session.currentPlayer = currentPlayer;
    if (diceValue !== undefined) session.diceValue = diceValue;
    if (consecutiveSixes) session.consecutiveSixes = consecutiveSixes;
    if (gameMessage) session.gameMessage = gameMessage;
    
    if (isCompleted) {
      session.isCompleted = true;
      session.endTime = new Date();
      session.duration = Math.floor((session.endTime - session.startTime) / 1000);
    }
    
    if (result) {
      session.result = result;
    }

    await session.save();

    return NextResponse.json({
      success: true,
      message: "Session updated successfully",
      session: session,
    });

  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 