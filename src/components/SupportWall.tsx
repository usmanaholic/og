import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  message: string;
  created_at: string;
}

export function SupportWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('messages_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          setMessages(prev => [payload.new as Message, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data && !error) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || submitting) return;

    setSubmitting(true);

    const { error } = await supabase
      .from('messages')
      .insert([{ message: newMessage.trim() }]);

    if (!error) {
      setNewMessage('');
    }

    setSubmitting(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <section className="py-16 px-6 bg-black/40">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <MessageCircle className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Wall of Support</h2>
          </div>
          <p className="text-gray-300 text-lg">Quick shoutouts and messages of support</p>
        </div>

        {/* Message Form */}
        <div className="bg-black/60 rounded-2xl p-6 mb-8 border border-yellow-500/20 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Your message of support..."
              maxLength={140}
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || submitting}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 px-6 rounded-xl font-semibold hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">{submitting ? 'Posting...' : 'Post'}</span>
            </button>
          </form>
          <div className="text-right text-sm text-gray-400 mt-2">
            {newMessage.length}/140
          </div>
        </div>

        {/* Messages Feed */}
        <div className="bg-black/60 rounded-2xl p-6 border border-yellow-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>Latest Support Messages</span>
            </h3>
            <div className="text-sm text-gray-400">
              {messages.length} messages
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Share your support!</p>
            </div>
          ) : (
            <div className="grid gap-3 max-h-64 overflow-y-auto custom-scrollbar">
              {messages.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 hover:border-yellow-400/30 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-200 flex-1 pr-4">{msg.message}</p>
                    <span className="text-gray-400 text-xs whitespace-nowrap">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}