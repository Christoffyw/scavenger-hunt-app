const fs = require('fs').promises;
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });

    const { group_name } = req.query
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