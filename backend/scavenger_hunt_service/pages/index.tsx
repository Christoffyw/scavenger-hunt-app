import React, { useState, useEffect } from "react";
import {
    useQuery,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import axios from 'axios'

const queryClient = new QueryClient()

function Panel() {
    
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
          const { data } = await axios.get(
            './data/groups.json',
          )
          return data
        },
    })

    return (
        <div>
            {
                query.data?.map(group =>
                    <div key={group.group_name}>
                        <h2>{group.group_name}</h2>
                        <div>
                            {group.posts.map(post => 
                                <div key={post.objective_id}>
                                    <p>Objective {post.objective_id}</p>
                                    <p>Submited At: {post.date}</p>
                                    <img src={"data:image/png;base64," + post.image_path} width="500"/>
                                </div>
                            )}
                        </div>
                    </div>
                )  
            }
        </div>
    ) 
}

export default function Page() {

    return (
        <QueryClientProvider client={queryClient}>
            <h1>Scavenger Hunt Control Panel</h1>
            <div>
                <Panel />
            </div>
        </QueryClientProvider>
    )
}