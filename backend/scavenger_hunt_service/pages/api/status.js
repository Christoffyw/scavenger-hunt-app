export default function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    res.status(200).json({ text: 'Hello' });
}