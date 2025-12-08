import React from 'react';

export const InfoCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px]">
          i
        </span>
        How it works
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        Choose colors for the shell, lens, and buttons, and experiment freely - you can even use custom
        colors. When you're happy with the result, download your configuration or why not prompt ChatGPT
        with it. This is a very early version of the tool, and things will change as it improves and
        gains more features over time. Any feedback? Contact: reteeretro@gmail.com
      </p>
    </div>
  );
};
