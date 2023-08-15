import React, { useState, useEffect } from "react";
import {
    useQuery,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
    useMutation,
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

    const mutation = useMutation({
        mutationFn: (newTodo: object) => {
            return axios.post('/api/modify', newTodo)
        },
      })

    return (
        <div>
            {
                query.data?.map(group =>
                    <div key={group.group_name}>
                        <h2>{group.group_name}</h2>
                        <button
                            onClick={() => {
                                let group_id = query.data.indexOf(query.data.find(g => g.group_name == group.group_name));
                                query.data.splice(group_id, 1);
                                mutation.mutate(query.data);
                            }}
                        >
                            Remove Group
                        </button>
                        <div>
                            {group.posts.map(post => 
                                <div key={post.objective_id}>
                                    <button
                                        onClick={() => {
                                            let post_id = group.posts.indexOf(group.posts.find(p => p.objective_id == post.objective_id));
                                            group.posts.splice(post_id, 1);
                                            mutation.mutate(query.data);
                                        }}
                                    >
                                        Remove Post
                                    </button>
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