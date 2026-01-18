import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model exists before compiling it
let Feedback;

try {
  // Try to get the existing model
  Feedback = mongoose.model('Feedback');
} catch (e) {
  // If the model doesn't exist, create it
  Feedback = mongoose.model('Feedback', feedbackSchema);
}

export default Feedback;