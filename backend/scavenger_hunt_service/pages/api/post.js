import { aws_upload } from './aws';

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
    
    let group_data = JSON.parse(await fs.readFile("./public/data/groups.json"));
    let group = group_data.find(group => group.group_name === group_name);
    if(group == undefined)
        return res.status(300).json({ text: 'A group with that name does not exist' });

    let objective = group.posts.find(objective => objective.objective_id === objective_id);
    if(objective != undefined) {
        group_data.at(group_data.indexOf(group)).posts.splice(group.posts.indexOf(objective), 1);
    }

    return new Promise((resolve, reject) => {
        aws_upload({
            filename: `${group.group_name}_${objective_id}.png`,
            file: image_data
        }).then(async (result) => {
    
            let date = new Date(Number(timestamp));
            group_data.at(group_data.indexOf(group)).posts.push({
                objective_id: objective_id,
                date: date.toLocaleString("en-US", {timeZone: "America/New_York"}),
                image_path: result.url
            });
            await fs.writeFile("./public/data/groups.json", JSON.stringify(group_data, null, 3));
            await fs.writeFile(`./public/data/${group_name}/${objective_id}.png`, image_data, 'base64');
            console.log("Updated storage!")
            res.status(200).json({ text: `Objective succesfully posted!` });
            resolve();
        }).catch(error => {
            res.json(error);
            res.status(405).end();
            resolve();
        })
    })



}

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '20mb',
      },
    },
  }