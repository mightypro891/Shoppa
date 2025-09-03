
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { PartyPopper } from 'lucide-react';

const POPUP_SEEN_KEY = 'celebration_popup_seen';

export default function CelebrationPopup() {
    const { celebrationPopupConfig } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (celebrationPopupConfig?.isActive) {
            const hasSeen = sessionStorage.getItem(POPUP_SEEN_KEY);
            if (!hasSeen) {
                setIsOpen(true);
            }
        }
    }, [celebrationPopupConfig]);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem(POPUP_SEEN_KEY, 'true');
    };

    if (!celebrationPopupConfig || !celebrationPopupConfig.isActive || !isOpen) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <PartyPopper className="h-16 w-16 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold">{celebrationPopupConfig.title}</DialogTitle>
                    <DialogDescription className="text-center text-lg pt-2">
                        {celebrationPopupConfig.message}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center pt-4">
                    <Button onClick={handleClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
