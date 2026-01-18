import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";

export async function POST(request) {
  try {
    await dbConnect();

    const { phone, betAmount, roomId, roomName } = await request.json();

    if (!phone || !betAmount || !roomId || !roomName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has sufficient balance
    if (user.wallet < betAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Deduct bet amount from wallet
    user.wallet -= betAmount;

    // Add bet history record
    const betRecord = {
      sessionId: Date.now(),
      game: "Ludo",
      betOn: "Ludo Entry",
      amount: betAmount,
      payout: 0,
      winLossAmount: -betAmount,
      timePlaced: new Date(),
    };
    
    console.log("Adding bet record:", betRecord);

    // Initialize betHistory array if it doesn't exist
    if (!user.betHistory) {
      user.betHistory = [];
    }

    user.betHistory.push(betRecord);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Bet placed successfully",
      newBalance: user.wallet,
      betAmount: betAmount,
      sessionId: betRecord.sessionId,
    });

  } catch (error) {
    console.error("Error placing bet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 