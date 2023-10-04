const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(202).send('Preflight ok');
    }

    let data = {
        timer_started: false,
        end_time: 0
    }
    data.timer_started = req.body.timer_started;
    data.end_time = req.body.end_time;


    console.log("Start Time: " + new Date(req.body.start_time).toLocaleString("en-US", {timeZone: "America/New_York"}))
    console.log("End Time: " + new Date(req.body.end_time).toLocaleString("en-US", {timeZone: "America/New_York"}))
    
    await fs.writeFile("./public/data/game.json", JSON.stringify(data, null, 3));
    
    return res.status(200).json({text:"Game file updated!"});
}