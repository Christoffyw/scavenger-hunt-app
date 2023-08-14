const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    let group_name = req.body.group_name;
    let objective_id = req.body.objective_id;
    let timestamp = req.body.timestamp;
    let image_data = req.body.image_data;
    if(group_name == undefined)
        res.status(400).json({ text: 'Missing `group_name` in request body!' });
    if(objective_id == undefined)
        res.status(400).json({ text: 'Missing `objective_id` in request body!' });
    if(timestamp == undefined)
        res.status(400).json({ text: 'Missing `timestamp` in request body!' });
    if(image_data == undefined)
        res.status(400).json({ text: 'Missing `image_data` in request body!' });
    
    let group_data = JSON.parse(await fs.readFile("./data/groups.json"));
    let group = group_data.find(group => group.group_name === group_name);
    if(group == undefined)
        return res.status(300).json({ text: 'A group with that name does not exist' });

    let date = new Date(Number(timestamp));
    group_data.at(group_data.indexOf(group)).posts.push({
        objective_id: objective_id,
        date: date.toLocaleString(),
        image_path: `./data/${group_name}/${objective_id}.png`,
    });
    await fs.writeFile("./data/groups.json", JSON.stringify(group_data, null, 3));
    await fs.writeFile(`./data/${group_name}/${objective_id}.png`, image_data, 'base64');
    console.log("Updated storage!")
    res.status(200).json({ text: `Objective succesfully posted!` });
}