import React, { useEffect } from "react";
import group_data  from '../data/groups.json'

export default function Page() {

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