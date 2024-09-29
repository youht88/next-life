import { useConfig } from '@/lib/config';
import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
import { useEffect, useState } from 'react';
import { GraphProps } from './interface';
export function useGraphcloud(graphId: string) {
    const {graphcloud_uri,langserve_uri} = useConfig()
    const [client, setClient] = useState<Client | null>(null);
    const [assistant, setAssistant] = useState<Assistant | null>(null);
    const [thread, setThread] = useState<Thread | null>(null);

    useEffect(() => {
        const initLanggraph = async () => {
            const thread_id = "youht-default"
            const config = {"configurable":{"thread_id":thread_id,"user_id":"youht","llm_key":"LLM.DEEPBRICKS"}}
            
            const _client = new Client({ apiUrl: graphcloud_uri });
            setClient(_client);
            const _assistants = await _client.assistants.search();
            const __assistant = _assistants.find((a: Assistant) => a.graph_id === graphId);
            const _assistant = await _client.assistants.update(__assistant!.assistant_id,{config})
            console.log('_assistant',_assistant)
            setAssistant(_assistant || null);
            //const _thread = await _client.threads.create();
            const _thread = await _client.threads.get(thread_id);
            setThread(_thread);
        };
        initLanggraph();
    }, [graphId]);

    return {client, assistant, thread } as GraphProps;
}