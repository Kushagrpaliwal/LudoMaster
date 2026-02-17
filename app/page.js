"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaGamepad, FaBolt, FaTrophy, FaShieldAlt, FaHeart, FaMobileAlt,
  FaPlay, FaStar, FaUsers, FaChevronDown, FaGlobe, FaMedal
} from "react-icons/fa";

// Feature data
const features = [
  { icon: FaGamepad, title: "Smart AI Opponents", desc: "Challenge intelligent bots that adapt to your playing style" },
  { icon: FaBolt, title: "Instant Matches", desc: "Get matched in seconds, start playing instantly" },
  { icon: FaTrophy, title: "Skill-Based Gameplay", desc: "Win based on strategy, not just luck" },
  { icon: FaShieldAlt, title: "Fair Play", desc: "Advanced matchmaking for balanced games" },
  { icon: FaHeart, title: "100% Free to Play", desc: "No hidden fees, no pay-to-win mechanics" },
  { icon: FaMobileAlt, title: "Mobile & Web", desc: "Play anywhere, anytime, any device" },
];

// Top players data
const topPlayers = [
  { name: "Rahul S.", wins: 156, avatar: "/avatar/1.png" },
  { name: "Priya M.", wins: 142, avatar: "/avatar/2.png" },
  { name: "Amit K.", wins: 128, avatar: "/avatar/3.png" },
  { name: "Sneha R.", wins: 115, avatar: "/avatar/4.png" },
  { name: "Vikram P.", wins: 103, avatar: "/avatar/5.png" },
  { name: "Neha G.", wins: 98, avatar: "/avatar/6.png" },
];

// Testimonials data
const testimonials = [
  { name: "Arjun Sharma", text: "Best Ludo app ever! The gameplay is smooth and fair. Love playing with my friends!", rating: 5 },
  { name: "Meera Patel", text: "Finally a skill-based Ludo game where strategy matters. Super addictive!", rating: 5 },
  { name: "Ravi Kumar", text: "Great way to pass time and connect with family. The gameplay is seamless!", rating: 5 },
];

const LandingPage = () => {
  const [playerCount, setPlayerCount] = useState(124567);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Simulate live player count
    const interval = setInterval(() => {
      setPlayerCount(prev => prev + Math.floor(Math.random() * 10) - 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-hero-gradient font-premium overflow-x-hidden premium-scrollbar">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black italic tracking-tighter text-white">
                LUDO<span className="text-[var(--ludo-neon-green)]">MASTER</span>
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-card text-[var(--ludo-neon-green)] text-sm">
                <span className="w-2 h-2 bg-[var(--ludo-neon-green)] rounded-full animate-pulse"></span>
                <span>{playerCount.toLocaleString()} Online</span>
              </div>
              <Link href="/games/ludo" className="flex items-center gap-2 px-4 py-2 btn-primary-glow text-sm">
                <FaPlay />
                <span className="font-semibold">Play Now</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Tokens */}
          <Image
            src="/ludo/redgotti.png"
            width={80} height={80}
            alt=""
            className="absolute top-[15%] left-[10%] animate-float opacity-70 hidden md:block"
          />
          <Image
            src="/ludo/bluegotti.png"
            width={70} height={70}
            alt=""
            className="absolute top-[25%] right-[12%] animate-float-reverse opacity-70 hidden md:block"
          />
          <Image
            src="/ludo/greengotti.png"
            width={60} height={60}
            alt=""
            className="absolute bottom-[30%] left-[8%] animate-float-slow opacity-60 hidden md:block"
          />
          <Image
            src="/ludo/yellowgotti.png"
            width={75} height={75}
            alt=""
            className="absolute bottom-[25%] right-[10%] animate-float opacity-70 hidden md:block"
          />

          {/* Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--ludo-neon-green)] rounded-full filter blur-[150px] opacity-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--ludo-electric-blue)] rounded-full filter blur-[150px] opacity-10"></div>
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-[var(--ludo-soft-gold)] text-sm font-medium mb-6 animate-pulse-glow">
            <FaTrophy />
            <span>India&apos;s Favorite Free Ludo Game</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Play Ludo.<br />
            <span className="text-gradient">Have Fun.</span><br />
            Rule the Board.
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-[var(--ludo-text-secondary)] max-w-2xl mx-auto mb-8">
            Smart AI opponents • Fast matches • 100% Free to Play
          </p>

          {/* Dice Animation */}
          <div className="flex justify-center mb-8">
            <Image
              src="/diceroll1.gif"
              width={100}
              height={100}
              alt="Dice"
              className="animate-dice-glow"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/games/ludo"
              className="btn-primary-glow px-8 py-4 text-lg font-bold flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <FaPlay /> Play Now - It&apos;s Free!
            </Link>
            <Link
              href="#gameplay"
              className="btn-secondary-glow px-8 py-4 text-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Watch Gameplay
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[var(--ludo-text-muted)] text-sm">
            <div className="flex items-center gap-2">
              <FaHeart className="text-[var(--ludo-neon-green)]" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-[var(--ludo-electric-blue)]" />
              <span>100K+ Players</span>
            </div>
            <div className="flex items-center gap-2">
              <FaGlobe className="text-[var(--ludo-soft-gold)]" />
              <span>Play Worldwide</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <FaChevronDown size={24} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="font-black italic tracking-tighter text-white">
                WHY CHOOSE  LUDO<span className="text-[var(--ludo-neon-green)]">MASTER</span>
              </span> ?
            </h2>
            <p className="text-[var(--ludo-text-secondary)] text-lg max-w-2xl mx-auto">
              Experience the next generation of online Ludo gaming
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card feature-card p-6 sm:p-8 text-center group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--ludo-neon-green)]/20 to-[var(--ludo-electric-blue)]/20 flex items-center justify-center group-hover:glow-green transition-all">
                  <feature.icon className="text-2xl text-[var(--ludo-neon-green)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-[var(--ludo-text-muted)]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gameplay Preview Section */}
      <section id="gameplay" className="py-20 px-4 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--ludo-electric-blue)]/5 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Experience the <span className="text-gradient-gold">Thrill</span>
            </h2>
            <p className="text-[var(--ludo-text-secondary)] text-lg max-w-2xl mx-auto">
              Stunning visuals, smooth gameplay, real competition
            </p>
          </div>

          {/* Game Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Dice Animation Card */}
            <div className="glass-card-strong p-6 text-center">
              <div className="mb-4">
                <Image src="/diceroll2.gif" width={120} height={120} alt="Dice Roll" className="mx-auto animate-dice-glow" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dynamic Dice</h3>
              <p className="text-[var(--ludo-text-muted)]">Realistic 3D dice with smooth animations</p>
            </div>

            {/* Player Avatars Card */}
            <div className="glass-card-strong p-6 text-center">
              <div className="flex justify-center gap-2 mb-4 pt-10">
                <Image src="/ludo/redgotti.png" width={50} height={50} alt="" className="animate-float" />
                <Image src="/ludo/bluegotti.png" width={50} height={50} alt="" className="animate-float-reverse" />
                <Image src="/ludo/greengotti.png" width={50} height={50} alt="" className="animate-float" />
                <Image src="/ludo/yellowgotti.png" width={50} height={50} alt="" className="animate-float-reverse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Colorful Tokens</h3>
              <p className="text-[var(--ludo-text-muted)]">Choose your color, show your style</p>
            </div>

            {/* Match Timer Card */}
            <div className="glass-card-strong p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-[var(--ludo-neon-green)] flex items-center justify-center">
                <span className="text-3xl font-bold text-white">10:00</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quick Matches</h3>
              <p className="text-[var(--ludo-text-muted)]">Fast-paced games, maximum excitement</p>
            </div>
          </div>

          {/* Game Mode Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/games/ludo/TwoPlayerLudo" className="group relative overflow-hidden rounded-3xl">
              <Image
                src="/h3.jpeg"
                width={600}
                height={300}
                alt="2 Player Mode"
                className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">2 Player Mode</h3>
                  <p className="text-[var(--ludo-text-secondary)]">Classic 1v1 battles</p>
                </div>
              </div>
            </Link>
            <Link href="/games/ludo/FourPlayerLudo" className="group relative overflow-hidden rounded-3xl">
              <Image
                src="/h5.jpeg"
                width={600}
                height={300}
                alt="4 Player Mode"
                className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">4 Player Mode</h3>
                  <p className="text-[var(--ludo-text-secondary)]">Epic 4-player showdowns</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Live Player Count */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-card-strong glow-green">
              <span className="w-3 h-3 bg-[var(--ludo-neon-green)] rounded-full animate-pulse"></span>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {playerCount.toLocaleString()}
              </span>
              <span className="text-[var(--ludo-text-secondary)]">Players Online Now</span>
            </div>
          </div>

          {/* Top Players Ticker */}
          <div className="mb-16 relative overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white">� Top Players This Week</h3>
            </div>
            <div className="relative overflow-hidden py-4">
              <div className="flex gap-4 animate-ticker">
                {[...topPlayers, ...topPlayers].map((player, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 glass-card px-4 py-3 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--ludo-neon-green)] to-[var(--ludo-electric-blue)] flex items-center justify-center text-white font-bold">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{player.name}</p>
                      <p className="text-[var(--ludo-soft-gold)] font-bold flex items-center gap-1">
                        <FaMedal className="text-xs" /> {player.wins} Wins
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Loved by 100K+ Players</h3>
            <p className="text-[var(--ludo-text-secondary)]">See what our players say about us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center gap-1 text-[var(--ludo-soft-gold)] mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-[var(--ludo-text-secondary)] mb-4">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--ludo-neon-purple)] to-[var(--ludo-electric-blue)] flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <span className="text-white font-semibold">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ludo-neon-green)]/10 via-[var(--ludo-electric-blue)]/10 to-[var(--ludo-neon-purple)]/10"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Roll the <span className="text-gradient">Dice</span>?
          </h2>
          <p className="text-xl text-[var(--ludo-text-secondary)] mb-8 max-w-2xl mx-auto">
            Join thousands of players having fun every day. It&apos;s completely free!
          </p>

          <Link
            href="/games/ludo"
            className="inline-flex items-center gap-3 btn-primary-glow px-10 py-5 text-xl font-bold animate-pulse-glow"
          >
            <FaPlay /> Start Playing - Free!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black italic tracking-tighter text-white">
                LUDO<span className="text-[var(--ludo-neon-green)]">MASTER</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-[var(--ludo-text-muted)] text-sm">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              {/* <Link href="/support" className="hover:text-white transition-colors">Support</Link> */}
              <Link href="/feedback" className="hover:text-white transition-colors">Feedback</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </div>
            <p className="text-[var(--ludo-text-muted)] text-sm">
              © 2026 LudoMasterGanjapatel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;