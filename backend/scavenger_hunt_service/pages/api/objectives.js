const fs = require('fs').promises;

export default async function handler(req, res) {

    let data = JSON.parse(await fs.readFile("./public/data/objectives.json"));

    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }
    return res.status(200).json(data);
}