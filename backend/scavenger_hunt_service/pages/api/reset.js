const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('Preflight ok');
    }

    let group_data = JSON.parse(await fs.readFile("./public/data/groups.json"));
    group_data.forEach(async (group) => {
        var group_folder_exists = true;
        try {
            await fs.access(`./public/data/${group.group_name}/`);
        } catch(err) {
            group_folder_exists = false;
        }
        if(group_folder_exists)
            await fs.rm(`./public/data/${group.group_name}/`, { recursive: true, force: true });
    })

    await fs.writeFile("./public/data/groups.json", JSON.stringify([], null, 3));
    await fs.writeFile("./public/data/game.json", JSON.stringify({
        timer_started: false
    }, null, 3));

    return res.status(200).send("Reset complete");
}