import React from 'react';
import { Sparkles, Bot, ExternalLink } from 'lucide-react';

interface AiCardProps {
  onOpenAi: (tool: 'chatgpt' | 'gemini') => void;
}

export const AiCard: React.FC<AiCardProps> = ({ onOpenAi }) => {
  return (
    <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden mt-6 transition-colors">
      <div className="absolute top-0 right-0 p-3 opacity-10 dark:opacity-5 text-slate-900 dark:text-white">
        <Sparkles size={64} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wide flex items-center gap-2">
            <Sparkles size={16} className="text-slate-900 dark:text-slate-100" />
            AI Visualization
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Want to see a photorealistic render? Generate a prompt for ChatGPT to visualize this
            design in a new tab.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => onOpenAi('chatgpt')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Bot size={16} className="text-slate-200 dark:text-slate-600" />
            ChatGPT
            <ExternalLink size={10} className="text-slate-300 dark:text-slate-500 ml-0.5 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};