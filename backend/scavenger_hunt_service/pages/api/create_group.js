const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    let group_name = req.body.group_name;

    if(group_name == undefined)
        return res.status(400).json({ text: 'Missing `group_name` in request body!' });

    let group_data = JSON.parse(await fs.readFile("./public/data/groups.json"));
    let potential_match = group_data.find(group => group.group_name === group_name);
    console.log("plz");
    if(potential_match != undefined) {
        try {
            await fs.access(`./public/data/${group_name}/`);
        } catch(err) {
            await fs.mkdir(`./public/data/${group_name}/`);
        }
        return res.status(300).json({ text: 'A group with that name already exists' });
    } else {
        try {
            await fs.access(`./public/data/${group_name}/`);
        } catch(err) {
            await fs.mkdir(`./public/data/${group_name}/`);
        }
    }
    group_data.push({
        group_name: group_name,
        posts: []
    })
    await fs.writeFile("./public/data/groups.json", JSON.stringify(group_data, null, 3));
    console.log("Updated storage!")
    res.status(200).json({ text: `Created ${group_name} successfully!`});
}