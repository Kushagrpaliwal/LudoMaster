"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaHeadset, FaEnvelope, FaQuestionCircle, FaBug, FaLightbulb, FaPaperPlane } from "react-icons/fa";

const SupportPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        category: "General",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const categories = [
        { icon: FaQuestionCircle, name: "General", desc: "General questions" },
        { icon: FaBug, name: "Bug Report", desc: "Report an issue" },
        { icon: FaLightbulb, name: "Feature Request", desc: "Suggest improvements" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitted(true);
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-hero-gradient font-premium">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                            <FaArrowLeft />
                            <span className="hidden sm:inline">Back to Home</span>
                        </Link>
                        <span className="text-2xl font-black italic tracking-tighter text-white">
                            LUDO<span className="text-[var(--ludo-neon-green)]">MASTER</span>
                        </span>
                        <div className="w-20"></div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--ludo-soft-gold)]/20 to-[var(--ludo-neon-green)]/20 flex items-center justify-center">
                            <FaHeadset className="text-4xl text-[var(--ludo-soft-gold)]" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                            How Can We <span className="text-gradient">Help?</span>
                        </h1>
                        <p className="text-[var(--ludo-text-secondary)]">We're here to assist you with any questions or issues</p>
                    </div>

                    {submitted ? (
                        <div className="glass-card-strong rounded-3xl p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                                <FaEnvelope className="text-4xl text-[var(--ludo-neon-green)]" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
                            <p className="text-[var(--ludo-text-secondary)] mb-8">We'll get back to you as soon as possible.</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="btn-primary-glow px-8 py-4"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setFormData(prev => ({ ...prev, category: cat.name }))}
                                    className={`glass-card p-6 text-center transition-all duration-300 hover:scale-105 ${formData.category === cat.name
                                            ? 'border-[var(--ludo-neon-green)] shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                                            : 'border-white/10'
                                        }`}
                                >
                                    <cat.icon className={`text-3xl mx-auto mb-3 ${formData.category === cat.name
                                            ? 'text-[var(--ludo-neon-green)]'
                                            : 'text-white/60'
                                        }`} />
                                    <h3 className="text-white font-semibold">{cat.name}</h3>
                                    <p className="text-[var(--ludo-text-muted)] text-sm">{cat.desc}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {!submitted && (
                        <form onSubmit={handleSubmit} className="glass-card-strong rounded-3xl p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white font-semibold mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[var(--ludo-neon-green)]"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white font-semibold mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[var(--ludo-neon-green)]"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white font-semibold mb-2">Your Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[var(--ludo-neon-green)] resize-none"
                                    placeholder="Describe your issue or question..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary-glow px-8 py-4 text-lg font-bold flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
