type Post = {
    objective_id: number;
    date: string;
    image_path: string;
    rejected: boolean;
}

type Group = {
    group_name: string;
    posts: Post[];
};

type Objective = {
    id: number;
    title: string;
    description: string;
    score: number;
}

type Objectives = {
    objectives: Objective[];
}

export type { Post, Group, Objectives, Objective }