const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(202).send('Preflight ok');
    }

    const watcher = fs.watch("./public/data/game.json");
    var file_updated = false;
    for await (const {eventType, filename} of watcher) {
        if(file_updated) {
            let game_data = JSON.parse(await fs.readFile("./public/data/game.json"));
            if(game_data.timer_started)
                res.status(200).json({text:"Timer started!"});
            else
                res.status(502).send("Timer not stated");
        }
        file_updated = true;
    }
}