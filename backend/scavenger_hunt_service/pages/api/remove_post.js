const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    let group_name = req.body.group_name;
    let objective_id = req.body.objective_id;

    let group = group_data.find(group => group.group_name === group_name);
    if(group == undefined)
        return res.status(300).json({ text: 'A group with name: "' + group_name + '" does not exist' });
    
    let post = group.posts.find(post => post.objective_id === objective_id);
    if(post == undefined)
        return res.status(300).json({ text: 'A post with objective_id: "' + objective_id + '" does not exist' });

    group.posts.splice(group.posts.indexOf(post), 1);
    
    var image_file_exists = true;
    try {
        await fs.access(`./public/data/${group_name}/${objective_id}.png`);
    } catch(err) {
        image_file_exists = false;
    }
    if(image_file_exists)
        await fs.rm(`./public/data/${group_name}/${objective_id}.png`);
    

    await fs.writeFile("./public/data/groups.json", JSON.stringify(group_data, null, 3));
    console.log("Updated storage!")
    res.status(200).json({ text: `Post removed!` });
}