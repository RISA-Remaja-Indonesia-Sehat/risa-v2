'use client';

import { useEffect } from 'react';

export default function TooltipHandler() {
  useEffect(() => {
    window.toggleTooltip = function() {
      const tooltip = document.getElementById('tooltip');
      tooltip?.classList.toggle('hidden');
    };
    
    window.toggleHivTooltip = function() {
      const hivTooltip = document.getElementById('hiv-tooltip');
      hivTooltip?.classList.toggle('hidden');
    };
    
    const handleClick = (event) => {
      const tooltip = document.getElementById('tooltip');
      const hivTooltip = document.getElementById('hiv-tooltip');
      const target = event.target;
      
      if (!target.textContent.includes('*') && !tooltip?.contains(target)) {
        tooltip?.classList.add('hidden');
      }
      
      if (!target.textContent.includes('#') && !hivTooltip?.contains(target)) {
        hivTooltip?.classList.add('hidden');
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
      delete window.toggleTooltip;
      delete window.toggleHivTooltip;
    };
  }, []);

  return null;
}