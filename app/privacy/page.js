"use client";
import React from "react";
import Link from "next/link";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";

const PrivacyPage = () => {
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
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--ludo-electric-blue)]/20 to-[var(--ludo-neon-purple)]/20 flex items-center justify-center">
                            <FaShieldAlt className="text-4xl text-[var(--ludo-electric-blue)]" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                            Privacy <span className="text-gradient">Policy</span>
                        </h1>
                        <p className="text-[var(--ludo-text-secondary)]">Last updated: January 2026</p>
                    </div>

                    <div className="glass-card-strong rounded-3xl p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                We collect minimal information to provide you with the best gaming experience. This may include device information, gameplay statistics, and any feedback you voluntarily provide.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                We use the information we collect to improve our game, provide customer support, and enhance your gaming experience. We do not sell your personal information to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                We use cookies and similar technologies to enhance your experience, save your preferences, and analyze how our service is used.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Children's Privacy</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                LudoMaster is intended for users of all ages. We do not knowingly collect personal information from children under 13 without parental consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                If you have questions about this Privacy Policy, please reach out via our <Link href="/support" className="text-[var(--ludo-neon-green)] hover:underline">Support</Link> page.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
