import { useConfig } from '@/lib/config';
import { Assistant, Client, Thread } from '@langchain/langgraph-sdk';
import { useEffect, useState } from 'react';

export function useLanggraph(graphId: string) {
    const {langgraph_cloud_uri} = useConfig()
    const [client, setClient] = useState<Client | null>(null);
    const [assistant, setAssistant] = useState<Assistant | null>(null);
    const [thread, setThread] = useState<Thread | null>(null);

    useEffect(() => {
        const initLanggraph = async () => {
            const _client = new Client({ apiUrl: langgraph_cloud_uri });
            setClient(_client);
            const _assistants = await _client.assistants.search();
            const _assistant = _assistants.find((a: Assistant) => a.graph_id === graphId);
            setAssistant(_assistant || null);
            const _thread = await _client.threads.create();
            setThread(_thread);
        };
        initLanggraph();
    }, [graphId]);

    return { client, assistant, thread };
}