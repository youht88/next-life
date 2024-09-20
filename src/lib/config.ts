import { useEffect, useState } from 'react';

const _langgraph_cloud_uri = "http://192.168.23.57:8123"; // 从环境变量中获取

export function useConfig() {
    const [langgraph_cloud_uri, setLanggraphCloudUri] = useState<string>(_langgraph_cloud_uri);
    const [theme,setTheme] = useState<string>("light")
    useEffect(() => {
        const initConfig = async () => {
        };
        initConfig();
    },[]);

    return { langgraph_cloud_uri,theme };
}