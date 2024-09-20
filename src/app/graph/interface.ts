import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
export interface Message {
    text: string;
    once?: boolean;
    back?: boolean;
    cron?: string;
    client?: Client | null;
    assistant?: Assistant | null;
    thread?: Thread | null;
    styleProps?: string;
    sender: 'user' | 'ai' | 'system';
  }