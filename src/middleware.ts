// middleware.js

import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    console.log("MIDDLEWARE!!!!")
    // 设置 CORS 头
    request.headers.set('Access-Control-Allow-Origin', '*'); // 允许所有来源
    request.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 允许的方法
    request.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    const response = NextResponse.next();

    // 设置 CORS 头
    response.headers.set('Access-Control-Allow-Origin', '*'); // 允许所有来源
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 允许的方法
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (request.method === 'OPTIONS') {
        return response;
    }

    return response;
}

// 可选：匹配所有请求
export const config = {
    matcher: ['/graph/:path*'], // 根据需要调整匹配器
};