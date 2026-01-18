"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUsers, FaUserFriends, FaArrowLeft, FaGamepad, FaTrophy, FaDice } from "react-icons/fa";

const LudoModePage = () => {
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
            <Link href="/feedback" className="text-sm font-medium text-[var(--ludo-neon-green)] hover:text-white transition-colors">
              Feedback
            </Link>
          </div>
        </div>
      </nav>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Tokens */}
        <Image
          src="/ludo/redgotti.png"
          width={60} height={60}
          alt=""
          className="absolute top-[20%] left-[5%] animate-float opacity-50 hidden md:block"
        />
        <Image
          src="/ludo/bluegotti.png"
          width={50} height={50}
          alt=""
          className="absolute top-[30%] right-[8%] animate-float-reverse opacity-50 hidden md:block"
        />
        <Image
          src="/ludo/greengotti.png"
          width={45} height={45}
          alt=""
          className="absolute bottom-[25%] left-[10%] animate-float-slow opacity-40 hidden md:block"
        />
        <Image
          src="/ludo/yellowgotti.png"
          width={55} height={55}
          alt=""
          className="absolute bottom-[35%] right-[5%] animate-float opacity-50 hidden md:block"
        />

        {/* Glowing Orbs */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[var(--ludo-neon-green)] rounded-full filter blur-[150px] opacity-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[var(--ludo-electric-blue)] rounded-full filter blur-[150px] opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Select <span className="text-gradient">Game Mode</span>
          </h1>
          <p className="text-lg text-[var(--ludo-text-secondary)] max-w-md mx-auto">
            Challenge the Players in classic Ludo. Pick your preferred mode and start rolling!
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* 2 Player Mode */}
          <Link
            href="/games/ludo/TwoPlayerLudo"
            className="group relative overflow-hidden rounded-3xl glass-card-strong p-8 border border-white/10 hover:border-[var(--ludo-electric-blue)]/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:glow-blue transition-all duration-300">
                <FaUserFriends className="text-4xl text-[var(--ludo-electric-blue)]" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white text-center mb-3">
                2 Player
              </h2>

              {/* Description */}
              <p className="text-[var(--ludo-text-muted)] text-center mb-6">
                Classic 1v1 battle against a smart bot opponent
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <span className="px-3 py-1 glass-card text-xs text-[var(--ludo-electric-blue)]">Quick Match</span>
                <span className="px-3 py-1 glass-card text-xs text-[var(--ludo-electric-blue)]">2 Players</span>
                <span className="px-3 py-1 glass-card text-xs text-[var(--ludo-electric-blue)]">Classic Rules</span>
              </div>

              {/* Player Tokens */}
              <div className="flex justify-center gap-4">
                <Image src="/ludo/redgotti.png" width={40} height={40} alt="" className="animate-float" />
                <Image src="/ludo/yellowgotti.png" width={40} height={40} alt="" className="animate-float-reverse" />
              </div>

              {/* Play Button Indicator */}
              <div className="mt-6 text-center">
                <span className="inline-flex items-center gap-2 text-[var(--ludo-electric-blue)] font-semibold group-hover:gap-3 transition-all">
                  Play Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* 4 Player Mode */}
          <Link
            href="/games/ludo/FourPlayerLudo"
            className="group relative overflow-hidden rounded-3xl glass-card-strong p-8 border border-white/10 hover:border-[var(--ludo-neon-green)]/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,255,136,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:glow-green transition-all duration-300">
                <FaUsers className="text-4xl text-[var(--ludo-neon-green)]" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white text-center mb-3">
                4 Player
              </h2>

              {/* Description */}
              <p className="text-[var(--ludo-text-muted)] text-center mb-6">
                Epic battle royale with 3 competitive bot opponents
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <span className="px-3 py-1 glass-card text-xs text-[var(--ludo-neon-green)]">Battle Royale</span>
                <span className="px-3 py-1 glass-card text-xs text-[var(--ludo-neon-green)]">4 Players</span>
                <span className="px-3 py-1 glass-card text-xs text-[var(--ludo-neon-green)]">Full Board</span>
              </div>

              {/* Player Tokens */}
              <div className="flex justify-center gap-3">
                <Image src="/ludo/redgotti.png" width={35} height={35} alt="" className="animate-float" />
                <Image src="/ludo/bluegotti.png" width={35} height={35} alt="" className="animate-float-reverse" />
                <Image src="/ludo/greengotti.png" width={35} height={35} alt="" className="animate-float" />
                <Image src="/ludo/yellowgotti.png" width={35} height={35} alt="" className="animate-float-reverse" />
              </div>

              {/* Play Button Indicator */}
              <div className="mt-6 text-center">
                <span className="inline-flex items-center gap-2 text-[var(--ludo-neon-green)] font-semibold group-hover:gap-3 transition-all">
                  Play Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Info */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-[var(--ludo-text-muted)] text-sm">
          <div className="flex items-center gap-2">
            <FaDice className="text-[var(--ludo-neon-green)]" />
            <span>Free to Play</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTrophy className="text-[var(--ludo-soft-gold)]" />
            <span>No Registration Required</span>
          </div>
          <div className="flex items-center gap-2">
            <FaGamepad className="text-[var(--ludo-electric-blue)]" />
            <span>Instant Start</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LudoModePage;
