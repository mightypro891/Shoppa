import { config } from 'dotenv';
config();

import '@/ai/flows/recipe-suggestions.ts';
import '@/ai/flows/send-order-confirmation.ts';
import '@/ai/flows/support-chat-flow.ts';
