import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Experience {
  id: string;
  name: string | null;
  experience: string;
  created_at: string;
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExperiences();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('experiences_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'experiences' }, 
        (payload) => {
          setExperiences(prev => [payload.new as Experience, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data && !error) {
      setExperiences(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience.trim() || submitting) return;

    setSubmitting(true);

    const { error } = await supabase
      .from('experiences')
      .insert([{
        name: name.trim() || null,
        experience: experience.trim()
      }]);

    if (!error) {
      setName('');
      setExperience('');
    }

    setSubmitting(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <MessageSquare className="w-8 h-8 text-cyan-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Share Your Experience</h2>
          </div>
          <p className="text-gray-300 text-lg">Tell us about your interactions with OGs - anonymous or named, your choice</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-black/60 rounded-2xl p-6 border border-cyan-500/20 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Leave blank to post anonymously"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Experience <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Share how OGs have helped you or your thoughts about their support..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {experience.length}/500
                </div>
              </div>

              <button
                type="submit"
                disabled={!experience.trim() || submitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-98 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{submitting ? 'Sharing...' : 'Share Experience'}</span>
              </button>
            </form>
          </div>

          {/* Experiences Feed */}
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No experiences shared yet. Be the first!</p>
              </div>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="bg-black/40 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 font-medium">
                        {exp.name || 'Anonymous'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(exp.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{exp.experience}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}