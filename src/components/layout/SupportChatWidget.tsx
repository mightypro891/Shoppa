
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, Send, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // In a real app, you would send this message to a support backend.
    // For this prototype, we'll just log it and show a confirmation.
    console.log('Support message submitted:', message);

    toast({
      title: 'Message Sent!',
      description: 'Our support team will get back to you shortly.',
    });

    setMessage('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          <span className="sr-only">Contact Support</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-80 p-0" sideOffset={12}>
        <div className="flex flex-col">
            <div className="bg-primary text-primary-foreground p-4 rounded-t-md">
                <h3 className="font-semibold text-lg">Contact Support</h3>
                <p className="text-sm text-primary-foreground/90">We're here to help!</p>
            </div>
            <div className="p-4 space-y-4">
                <Input placeholder="Your Email (Optional)" type="email" />
                <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                />
                <Button onClick={handleSendMessage} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                </Button>
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
