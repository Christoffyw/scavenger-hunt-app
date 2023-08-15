const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    const { group_name } = req.query
    console.log(group_name);
    let group_data = JSON.parse(await fs.readFile("./data/groups.json"));
    let group = group_data.find(group => group.group_name === group_name);
    if(group == undefined)
        return res.status(300).json({ text: 'A group with that name does not exist' });

    let completed_objective_ids = [];
    for(let post_id in group.posts) {
        let post = group.posts[post_id];
        completed_objective_ids.push(post.objective_id);
    }
    return res.status(200).json(completed_objective_ids);
  }