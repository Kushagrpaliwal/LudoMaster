"use client";
import React from "react";
import Link from "next/link";
import { FaArrowLeft, FaFileContract } from "react-icons/fa";

const TermsPage = () => {
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
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--ludo-neon-green)]/20 to-[var(--ludo-electric-blue)]/20 flex items-center justify-center">
                            <FaFileContract className="text-4xl text-[var(--ludo-neon-green)]" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                            Terms & <span className="text-gradient">Conditions</span>
                        </h1>
                        <p className="text-[var(--ludo-text-secondary)]">Last updated: January 2026</p>
                    </div>

                    <div className="glass-card-strong rounded-3xl p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                By accessing and using LudoMaster, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Use of Service</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                LudoMaster is a free-to-play online Ludo game. You may use our service for personal, non-commercial entertainment purposes only. You agree not to misuse the service or help anyone else do so.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                You agree to use LudoMaster in a manner consistent with all applicable laws and regulations. You shall not engage in any activity that interferes with or disrupts the service or servers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                All content, features, and functionality of LudoMaster are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                LudoMaster is provided "as is" without any warranties. We do not guarantee that the service will be uninterrupted, secure, or error-free.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Contact</h2>
                            <p className="text-[var(--ludo-text-secondary)] leading-relaxed">
                                If you have any questions about these Terms, please contact us through our <Link href="/support" className="text-[var(--ludo-neon-green)] hover:underline">Support</Link> page.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
