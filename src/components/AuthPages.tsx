/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Lock, ShieldCheck } from 'lucide-react';
import { auth as authApi } from '../api/client';

interface AuthPagesProps {
  onAuthSuccess: (user: any) => void;
  onShowToast: (msg: string) => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthPages({ onAuthSuccess, onShowToast, initialMode = 'login' }: AuthPagesProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Fields states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 9) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const score = getPasswordStrength();

  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      onShowToast("Please enter all required fields");
      return;
    }
    if (password.length < 4) {
      onShowToast("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      authApi.storeToken(res.token);
      onShowToast("Welcome back!");
      onAuthSuccess(res.user);
    } catch (err: any) {
      onShowToast(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      onShowToast("Please enter all required fields");
      return;
    }

    if (password !== confirmPassword) {
      onShowToast("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      onShowToast("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register(email, username, password);
      authApi.storeToken(res.token);
      onShowToast("Account created successfully!");
      onAuthSuccess(res.user);
    } catch (err: any) {
      onShowToast(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-on-surface flex items-center justify-center p-4 relative overflow-hidden bg-neutral-950 font-sans tracking-tight leading-snug select-none">
      
      {/* Absolute blurry neon design decoration helpers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-sm py-12">
        <div className="bg-neutral-900 border border-neutral-850 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-2xl">
          
          {/* Header Identity banner */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-red-600 tracking-tighter uppercase">
              StreamX
            </h1>
            <p className="text-sm font-semibold text-neutral-400 mt-1">
              {mode === 'login' ? 'Unlimited movies, TV shows, and more.' : 'Create your premium account'}
            </p>
          </div>

          <form onSubmit={mode === 'login' ? handleSignIn : handleSignUp} className="space-y-4">
            
            {/* Username Input ONLY inside SignUp */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1" htmlFor="username">Username</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input 
                    id="username"
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500 text-sm text-white px-10 py-3 rounded-lg outline-none transition-all "
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field line */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500 text-sm text-white px-10 py-3 rounded-lg outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field line */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500 text-sm text-white px-10 py-3 rounded-lg outline-none transition-all"
                  required
                />
              </div>

              {/* Password strength colored tracker bars (Sign Up ONLY) */}
              {mode === 'signup' && password.length > 0 && (
                <div className="flex gap-1 mt-2 px-1">
                  {[1, 2, 3, 4].map((barIndex) => {
                    const isActive = barIndex <= score;
                    let barColor = 'bg-neutral-800';
                    if (isActive) {
                      if (score <= 1) barColor = 'bg-red-600';
                      else if (score <= 3) barColor = 'bg-amber-600';
                      else barColor = 'bg-emerald-600';
                    }
                    return (
                      <div 
                        key={barIndex} 
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${barColor}`} 
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password Field ONLY on SignUp */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1" htmlFor="confirm-pass">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input 
                    id="confirm-pass"
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500 text-sm text-white px-10 py-3 rounded-lg outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Main Submit Action button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-black text-sm uppercase tracking-wider mt-4 shadow-lg shadow-red-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Slogan Switch Link footer */}
          <div className="mt-6 text-center border-t border-neutral-850 pt-4">
            <p className="text-xs text-neutral-400">
              {mode === 'login' ? "New to StreamX? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  // Clear fields on mode flip
                  setUsername("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-red-500 font-bold hover:underline cursor-pointer"
              >
                {mode === 'login' ? 'Sign Up Now' : 'Sign In'}
              </button>
            </p>
          </div>

        </div>

        {/* Small text legal print footer */}
        <p className="text-center text-[10px] text-neutral-500 mt-8 px-6 leading-relaxed">
          {mode === 'login' 
            ? '© 2026 StreamX Inc. High-fidelity cinematic experiences.' 
            : 'By signing up, you agree to our Terms of Service and Privacy Policy. Enjoy unlimited cinematic content.'}
        </p>
      </main>
    </div>
  );
}
