import { useConfig } from '@/lib/config';
import { RunnableConfig } from '@langchain/core/runnables';
import { RemoteRunnable } from '@langchain/core/runnables/remote';
import { useEffect, useState } from 'react';
import { GraphProps } from './interface';

export function useLangserve(graphId: string) {
    const {graphcloud_uri,langserve_uri} = useConfig()
    const [client, setClient] = useState<RemoteRunnable<unknown, unknown, RunnableConfig> | null>(null);
    
    useEffect(() => {
        const initLanggraph = async () => {
            const thread_id = "youht-langserve"
            const config = {"configurable":{"thread_id":thread_id,"user_id":"jinli","llm_key":"LLM.DEEPBRICKS"}}
            
            const __serveClient = new RemoteRunnable({url:langserve_uri+`/${graphId}`})
            const _serveClient = __serveClient.withConfig(config) as RemoteRunnable<unknown, unknown, RunnableConfig>
            setClient(_serveClient)
        };
        initLanggraph();
    }, [graphId]);

    return { client } as GraphProps;
}