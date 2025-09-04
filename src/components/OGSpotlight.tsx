import React, { useState, useEffect } from 'react';
import { Star, Users2, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OG {
  id: string;
  name: string;
  dept: string;
  quote: string;
  photo_url: string | null;
}

export function OGSpotlight() {
  const [ogs, setOgs] = useState<OG[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOGs();
  }, []);

  const fetchOGs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ogs')
      .select('*')
      .order('name');

    if (data && !error) {
      setOgs(data);
    }
    setLoading(false);
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Star className="w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">OG Spotlight</h2>
          </div>
          <p className="text-gray-300 text-lg">Meet the amazing Orientation Guides who make NUST feel like home</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ogs.map((og, index) => (
              <div 
                key={og.id} 
                className="group bg-black/60 rounded-2xl p-6 border border-orange-500/20 backdrop-blur-sm hover:border-orange-400/50 transition-all duration-500 transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  {/* Profile Image */}
                  <div className="relative mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden border-4 border-orange-400/50 group-hover:border-orange-400 transition-colors duration-300">
                    {og.photo_url ? (
                      <img 
                        src={og.photo_url} 
                        alt={og.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                        <Users2 className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Name and Department */}
                  <h3 className="text-xl font-bold text-white mb-1">{og.name}</h3>
                  <p className="text-orange-400 font-medium text-sm mb-4">{og.dept}</p>

                  {/* Quote */}
                  <div className="relative">
                    <Quote className="w-4 h-4 text-gray-400 absolute -top-2 -left-1" />
                    <p className="text-gray-300 text-sm italic leading-relaxed pl-6 pr-2">
                      {og.quote}
                    </p>
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-red-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        {ogs.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            <Users2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>OG profiles will be displayed here once they're added to the database.</p>
          </div>
        )}
      </div>
    </section>
  );
}