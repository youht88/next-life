import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
export interface Message {
    text: string;
    once?: boolean;
    back?: boolean;
    cron?: string;
    graphClient?: GraphProps;
    styleProps?: string;
    sender: 'user' | 'ai' | 'system';
  }

export type GraphProps = {
    client: Client | any | null;
    assistant: Assistant | null;
    thread: Thread | null;
} 