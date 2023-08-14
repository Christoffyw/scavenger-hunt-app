/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        console.log("MY CONFIG IS READ")
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "*" },
                    { key: "Access-Control-Allow-Headers", value: "*" },
                ]
            }
        ]
    }, 
    async rewrites() {
        return [
            {        
                source: "/api/:path*",
                destination: "https://positive-tahr-usually.ngrok-free.app/api/:path*",
            }
        ]
    }
}

module.exports = nextConfig