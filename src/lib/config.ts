import { useEffect, useState } from 'react';

const _graphcloud_uri = "http://192.168.23.57:8123"; // 从环境变量中获取
const _langserve_uri = "http://localhost:8000"; // 从环境变量中获取


export function useConfig() {
    const [graphcloud_uri, setGraphCloudUri] = useState<string>(_graphcloud_uri);
    const [langserve_uri, setLangServeUri] = useState<string>(_langserve_uri);
    const [theme,setTheme] = useState<string>("light")
    useEffect(() => {
        const initConfig = async () => {
        };
        initConfig();
    },[]);

    return { graphcloud_uri,langserve_uri,theme };
}