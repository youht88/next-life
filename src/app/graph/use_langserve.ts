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
            const thread_id = "youht-default"
            const config = {"configurable":{"thread_id":thread_id,"user_id":"youht","llm_key":"LLM.DEEPBRICKS"}}
            
            const __serveClient = new RemoteRunnable({url:langserve_uri+`/${graphId}`})
            const _serveClient = __serveClient.withConfig(config) as RemoteRunnable<unknown, unknown, RunnableConfig>

            // const eventStream = await _serveClient.streamEvents(
            //     { messages: [new HumanMessage("hello")] }, 
            //     {version: "v2"}
            //   );
            // for await (const event of eventStream) {
            //     console.log(event)
            //     if (event.event === "on_custom_event") {
            //         console.log(event);
            //     }
            // }  
            setClient(_serveClient)
        };
        initLanggraph();
    }, [graphId]);

    return { client } as GraphProps;
}