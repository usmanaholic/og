import React, { useState, useEffect } from 'react';
import { BarChart3, Vote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUserIdentifier } from '../hooks/useUserIdentifier';

interface PollResponse {
  id: string;
  question: string;
  option: string;
  user_id: string;
  created_at: string;
}

export function PollSection() {
  const [pollData, setPollData] = useState<{ yes: number; no: number }>({ yes: 0, no: 0 });
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = useUserIdentifier();

  const question = "Do you think OGs abandoned freshmen?";
  const totalVotes = pollData.yes + pollData.no;
  const yesPercentage = totalVotes > 0 ? (pollData.yes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (pollData.no / totalVotes) * 100 : 0;

  useEffect(() => {
    if (!userId) return;

    fetchPollData();
    checkUserVote();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('polls_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'polls' }, 
        () => {
          fetchPollData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchPollData = async () => {
    const { data, error } = await supabase
      .from('polls')
      .select('option')
      .eq('question', question);

    if (data && !error) {
      const yes = data.filter(item => item.option === 'Yes').length;
      const no = data.filter(item => item.option === 'No').length;
      setPollData({ yes, no });
    }
  };

  const checkUserVote = async () => {
    if (!userId) return;
    
    const { data } = await supabase
      .from('polls')
      .select('option')
      .eq('user_id', userId)
      .eq('question', question)
      .maybeSingle();
    
    setUserVote(data?.option || null);
  };

  const handleVote = async (option: 'Yes' | 'No') => {
    if (userVote || !userId || loading) return;
    
    setLoading(true);
    
    const { error } = await supabase
      .from('polls')
      .insert([{
        question,
        option,
        user_id: userId
      }]);

    if (!error) {
      setUserVote(option);
    }
    
    setLoading(false);
  };

  return (
    <section className="py-16 px-6 bg-gray-900/40">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <BarChart3 className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Quick Poll</h2>
          </div>
        </div>

        <div className="bg-black/60 rounded-2xl p-8 border border-purple-500/20 backdrop-blur-sm">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-8 text-center">
            {question}
          </h3>

          {!userVote ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => handleVote('Yes')}
                disabled={loading}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Vote className="w-5 h-5" />
                  <span>Yes</span>
                </div>
              </button>
              <button
                onClick={() => handleVote('No')}
                disabled={loading}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Vote className="w-5 h-5" />
                  <span>No</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="mb-8 text-center">
              <p className="text-gray-300">
                You voted: <span className={`font-semibold ${userVote === 'Yes' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {userVote}
                </span>
              </p>
            </div>
          )}

          {/* Results */}
          {totalVotes > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white text-center mb-6">
                Live Results ({totalVotes} votes)
              </h4>
              
              <div className="space-y-4">
                {/* Yes Option */}
                <div className="flex items-center space-x-4">
                  <span className="text-red-300 font-medium w-8">Yes</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-400 h-full transition-all duration-1000 ease-out shadow-lg shadow-red-400/20"
                      style={{ width: `${yesPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-red-300 font-bold w-12">{yesPercentage.toFixed(1)}%</span>
                  <span className="text-gray-400 text-sm w-12">({pollData.yes})</span>
                </div>

                {/* No Option */}
                <div className="flex items-center space-x-4">
                  <span className="text-emerald-300 font-medium w-8">No</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-1000 ease-out shadow-lg shadow-emerald-400/20"
                      style={{ width: `${noPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-emerald-300 font-bold w-12">{noPercentage.toFixed(1)}%</span>
                  <span className="text-gray-400 text-sm w-12">({pollData.no})</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}