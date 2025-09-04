import React from 'react';
import { Heart, Users } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 py-20 px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-red-500/10"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-400/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center mb-6">
          <Users className="w-16 h-16 text-emerald-400 mr-4" />
          <Heart className="w-12 h-12 text-red-400 animate-pulse" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-red-400 bg-clip-text text-transparent">
          We Stand With OGs ✊
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Share your support & stories here. Let's show our Orientation Guides how much they mean to us.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Real-time Voting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <span>Anonymous Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}