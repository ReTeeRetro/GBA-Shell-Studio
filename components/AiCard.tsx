import React from 'react';
import { Sparkles, Bot, ExternalLink } from 'lucide-react';

interface AiCardProps {
  onOpenAi: (tool: 'chatgpt' | 'gemini') => void;
}

export const AiCard: React.FC<AiCardProps> = ({ onOpenAi }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden mt-6">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Sparkles size={64} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-indigo-900 mb-2 uppercase tracking-wide flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            AI Visualization
          </h3>
          <p className="text-sm text-indigo-700/80 leading-relaxed">
            Want to see a photorealistic render? Generate a prompt for your ChatGPT to visualize this
            design (opens in new tab).
          </p>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <button
            onClick={() => onOpenAi('chatgpt')}
            className="w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Bot size={18} className="text-indigo-200" />
            ChatGPT
            <ExternalLink size={12} className="text-indigo-300 ml-0.5 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
