/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        console.log("MY CONFIG IS READ")
        return [
            {
                // matching all API routes
                source: "/pages/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "*" },
                    { key: "Access-Control-Allow-Headers", value: "*" },
                ]
            }
        ]
    }
}

module.exports = nextConfig