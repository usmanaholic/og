import React from 'react';
import { HeroBanner } from './components/HeroBanner';
import { SupportCounter } from './components/SupportCounter';
import { ExperienceSection } from './components/ExperienceSection';
import { PollSection } from './components/PollSection';
import { SupportWall } from './components/SupportWall';
import { StorySection } from './components/StorySection';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Support Counter */}
      <SupportCounter />

      {/* Experience Sharing */}
      <ExperienceSection />

      {/* Quick Poll */}
      <PollSection />

      {/* Support Wall */}
      <SupportWall />

      {/* Story Section */}
      <StorySection />

      {/* Footer */}
      <footer className="bg-black py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 mb-4">
            Built with ❤️ for NUST students and their amazing OGs
          </p>
          <p className="text-sm text-gray-500">
            This platform runs on real-time data. All updates happen live!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;