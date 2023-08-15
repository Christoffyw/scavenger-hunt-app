import React, { useState, useEffect } from "react";

export default function Page() {
    const [group_data, setGroupData] = useState([]);

    useEffect(() => {
        fetch('./data/groups.json')
          .then((res) => res.json())
          .then((resJson) => {
            console.log(resJson);
            const data = JSON.parse(resJson);
            setGroupData(data);
        })
      }, [])

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