
import { cn } from '@/lib/utils';
import React from 'react';

const StoreLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 40"
      className={cn("text-primary", className)}
      {...props}
    >
      <g fill="currentColor" transform="translate(-3)">
        {/* Cart Icon */}
        <path d="M40.8,12.5H19.2c-1.2,0-2.3,0.8-2.6,2l-4.1,14.3c-0.3,1.1,0.5,2.2,1.6,2.2h20.4c1.1,0,2-0.9,2-2v-14C46.3,13.8,45.2,12.5,43.8,12.5z M20.8,28.5V15.5h22.4v13H20.8z"/>
        <circle cx="24.8" cy="35" r="2.5"/>
        <circle cx="38.8" cy="35" r="2.5"/>
        <path d="M19.2,12.5L14,4.8c-0.3-0.5-0.9-0.8-1.5-0.8h-4c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5h3.4l4.3,6.5H19.2z"/>
        
        {/* S-shape in cart */}
        <path d="M33.8,18.5h-9c-0.6,0-1,0.4-1,1v1c0,0.6,0.4,1,1,1h7v2h-7c-0.6,0-1,0.4-1,1v1c0,0.6,0.4,1,1,1h9c0.6,0,1-0.4,1-1v-1c0-0.6-0.4-1-1-1h-7v-2h7c0.6,0,1-0.4,1-1v-1C34.8,18.9,34.3,18.5,33.8,18.5z"/>
      </g>
    </svg>
  );
};

export default StoreLogo;
