async function GET(route: string) {
    let response = await fetch(route, {
        method: "GET",
        headers: {"Content-type": "application/json"}
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

const API_URL = "https://scavenger-hunt.ca"

export { GET, POST, API_URL }