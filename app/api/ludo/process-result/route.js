import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";

export async function POST(request) {
  try {
    await dbConnect();

    const { phone, isWinner, prizeAmount, roomId, roomName } = await request.json();

    if (!phone || prizeAmount === undefined || !roomId || !roomName) {
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

    // Initialize betHistory array if it doesn't exist
    if (!user.betHistory) {
      user.betHistory = [];
    }

    // Find the most recent Ludo bet and update it
    const recentLudoBet = user.betHistory
      .filter(bet => bet.game === "Ludo" && (!bet.result || bet.result === "pending"))
      .sort((a, b) => new Date(b.timePlaced) - new Date(a.timePlaced))[0];

    console.log("Found recent Ludo bet:", recentLudoBet);
    console.log("All Ludo bets:", user.betHistory.filter(bet => bet.game === "Ludo"));

    if (recentLudoBet) {
      if (isWinner) {
        // Credit prize amount to wallet
        console.log("Before wallet update - Balance:", user.wallet, "Prize:", prizeAmount);
        user.wallet += prizeAmount;
        console.log("After wallet update - New Balance:", user.wallet);
        
        // Update bet record
        recentLudoBet.result = "win";
        recentLudoBet.payout = prizeAmount;
        recentLudoBet.winLossAmount = prizeAmount;
        recentLudoBet.betOn = "Ludo Won";
        console.log("Updated bet record:", recentLudoBet);
      } else {
        // Update bet record for loss
        recentLudoBet.result = "lose";
        recentLudoBet.payout = 0;
        // Don't change winLossAmount - it's already set to -amount when bet was placed
        recentLudoBet.betOn = "Ludo Lost";
        console.log("Updated bet record for loss:", recentLudoBet);
      }
    } else {
      console.warn("No recent Ludo bet found to update");
      // Return a more specific error message
      return NextResponse.json(
        { error: "No pending Ludo bet found to process. Please place a bet first." },
        { status: 400 }
      );
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: isWinner ? "Prize credited successfully" : "Game result processed",
      newBalance: user.wallet,
      prizeAmount: isWinner ? prizeAmount : 0,
      isWinner: isWinner,
    });

  } catch (error) {
    console.error("Error processing result:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
} 