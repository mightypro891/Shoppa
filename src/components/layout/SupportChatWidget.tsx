
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, Send, X, Loader2, Sparkles } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { askSupportAgentAction } from '@/app/actions';
import { ScrollArea } from '../ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const userMessage: ChatMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
    setMessage('');

    try {
        const response = await askSupportAgentAction({ 
            question: message,
            userEmail: user?.email || undefined
        });
        const aiMessage: ChatMessage = { sender: 'ai', text: response.answer };
        setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Could not connect to the support agent. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
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
        <div className="flex flex-col h-[50vh]">
            <div className="bg-primary text-primary-foreground p-4 rounded-t-md">
                <h3 className="font-semibold text-lg">AI Support Assistant</h3>
                <p className="text-sm text-primary-foreground/90">How can I help you today?</p>
            </div>
            <ScrollArea className="flex-1 p-4 bg-secondary/30">
                <div className="space-y-4">
                    {chatHistory.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            Ask me anything about products, delivery, or your orders!
                        </div>
                    )}
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${chat.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                {chat.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                             <div className="rounded-lg px-3 py-2 bg-muted text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                    <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={loading}
                    />
                    <Button type="submit" size="icon" disabled={loading || !message.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
