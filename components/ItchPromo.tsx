import React from 'react';

export const ItchPromo: React.FC = () => {
  return (
    <div className="mt-6 flex justify-start w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-[#f3f3f3] dark:bg-slate-900 transition-colors">
      <iframe 
        frameBorder="0" 
        src="https://itch.io/embed/4423322?linkback=true&amp;bg_color=f3f3f3&amp;link_color=327345" 
        width="552" 
        height="167"
        className="max-w-full"
        title="Zombie Escape by Retee Retro"
      >
        <a href="https://retee-retro.itch.io/zombie-escape">Zombie Escape by Retee Retro</a>
      </iframe>
    </div>
  );
};
