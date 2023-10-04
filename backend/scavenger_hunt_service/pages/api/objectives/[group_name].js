const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    const { group_name } = req.query;
    let group_data = JSON.parse(await fs.readFile("./public/data/groups.json"));
    let group = group_data.find(group => group.group_name === group_name);
    if(group == undefined)
        return res.status(200).json({ text: 'A group with name: "' + group_name + '" does not exist' });

    const game_data_request = await fs.readFile("./public/data/game.json");
    let game_data = JSON.parse(game_data_request);
    let objective_data = JSON.parse(await fs.readFile("./public/data/objectives.json"));
    let response = {
        status: game_data.timer_started,
        total_score: 0,
        objectives: [],
        rejected: []
    }
    let completed_objective_ids = [];
    let rejected_objective_ids = [];
    for(let post_id in group.posts) {
        let post = group.posts[post_id];
        if(post.rejected)
            rejected_objective_ids.push(post.objective_id);
        else {
            completed_objective_ids.push(post.objective_id);
            let objective = objective_data.objectives.find(objective => objective.id == post.objective_id);
            response.total_score += objective.score;
        }
    }
    response.objectives = completed_objective_ids;
    response.rejected = rejected_objective_ids;
    return res.status(200).json(response);
  }