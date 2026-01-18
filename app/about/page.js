"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaGamepad, FaHeart, FaUsers, FaDice, FaPlay } from "react-icons/fa";

const AboutPage = () => {
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

            {/* Hero Section */}
            <div className="pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--ludo-neon-green)]/20 to-[var(--ludo-electric-blue)]/20 flex items-center justify-center animate-pulse-glow">
                            <FaDice className="text-5xl text-[var(--ludo-neon-green)]" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
                            About <span className="text-gradient">LudoMaster</span>
                        </h1>
                        <p className="text-xl text-[var(--ludo-text-secondary)] max-w-2xl mx-auto">
                            Bringing the classic board game experience to the digital world with modern design and smart AI.
                        </p>
                    </div>

                    {/* Story Section */}
                    <div className="glass-card-strong rounded-3xl p-8 md:p-12 mb-10">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Story</h2>
                        <p className="text-[var(--ludo-text-secondary)] leading-relaxed text-lg mb-6">
                            LudoMaster was born from a simple idea: to recreate the joy of playing Ludo with family and friends in a beautiful, modern digital experience. We remember the countless hours spent around the board, the excitement of rolling sixes, and the friendly rivalries that made every game memorable.
                        </p>
                        <p className="text-[var(--ludo-text-secondary)] leading-relaxed text-lg">
                            Today, LudoMaster brings that same excitement to your fingertips – completely free, with smart AI opponents that challenge your strategy and provide endless entertainment.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        <div className="glass-card p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[var(--ludo-neon-green)]/20 to-transparent flex items-center justify-center">
                                <FaGamepad className="text-3xl text-[var(--ludo-neon-green)]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Classic Gameplay</h3>
                            <p className="text-[var(--ludo-text-muted)]">Traditional Ludo rules with modern enhancements</p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[var(--ludo-electric-blue)]/20 to-transparent flex items-center justify-center">
                                <FaUsers className="text-3xl text-[var(--ludo-electric-blue)]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Smart AI</h3>
                            <p className="text-[var(--ludo-text-muted)]">Challenge intelligent opponents anytime</p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[var(--ludo-soft-gold)]/20 to-transparent flex items-center justify-center">
                                <FaHeart className="text-3xl text-[var(--ludo-soft-gold)]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">100% Free</h3>
                            <p className="text-[var(--ludo-text-muted)]">No hidden costs, no pay-to-win</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <Link
                            href="/games/ludo"
                            className="inline-flex items-center gap-3 btn-primary-glow px-10 py-5 text-xl font-bold"
                        >
                            <FaPlay />
                            Start Playing Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
