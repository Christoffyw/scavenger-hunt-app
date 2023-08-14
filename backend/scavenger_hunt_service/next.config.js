/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "*" },
                ]
            }
        ]
    }
}

module.exports = nextConfig