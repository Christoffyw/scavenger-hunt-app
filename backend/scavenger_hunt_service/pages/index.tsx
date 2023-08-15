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

    const remove_post = useMutation({
        mutationFn: (body: object) => {
            return axios.post('/api/remove_post', body)
        },
        onSuccess: data => {
            window.location.reload();
        }
    })
    const remove_group = useMutation({
        mutationFn: (body: object) => {
            return axios.post('/api/remove_group', body)
        },
        onSuccess: data => {
            window.location.reload();
        }
    })

    return (
        <div>
            {
                query.data?.map(group =>
                    <div key={group.group_name}>
                        <h2>{group.group_name}</h2>
                        <button
                            onClick={() => {
                                remove_group.mutate({
                                    group_name: group.group_name
                                });
                            }}
                        >
                            Remove Group
                        </button>
                        <div>
                            {group.posts.map(post => 
                                <div key={post.objective_id}>
                                    <button
                                        onClick={() => {
                                            remove_post.mutate({
                                                group_name: group.group_name,
                                                objective_id: post.objective_id
                                            });
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