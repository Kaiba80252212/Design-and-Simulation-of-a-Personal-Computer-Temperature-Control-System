import React, { useState } from 'react';
import { UilTimes } from '@iconscout/react-unicons';

interface AppLogoProps {
  theme?: 'dark' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showModalOnClick?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  theme = 'dark',
  className = '',
  size = 'md',
  showModalOnClick = true,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Exact matching design variants:
  const darkIconSrc = '/src/assets/images/dark_pc_icon_white_fan_1791833550185.jpg';
  const darkFallbackSrc = '/icon-dark-white-fan.jpg';

  const lightIconSrc = '/src/assets/images/light_pc_icon_white_fan_1791833561436.jpg';
  const lightFallbackSrc = '/icon-light-white-fan.jpg';

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  return (
    <>
      <div 
        onClick={() => showModalOnClick && setModalOpen(true)}
        className={`relative aspect-square shrink-0 select-none cursor-pointer group ${sizeClasses} ${className}`}
        title={`PC Temperature Control Icon (${theme === 'dark' ? 'Dark Mode' : 'Light Mode'})`}
      >
        {/* Container with crisp Next.js hairline border and zero gradients */}
        <div className="relative w-full h-full rounded-md overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-colors bg-black">
          {/* Dark Mode Icon */}
          <img
            src={darkIconSrc}
            onError={(e) => {
              if (e.currentTarget.src !== darkFallbackSrc) {
                e.currentTarget.src = darkFallbackSrc;
              }
            }}
            alt="PC Temperature Control System Dark Mode Icon"
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
              theme === 'dark' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          />

          {/* Light Mode Icon */}
          <img
            src={lightIconSrc}
            onError={(e) => {
              if (e.currentTarget.src !== lightFallbackSrc) {
                e.currentTarget.src = lightFallbackSrc;
              }
            }}
            alt="PC Temperature Control System Light Mode Icon"
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
              theme === 'light' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          />
        </div>
      </div>

      {/* Modal to view full icon */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-[#0a0a0a] border border-neutral-800 rounded-lg max-w-sm w-full p-4 flex flex-col items-center gap-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full border-b border-neutral-800 pb-2">
              <span className="text-xs font-semibold text-neutral-200">System Asset Preview</span>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded"
              >
                <UilTimes size={16} />
              </button>
            </div>
            <div className="w-56 h-56 rounded-md overflow-hidden border border-neutral-800 bg-black relative">
              <img
                src={theme === 'dark' ? darkIconSrc : lightIconSrc}
                onError={(e) => {
                  e.currentTarget.src = theme === 'dark' ? darkFallbackSrc : lightFallbackSrc;
                }}
                alt="PC Control System Icon Asset"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[11px] font-mono text-neutral-400 text-center">
              Active Theme: {theme === 'dark' ? 'Dark Obsidian' : 'Clean Studio'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
