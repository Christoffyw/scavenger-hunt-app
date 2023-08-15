const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(202).send('Preflight ok');
    }

    await fs.writeFile("./public/data/game.json", JSON.stringify(req.body, null, 3));
    
    return res.status(200).json({text:"Game file updated!"});
}