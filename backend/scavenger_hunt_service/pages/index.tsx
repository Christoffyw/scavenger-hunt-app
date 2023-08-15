import React, { useState, useEffect } from "react";

export default function Page() {
    const [group_data, setGroupData] = useState([]);

    useEffect(() => {
        const intervalID = setInterval(() =>  {
            fetch('./data/groups.json')
            .then((res) => res.json())
            .then((resJson) => {
                setGroupData(resJson);
            })
        }, 1000);
    
        return () => clearInterval(intervalID);
      }, [])

    const group_data_list = group_data.map(group =>
        <div>
            <h2>{group.group_name}</h2>
            <div>
                {group.posts.map(post => 
                    <div>
                        <p>Objective {post.objective_id}</p>
                        <p>Submited At: {post.date}</p>
                        <img src={"data:image/png;base64," + post.image_path} width="500"/>
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