import { NextResponse } from "next/server";

export function middleware() {
    // retrieve the current response
    const res = NextResponse.next()

    // add the CORS headers to the response
    res.headers.append('Access-Control-Allow-Origin', 'http://localhost:5173, http://127.0.0.1:5173') // replace this your actual origin
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    res.headers.append('Access-Control-Allow-Headers', '*')

    return res
}

// specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/:path*',
}