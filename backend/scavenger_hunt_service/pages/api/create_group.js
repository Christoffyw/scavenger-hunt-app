const fs = require('fs').promises;
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });

    let group_name = req.body.group_name;

    if(group_name == undefined)
        return res.status(400).json({ text: 'Missing `group_name` in request body!' });

    let group_data = JSON.parse(await fs.readFile("./data/groups.json"));
    let potential_match = group_data.find(group => group.group_name === group_name);
    if(potential_match != undefined)
        return res.status(300).json({ text: 'A group with that name already exists' });
    group_data.push({
        group_name: group_name,
        posts: []
    })
    await fs.writeFile("./data/groups.json", JSON.stringify(group_data, null, 3));
    await fs.mkdir(`./data/${group_name}/`);
    console.log("Updated storage!")
    res.status(200).json({ text: `Created ${group_name} successfully!`});
}