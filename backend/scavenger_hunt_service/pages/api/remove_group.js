const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    let group_name = req.body.group_name;

    let group = group_data.find(group => group.group_name === group_name);
    if(group == undefined)
        return res.status(300).json({ text: 'A group with name: "' + group_name + '" does not exist' });

    group_data.splice(group_data.indexOf(group), 1);
    
    await fs.writeFile("./public/data/groups.json", JSON.stringify(group_data, null, 3));
   
    var group_folder_exists = true;
    try {
        await fs.access(`./public/data/${group_name}/`);
    } catch(err) {
        group_folder_exists = false;
    }
    if(group_folder_exists)
        await fs.rmdir(`./public/data/${group_name}/`);

    console.log("Updated storage!")
    res.status(200).json({ text: `Objective succesfully posted!` });
}