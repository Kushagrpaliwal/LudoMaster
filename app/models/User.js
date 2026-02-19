import mongoose from "mongoose";

const betHistorySchema = new mongoose.Schema({
    sessionId: {
        type: Number,
    },
    game: {
        type: String,
    },
    betOn: {
        type: String,
    },
    amount: {
        type: Number,
    },
    payout: {
        type: Number,
        default: 0,
    },
    winLossAmount: {
        type: Number,
        default: 0,
    },
    result: {
        type: String,
        enum: ["pending", "win", "lose"],
        default: "pending",
    },
    timePlaced: {
        type: Date,
        default: Date.now,
    },
});

const UserSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "",
        },
        wallet: {
            type: Number,
            default: 0,
        },
        betHistory: [betHistorySchema],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
