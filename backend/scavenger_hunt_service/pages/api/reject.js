const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    let group_name = req.body.group_name;
    let objective_id = req.body.objective_id;

    let group_data = JSON.parse(await fs.readFile("./public/data/groups.json"));
    let group = group_data.find(group => group.group_name === group_name);
    if(group == undefined)
        return res.status(300).json({ text: 'A group with name: "' + group_name + '" does not exist' });
    
    let post = group.posts.find(post => post.objective_id === objective_id);
    if(post == undefined)
        return res.status(300).json({ text: 'A post with objective_id: "' + objective_id + '" does not exist' });

    let rejected = group_data[group_data.indexOf(group)].posts[group.posts.indexOf(post)].rejected;
    rejected = (rejected == undefined) ? true : !rejected;
    console.log(rejected);
    group_data[group_data.indexOf(group)].posts[group.posts.indexOf(post)].rejected = rejected;

    await fs.writeFile("./public/data/groups.json", JSON.stringify(group_data, null, 3));
    console.log("Updated storage!")
    res.status(200).json({ text: `Toggled Rejected!` });
}