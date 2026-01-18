"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaStar, FaPaperPlane, FaCheckCircle } from "react-icons/fa";

const FeedbackPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Feedback",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const subjects = [
        "General Feedback",
        "Bug Report",
        "Feature Request",
        "Game Experience",
        "Other",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setFormData({ name: "", email: "", subject: "General Feedback", message: "" });
            } else {
                setError(data.message || "Failed to submit feedback");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-hero-gradient font-premium overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                            <FaArrowLeft />
                            <span className="hidden sm:inline">Back to Home</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black italic tracking-tighter text-white">
                                LUDO<span className="text-[var(--ludo-neon-green)]">MASTER</span>
                            </span>
                        </div>
                        <div className="w-20"></div>
                    </div>
                </div>
            </nav>

            {/* Glowing Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--ludo-neon-green)] rounded-full filter blur-[150px] opacity-10"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--ludo-electric-blue)] rounded-full filter blur-[150px] opacity-10"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12">
                {submitted ? (
                    /* Success State */
                    <div className="text-center animate-slide-up">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center glow-green">
                            <FaCheckCircle className="text-5xl text-[var(--ludo-neon-green)]" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                            Thank You!
                        </h1>
                        <p className="text-lg text-[var(--ludo-text-secondary)] mb-8 max-w-md mx-auto">
                            Your feedback has been submitted successfully. We appreciate you taking the time to help us improve!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="btn-primary-glow px-8 py-4 text-lg font-bold flex items-center justify-center gap-2"
                            >
                                Back to Home
                            </Link>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="btn-secondary-glow px-8 py-4 text-lg flex items-center justify-center gap-2"
                            >
                                Submit Another
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Form State */
                    <>
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-[var(--ludo-soft-gold)] text-sm font-medium mb-6 animate-pulse-glow">
                                <FaStar />
                                <span>We Value Your Opinion</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
                                Share Your <span className="text-gradient">Feedback</span>
                            </h1>
                            <p className="text-lg text-[var(--ludo-text-secondary)] max-w-md mx-auto">
                                Help us make LudoMaster even better! Your feedback matters.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="w-full max-w-lg">
                            <div className="glass-card-strong p-8 rounded-3xl space-y-6">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[var(--ludo-neon-green)] focus:ring-1 focus:ring-[var(--ludo-neon-green)] transition-all"
                                    />
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[var(--ludo-neon-green)] focus:ring-1 focus:ring-[var(--ludo-neon-green)] transition-all"
                                    />
                                </div>

                                {/* Subject Dropdown */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Subject
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--ludo-neon-green)] focus:ring-1 focus:ring-[var(--ludo-neon-green)] transition-all appearance-none cursor-pointer"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
                                    >
                                        {subjects.map((subject) => (
                                            <option key={subject} value={subject} className="bg-gray-900 text-white">
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message Textarea */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Your Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tell us what you think..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[var(--ludo-neon-green)] focus:ring-1 focus:ring-[var(--ludo-neon-green)] transition-all resize-none"
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary-glow px-8 py-4 text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane />
                                            Submit Feedback
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default FeedbackPage;
