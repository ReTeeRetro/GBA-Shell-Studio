import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Check, Copy } from 'lucide-react';
import { GbaConfig } from '../types';
import { serializeConfig } from '../utils/urlUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GbaConfig;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, config }) => {
  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const queryString = serializeConfig(config);
      const url = new URL(window.location.href);
      url.search = queryString;
      setGeneratedUrl(url.toString());
      setCopied(false);
      setToastMessage('');
    }
  }, [isOpen, config]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSocialClick = (platform: string) => {
    const text = "Check out my custom GBA design! #gbashellstudio";
    const encodedUrl = encodeURIComponent(generatedUrl);
    const encodedText = encodeURIComponent(text);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'discord':
        // These platforms don't support web share URLs well, so we copy to clipboard
        handleCopy();
        setToastMessage(`Link copied! Ready to paste into Discord.`);
        setTimeout(() => setToastMessage(''), 3000);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Share Design</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Social Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            <SocialButton 
              label="Facebook" 
              color="bg-[#1877F2]" 
              onClick={() => handleSocialClick('facebook')}
              icon={<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
            />
            <SocialButton 
              label="X" 
              color="bg-black" 
              onClick={() => handleSocialClick('x')}
              icon={<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />}
            />
            <SocialButton 
              label="Reddit" 
              color="bg-[#FF4500]" 
              onClick={() => handleSocialClick('reddit')}
              icon={<path d="M12 8c1.31 0 2.5.53 3.39 1.41L13.97 10.8C13.46 10.29 12.76 10 12 10c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.69 0 3.14-1.04 3.73-2.52l2.3.84C16.92 18.86 14.65 20.5 12 20.5c-3.59 0-6.5-2.91-6.5-6.5S8.41 7.5 12 7.5M22 11.5c0-.83-.67-1.5-1.5-1.5-.62 0-1.15.38-1.38.91l-2.48-.9c.47-1.22 1.63-2.09 3.01-2.09.2 0 .4.02.59.05L19.26 6.1c-.26-.06-.53-.09-.81-.09-1.93 0-3.5 1.57-3.5 3.5 0 .1.01.2.02.3l-2.61.95c-.53-.36-1.18-.56-1.86-.56-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c1.72 0 3.15-1.25 3.44-2.89l3.39-1.24c.36.57.99.94 1.71.94 1.1 0 2-.9 2-2 0-.29-.07-.56-.19-.8l1.32-2.16c.33.1.68.16 1.05.16.83 0 1.5-.67 1.5-1.5z" />}
            />
            <SocialButton 
              label="Discord" 
              color="bg-[#5865F2]" 
              onClick={() => handleSocialClick('discord')}
              icon={<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.5151.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />}
            />
            <SocialButton 
              label="WhatsApp" 
              color="bg-[#25D366]" 
              onClick={() => handleSocialClick('whatsapp')}
              icon={<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />}
            />
          </div>

          {toastMessage && (
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-center font-medium animate-in fade-in slide-in-from-top-1">
              {toastMessage}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or copy link</span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LinkIcon size={14} />
              </div>
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
              />
            </div>
            <button
              onClick={handleCopy}
              className={`shrink-0 px-4 py-2 rounded-xl text-white font-bold text-sm transition-all flex items-center gap-2 ${
                copied 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SocialButtonProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ label, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 group"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md ${color}`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        stroke="none"
        className="w-6 h-6"
      >
        {icon}
      </svg>
    </div>
    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
      {label}
    </span>
  </button>
);