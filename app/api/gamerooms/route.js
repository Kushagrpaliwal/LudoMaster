import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import GameRoom from "@/app/models/GameRoom";

// GET - Fetch game rooms
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const playerCount = searchParams.get("playerCount");

    let query = { status: "active" };
    if (playerCount) {
      query.playerCount = parseInt(playerCount);
    }

    const rooms = await GameRoom.find(query).sort({ entryFee: 1 });

    return NextResponse.json({ success: true, rooms }, { status: 200 });
  } catch (error) {
    console.error("Error fetching game rooms:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch game rooms" },
      { status: 500 }
    );
  }
}

// POST - Create a new game room
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, entryFee, playerCount, prizePool } = body;

    // Validate required fields
    if (!name || !entryFee || !playerCount || prizePool === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate player count
    if (![2, 4].includes(playerCount)) {
      return NextResponse.json(
        { success: false, error: "Player count must be 2 or 4" },
        { status: 400 }
      );
    }

    // Validate prize pool is not negative
    if (prizePool < 0) {
      return NextResponse.json(
        { success: false, error: "Prize pool cannot be negative" },
        { status: 400 }
      );
    }

    const newRoom = await GameRoom.create({
      name,
      entryFee,
      playerCount,
      prizePool,
      status: "active",
    });

    return NextResponse.json({ success: true, room: newRoom }, { status: 201 });
  } catch (error) {
    console.error("Error creating game room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create game room" },
      { status: 500 }
    );
  }
}

// PUT - Update a game room
export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, name, entryFee, playerCount, status, prizePool } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Room ID is required" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (entryFee !== undefined) updateData.entryFee = entryFee;
    if (playerCount) updateData.playerCount = playerCount;
    if (prizePool !== undefined) {
      if (prizePool < 0) {
        return NextResponse.json(
          { success: false, error: "Prize pool cannot be negative" },
          { status: 400 }
        );
      }
      updateData.prizePool = prizePool;
    }
    if (status) updateData.status = status;

    const updatedRoom = await GameRoom.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedRoom) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, room: updatedRoom },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating game room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update game room" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a game room
export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Room ID is required" },
        { status: 400 }
      );
    }

    const deletedRoom = await GameRoom.findByIdAndDelete(id);

    if (!deletedRoom) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Room deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting game room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete game room" },
      { status: 500 }
    );
  }
}
