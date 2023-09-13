const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }
    const game_data_request = await fs.readFile("./public/data/game.json");
    let game_data = JSON.parse(game_data_request);
    if(game_data.timer_started)
        return res.status(200).json({text:"Timer started!"});
}