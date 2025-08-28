'use client';

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Package, CookingPot, Bike, Home } from "lucide-react";

const statuses = [
  { name: 'Order Placed', icon: <Package className="h-5 w-5" /> },
  { name: 'Preparing', icon: <CookingPot className="h-5 w-5" /> },
  { name: 'Out for Delivery', icon: <Bike className="h-5 w-5" /> },
  { name: 'Delivered', icon: <Home className="h-5 w-5" /> },
];

export default function OrderStatusTracker() {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  useEffect(() => {
    if (currentStatusIndex < statuses.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStatusIndex(prev => prev + 1);
      }, 3000); // 3 seconds between status updates
      return () => clearTimeout(timer);
    }
  }, [currentStatusIndex]);

  const progressValue = (currentStatusIndex / (statuses.length - 1)) * 100;

  return (
    <div className="w-full">
      <Progress value={progressValue} className="w-full h-2 mb-4" />
      <div className="flex justify-between">
        {statuses.map((status, index) => (
          <div
            key={status.name}
            className={`flex flex-col items-center text-center w-24 ${
              index <= currentStatusIndex ? 'text-primary font-semibold' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${
                index <= currentStatusIndex ? 'bg-primary/10 border-primary' : 'bg-secondary border-border'
              }`}
            >
              {status.icon}
            </div>
            <p className="text-xs mt-2">{status.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
