const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    let json_data = req.body;
    
    await fs.writeFile("./public/data/groups.json", JSON.stringify(json_data, null, 3));
    console.log("Updated storage!")
    res.status(200).json({ text: `Objective succesfully posted!` });
}