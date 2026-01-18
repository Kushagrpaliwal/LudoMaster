import dbConnect from "@/lib/dbConnect";
import Feedback from "@/app/models/Feedback";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the request body
        const { name, email, subject, message } = await req.json();

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Check for duplicate feedback (optional)
        const existingFeedback = await Feedback.findOne({
            name,
            email,
            subject,
            message
        });

        if (existingFeedback) {
            return NextResponse.json(
                { message: "Similar feedback already exists" },
                { status: 409 }
            );
        }

        // Create and save new feedback
        const newFeedback = new Feedback({
            name: name,
            email: email,
            subject: subject,
            message: message,
            updatedAt: new Date()
        });

        // Save the feedback to the database
        const savedFeedback = await newFeedback.save();
        console.log('Feedback saved successfully:', savedFeedback);

        return NextResponse.json(
            {
                message: "Feedback submitted successfully",
                data: savedFeedback
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error submitting feedback:", error);
        return NextResponse.json(
            { message: "Failed to submit feedback" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {

        const feedbackfetch = await Feedback.find({})

        if (feedbackfetch) {
            return NextResponse.json({
                feedbackfetch,
                status: 200
            })
        }

    } catch (error) {
        return NextResponse.json({
            message: "unable to fetch the feedbacks",
            status: 500,
        })
    }
}