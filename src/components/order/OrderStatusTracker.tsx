
'use client';

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Package, CookingPot, Bike, Home, CheckCircle } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

const deliveryStatusConfig: { name: OrderStatus, icon: JSX.Element }[] = [
  { name: 'Order Placed', icon: <Package className="h-5 w-5" /> },
  { name: 'Preparing', icon: <CookingPot className="h-5 w-5" /> },
  { name: 'Out for Delivery', icon: <Bike className="h-5 w-5" /> },
  { name: 'Delivered', icon: <Home className="h-5 w-5" /> },
];

const pickupStatusConfig: { name: OrderStatus, icon: JSX.Element }[] = [
  { name: 'Order Placed', icon: <Package className="h-5 w-5" /> },
  { name: 'Ready for Pickup', icon: <CheckCircle className="h-5 w-5" /> },
];


const statusIndexes: Record<OrderStatus, number> = {
  'Order Placed': 0,
  'Preparing': 1,
  'Out for Delivery': 2,
  'Ready for Pickup': 1,
  'Delivered': 3,
};


interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
}

export default function OrderStatusTracker({ currentStatus }: OrderStatusTrackerProps) {
  
  const isPickup = currentStatus === 'Ready for Pickup';
  const statusConfig = isPickup ? pickupStatusConfig : deliveryStatusConfig;

  const currentStatusIndex = statusIndexes[currentStatus];
  const progressValue = (currentStatusIndex / (statusConfig.length - 1)) * 100;

  return (
    <div className="w-full">
      <Progress value={progressValue} className="w-full h-2 mb-4" />
      <div className="flex justify-between">
        {statusConfig.map((status, index) => (
          <div
            key={status.name}
            className={`flex flex-col items-center text-center w-24 transition-colors duration-300 ${
              index <= currentStatusIndex ? 'text-primary font-semibold' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-colors duration-300 ${
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
