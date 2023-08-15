import React, { useEffect } from "react";
import { Group } from "../types";
import { promises as fs } from 'fs';

export default function Page() {
    let group_data: Group[] = [];
    useEffect(() => {
        async function get_group_data() {
            group_data = JSON.parse(await fs.readFile("./data/groups.json").toString());
        }
        if(group_data.length == 0)
            get_group_data();
    })

    const group_data_list = group_data.map(group =>
        <div>
            <h2>{group.group_name}</h2>
            <div>
                {group.posts.map(post => 
                    <div>
                        <p>Objective {post.objective_id}</p>
                        <p>Submited At: {post.date}</p>
                        <img src={post.image_path} />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <h1>Scavenger Hunt Control Panel</h1>
            <div>
                { group_data_list }
            </div>
        </div>
    )
}