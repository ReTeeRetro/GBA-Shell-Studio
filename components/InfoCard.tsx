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
      <div className="text-sm text-slate-500 leading-relaxed space-y-4">
        <p>
          Choose colors for the <span className="text-slate-800 font-semibold italic">shell</span>, <span className="text-slate-800 font-semibold italic">lens</span>, and <span className="text-slate-800 font-semibold italic">buttons</span>. Experiment freely with <strong>custom colors</strong> using the palette picker.
        </p>
        
        <p>
          When you're happy with the result, you can:
        </p>
        
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Download</strong> your configuration as a high-res PNG.</li>
          <li><strong>Share</strong> the unique URL with others.</li>
          <li><strong>Visualize</strong> your design using advanced AI tools.</li>
        </ul>

        <div className="pt-4 border-t border-slate-100">
          <p className="font-medium text-slate-700 mb-1 italic">Any feedback? We'd love to hear it!</p>
          <a 
            href="mailto:reteeretro@gmail.com" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
            reteeretro@gmail.com
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};