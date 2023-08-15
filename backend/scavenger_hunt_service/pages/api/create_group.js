const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    let group_name = req.body.group_name;

    if(group_name == undefined)
        return res.status(400).json({ text: 'Missing `group_name` in request body!' });

    let group_data = JSON.parse(await fs.readFile("./data/groups.json"));
    let potential_match = group_data.find(group => group.group_name === group_name);
    if(potential_match != undefined) {
        try {
            await fs.access(`./data/${group_name}/`);
        } catch(err) {
            await fs.mkdir(`./data/${group_name}/`);
        }
        return res.status(300).json({ text: 'A group with that name already exists' });
    }
    group_data.push({
        group_name: group_name,
        posts: []
    })
    await fs.writeFile("./data/groups.json", JSON.stringify(group_data, null, 3));
    await fs.mkdir(`./data/${group_name}/`);
    console.log("Updated storage!")
    res.status(200).json({ text: `Created ${group_name} successfully!`});
}