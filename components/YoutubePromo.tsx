import React from 'react';
import { Youtube, ExternalLink } from 'lucide-react';

export const YoutubePromo: React.FC = () => {
  return (
    <a 
      href="https://www.youtube.com/@ReTeeRetro"
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-red-200 hover:shadow-md transition-all duration-300 mt-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-2.5 rounded-xl shadow-red-100 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Youtube size={20} className="text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              ReTee Retro
              <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-tighter font-black">YouTube</span>
            </h4>
            <p className="text-xs text-slate-500">Subscribe for custom GBA builds and modding tips!</p>
          </div>
        </div>
        <div className="text-slate-300 group-hover:text-red-500 transition-colors pr-2">
          <ExternalLink size={18} />
        </div>
      </div>
    </a>
  );
};