import React, { useState, useEffect } from "react";
import {
    useQuery,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import axios from 'axios'
import { Group, Objective, Objectives } from "../types";
import { rejects } from "assert";

const queryClient = new QueryClient()

function get_score(group: Group, objectives: any) {
    var score = 0;
    group.posts.forEach(post => {
        if(!post.rejected)
            score += objectives.data?.objectives.find(obj => obj.id == post.objective_id).score;
    })
    return score;
}

function sort(group: Group, objectives: any, remove_post: any, reject: any) {
    if(group.posts.length < 1)
        return null;

    group.posts.sort(function(a, b){
        return a.objective_id - b.objective_id;
    })
    return <div>
        <div className="posts">
            {
                group.posts.map(post => 
                    <div key={post.objective_id} className={post.rejected ? "post rejected" : "post"}>
                        <div className="center"><h3 className="objective-title">#{post.objective_id} - {objectives.data?.objectives.find(obj => obj.id == post.objective_id).title}</h3></div>
                        <div className="center"><p className="objective-description">{objectives.data?.objectives.find(obj => obj.id == post.objective_id).description}</p></div>
                        <div className="center"><p className="timestamp">Submited At: {post.date}</p></div>
                        
                        <div className="buttonGroup">
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
                            <button
                                onClick={() => {
                                    reject.mutate({
                                        group_name: group.group_name,
                                        objective_id: post.objective_id
                                    });
                                }} className={post.rejected ? "approve-button":"reject-button"}
                            >
                                {post.rejected ? "Approve" : "Reject"} 
                            </button>
                        </div>
                        
                        <div className="center"><img src={ post.image_path } width="500"/></div>
                    </div>
                )
            }
        </div>
        <style jsx>{`
                div {
                    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
                }
                a {
                    font-weight: 500;
                    color: #646cff;
                    text-decoration: inherit;
                }
                a:hover {
                    color: #535bf2;
                }

                .timestamp {
                    font-size: 15px;
                    margin-bottom: 5px;
                }

                .objective-title {
                    margin-bottom: 0px;
                }
                
                .buttonGroup {
                    display: flex;
                    justify-content: center;
                }

                .post {
                    background-color: #ffffff;
                    border-radius: 10px;
                    border-width: 2px;
                    border-style: solid;
                    width: 450px;
                    margin-left: 10px;
                    margin-right: 10px;
                }
                .posts {
                    background-color: #dae5e6;
                    border-radius: 10px;
                    border-width: 3px;
                    border-style: solid;
                    padding: 10px;
                    display: flex;
                    overflow: auto;
                    width: fit-content;
                }

                .center {
                    display: flex;
                    justify-content: center;
                }

                img {
                    width: 400px;
                    margin-bottom: 25px;
                }

                .rejected {
                    background-color: #fdc3c3;
                }

                h1 {
                    font-size: 3.2em;
                    line-height: 1.1;
                }
                h2 {
                    font-size: 2.2em;
                    line-height: 1.1;
                }
                h3 {
                    font-size: 1.2em;
                    line-height: 0.1;
                }
                p {
                    font-size: 1.2em;
                    line-height: 0.1;
                }

                .reject-button {
                    background-color: #ff8080;
                    border-color: #3a0000;
                }
                .reject-button:active {
                    background-color: #c90000;
                    border-color: #3a0000;
                    color: #ffffff;
                }
                .approve-button {
                    background-color: #b3f5b1;
                    border-color: #30632e;
                }
                .approve-button:active {
                    background-color: #61df5d;
                    border-color: #30632e;
                    color: #ffffff;
                }

                button {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    margin-left: 10px;
                    margin-right: 10px;
                    padding: 5px 10px;
                    border-style: solid;
                    border-radius: 10px;
                    text-align: center;
                    font-size: 1em;
                    font-weight: 500;
                    font-family: inherit;
                  }
                button:active {
                    background-color: #457299;
                    border-color: #457299;
                    color: #ffffff;
                }
            `}</style>
    </div>
}

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
    const objectives = useQuery({
        queryKey: ['objectives'],
        queryFn: () => {
            return new Promise<Objectives>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', './data/objectives.json');
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

    const reject = useMutation({
        mutationFn: (body: object) => {
            return axios.post('/api/reject', body)
        },
        onSuccess: data => {
            window.location.reload();
        }
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
            <div>
            {
                query.data?.map(group =>
                    <div key={group.group_name}>
                        <h2>{group.group_name}</h2>
                        <h3>Score: {get_score(group, objectives)}</h3>
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
                            {
                                sort(group, objectives, remove_post, reject)
                            }
                        </div>
                    </div>
                    
                )  
            }
        </div>
            <style jsx>{`
                div {
                    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
                }
                a {
                    font-weight: 500;
                    color: #646cff;
                    text-decoration: inherit;
                }
                a:hover {
                    color: #535bf2;
                }
                
                .buttonGroup {
                    display: flex;
                    justify-content: center;
                }

                .post {
                    background-color: #ffffff;
                    border-radius: 10px;
                    border-width: 2px;
                    border-style: solid;
                    width: 450px;
                    margin-left: 10px;
                    margin-right: 10px;
                }
                .posts {
                    background-color: #dae5e6;
                    border-radius: 10px;
                    border-width: 3px;
                    border-style: solid;
                    padding: 10px;
                    display: flex;
                    justify-content: center;
                }

                .center {
                    display: flex;
                    justify-content: center;
                }

                img {
                    width: 400px;
                    margin-bottom: 25px;
                }
                h1 {
                    font-size: 3.2em;
                    line-height: 1.1;
                }
                h2 {
                    font-size: 2.2em;
                    line-height: 1.1;
                }
                h3 {
                    font-size: 1.2em;
                    line-height: 0.1;
                }
                p {
                    font-size: 1.2em;
                    line-height: 0.1;
                }

                .reject-button {
                    background-color: #ff8080;
                    border-color: #3a0000;
                }
                .reject-button:active {
                    background-color: #c90000;
                    border-color: #3a0000;
                    color: #ffffff;
                }

                button {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    margin-left: 10px;
                    margin-right: 10px;
                    padding: 5px 10px;
                    border-style: solid;
                    border-radius: 10px;
                    text-align: center;
                    font-size: 1em;
                    font-weight: 500;
                    font-family: inherit;
                  }
                button:active {
                    background-color: #457299;
                    border-color: #457299;
                    color: #ffffff;
                }
            `}</style>
        </div>
    ) 
}

export default function Page() {
    return (
    <div>
        <QueryClientProvider client={queryClient}>
            <div>
                <h1>Scavenger Hunt Control Panel</h1>
                <div className="center">
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
                                timer_started: true,
                                start_time: Date.now(),
                                end_time: Date.now() + (3*60*60*1000)
                            })
                        }}
                    >
                        Start Timer
                    </button>
                </div>
            </div>
            <div>
                <Panel />
            </div>
            </QueryClientProvider>
            <style jsx>{`
                div {
                    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
                }
                a {
                    font-weight: 500;
                    color: #646cff;
                    text-decoration: inherit;
                }
                a:hover {
                    color: #535bf2;
                }
                
                body {
                    margin: 0;
                    place-items: center;
                    min-width: 320px;
                    min-height: 100vh;
                }
                
                h1 {
                    font-size: 3.2em;
                    line-height: 1.1;
                    text-align: center;
                }
                .center {
                    display: flex;
                    justify-content: center;
                }
                button {
                    margin-left: 10px;
                    margin-right: 10px;
                    padding: 15px 100px;
                    border-style: solid;
                    border-radius: 15px;
                    text-align: center;
                    font-size: 1em;
                    font-weight: 500;
                    font-family: inherit;
                  }
                button:active {
                    background-color: #457299;
                    border-color: #457299;
                    color: #ffffff;
                }
            `}</style>
    </div>

    )
}