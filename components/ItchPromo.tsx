import React from 'react';

export const ItchPromo: React.FC = () => {
  return (
    <div className="mt-6 flex justify-center w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-[#f1f1f1] dark:bg-slate-900 transition-colors">
      <iframe 
        frameBorder="0" 
        src="https://itch.io/embed/4423322?border_width=0&amp;bg_color=f1f1f1&amp;link_color=327345" 
        width="550" 
        height="165"
        className="max-w-full"
        title="Zombie Escape by Retee Retro"
      >
        <a href="https://retee-retro.itch.io/zombie-escape">Zombie Escape by Retee Retro</a>
      </iframe>
    </div>
  );
};
