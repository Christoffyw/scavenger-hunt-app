async function GET(route: string, data?: object) {
    let response = await fetch(route, {
        method: "GET",
        body: data != undefined ? JSON.stringify(data) : undefined,
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

export { GET, POST }