import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUserIdentifier } from '../hooks/useUserIdentifier';

export function SupportCounter() {
  const [count, setCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = useUserIdentifier();

  const GOAL = 1000;
  const progress = Math.min((count / GOAL) * 100, 100);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial count
    fetchVoteCount();
    
    // Check if user has voted
    checkUserVote();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('votes_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'votes' }, 
        () => {
          fetchVoteCount();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchVoteCount = async () => {
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true });
    
    setCount(count || 0);
  };

  const checkUserVote = async () => {
    if (!userId) return;
    
    const { data } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    setHasVoted(!!data);
  };

  const handleVote = async () => {
    if (hasVoted || !userId || loading) return;
    
    setLoading(true);
    
    const { error } = await supabase
      .from('votes')
      .insert([{ user_id: userId }]);

    if (!error) {
      setHasVoted(true);
    }
    
    setLoading(false);
  };

  return (
    <section className="bg-gray-900/80 backdrop-blur-sm py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-black/40 rounded-3xl p-8 border border-emerald-500/20 shadow-2xl">
          <div className="mb-8">
            <div className="flex justify-center items-center mb-4">
              <TrendingUp className="w-8 h-8 text-emerald-400 mr-3" />
              <span className="text-emerald-400 font-semibold text-lg">LIVE SUPPORT COUNT</span>
            </div>
            
            <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4 animate-pulse">
              {count.toLocaleString()}
            </div>
            
            <p className="text-gray-300 text-lg">students supporting OGs</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Goal: {GOAL.toLocaleString()} supporters</span>
              <span>{progress.toFixed(1)}% complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-1000 ease-out shadow-lg shadow-emerald-400/30"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Vote Button */}
          <button
            onClick={handleVote}
            disabled={hasVoted || loading || !userId}
            className={`
              relative px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform
              ${hasVoted 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 hover:scale-105 hover:shadow-lg hover:shadow-emerald-400/30 active:scale-95'
              }
              ${loading ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-center space-x-3">
              <Heart className={`w-6 h-6 ${hasVoted ? 'fill-current' : ''}`} />
              <span>
                {loading ? 'Supporting...' : hasVoted ? 'Thank You!' : 'I Support OGs'}
              </span>
            </div>
            
            {!hasVoted && !loading && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            )}
          </button>

          {hasVoted && (
            <p className="text-emerald-400 text-sm mt-4 animate-fade-in">
              Your support has been counted! Share this with your friends.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}