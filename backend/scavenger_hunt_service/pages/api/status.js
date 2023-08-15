import axios from 'axios'

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(202).send('Preflight ok');
    }

    setInterval(async () => {
        const { data } = await axios.get(
            './data/game.json',
        )
        if(data.timer_started)
            return res.status(200).json({text:"Timer started!"});
    }, 500);
}