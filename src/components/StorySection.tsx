import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export function StorySection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortStory = "Alright lemma clear up the confusion. Orientation is about the Freshman experience. It's the only event that circulates around freshman comfort. I think we all can agree on that. And there are some strict rules, Regulations and boundaries that shouldn't be cross that WILL affect your freshman experience.";

  const fullStory = `Alright lemma clear up the confusion. Orientation is about the Freshman experience. It's the only event that circulates around freshman comfort. I think we all can agree on that. And there are some strict rules ,Regulations and boundaries that shouldn't be cross that WILL affect your freshman experience.

All of this drama has been going on for the past month. We OC prepare everything for the incoming Freshman so they don't get on the wrong path once they enter the University life.

The complaints against the (Socials) guy Jis ki waja sy aj ye sab drama howa ha, aik month sy report ho rhi thi bar bar (around 20 time)

Still no regulatory Action was taken against him.

Alright ig it can slide apparently if he is doing his shameful acts in just the preparation and not in front of actual freshmen but NO? The man had the audacity to break every single rule and guidelines even on day 1 in front of freshmen who were just innocent kids and wrapping their minds around what actually happens in university. The guy did everything ranging from smoking to actual PDA in front of 3000 kids who were present there.

Yeah is baat per complaints were made against him at that exact moment and yeah no wonder no action were taken against him. All of the EC knew about him and backed him up by blackmailing that if (social guy) get terminated due to his PDA and smoking actions they will destroy the event (just because the guy brought 6 stalls for ON fest) this shows how much This EC priorities about the freshman experience and the money even after the guy admitted his actions was cocky about it

It resulted in humiliation and threatening the Team OGs (the one who complained about the the guy's action in front of the freshmen) As there was no one in the EC present to actually stand with the truth. After all of these disputes and other problems Still no kind of actions were taken but instead team ogs were asked resign if they "have a problem with the decisions of EC"

Obv the OGs resigned banta tha if the sole purpose and morals they work (freshmen experience and view on University life) were being breached constantly by some OC guys. You can't imagine to turn around the eyes of eyes 3000 witnesses.

If no one is ready to listen to you and ap ki awwaz dabadi jay to ig this leaves no other option.

The part that OGs have abandoned their freshmen is not true. I have seen multiple OGs still talking to their freshmen and guiding them all over nust , asking them to attend DJ night and drama even after resignation.

I think this shows who was actually ready to abandon the freshman and who's not.`;

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">The Real Story</h2>
          </div>
          <p className="text-gray-300 text-lg">Understanding what really happened during orientation</p>
        </div>

        <div className="bg-black/60 rounded-2xl p-8 border border-orange-500/20 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-orange-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">What Freshmen Need to Know</h3>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="text-gray-200 leading-relaxed space-y-4">
              {isExpanded ? (
                <div className="whitespace-pre-line">
                  {fullStory}
                </div>
              ) : (
                <div>
                  {shortStory}
                  <span className="text-gray-400">...</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-6 flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors duration-300 group"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-5 h-5 group-hover:transform group-hover:-translate-y-1 transition-transform duration-300" />
                  <span>Read Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5 group-hover:transform group-hover:translate-y-1 transition-transform duration-300" />
                  <span>Read More</span>
                </>
              )}
            </button>
          </div>

          {/* Call to action */}
          <div className="mt-8 p-6 bg-orange-500/10 rounded-xl border border-orange-500/30">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
              <span className="text-orange-400 font-semibold">Important Message</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              This story explains the context behind recent events. OGs didn't abandon freshmen - they stood up for what's right. 
              Your support shows that the NUST community values integrity and the freshman experience above all else.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}