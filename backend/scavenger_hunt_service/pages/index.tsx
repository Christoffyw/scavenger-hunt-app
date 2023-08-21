import React, { useState, useEffect } from "react";
import {
    useQuery,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import axios from 'axios'
import { Group } from "../types";
import { rejects } from "assert";

const queryClient = new QueryClient()

function Panel() {
    
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: ['groups'],
        queryFn: () => {
            return new Promise<Group[]>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', './data/groups.json');
                xhr.onload = function(e) {
                    if (this.status == 200) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject();
                    }
                };
                xhr.send();
            })
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
            <button
                onClick={() => {
                    axios.post('/api/reset');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }}
            >
                Reset
            </button>
            <button
                onClick={() => {
                    axios.post('/api/start_timer', {
                        timer_started: true
                    })
                    window.location.reload();
                }}
            >
                Start Timer
            </button>
            <div>
                <Panel />
            </div>
        </QueryClientProvider>
    )
}