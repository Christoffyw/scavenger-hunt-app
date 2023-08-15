const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(202).send('Preflight ok');
    }

    setInterval(async () => {
        const game_data_request = await fetch("/data/game.json");
        let game_data = await game_data_request.json();
        if(game_data.timer_started)
            return res.status(200).json({text:"Timer started!"});
    }, 500);
}