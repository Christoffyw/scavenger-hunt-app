async function GET(route: string) {
    let response = await fetch(route, {
        method: "GET",
        headers: {"Content-type": "application/json"},
        cache: "no-cache"
    });
    let result = response.json();
    return result;
}
async function POST(route: string, data: object) {
    let response = await fetch(route, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json"}
    });
    let result = response.json();
    return result;
}

const prod = false;
const API_URL = prod ? "https://scavenger-hunt.ca" : "http://localhost:3000"

export { GET, POST, API_URL }