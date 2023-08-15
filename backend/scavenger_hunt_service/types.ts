type Post = {
    objective_id: number;
    date: string;
    image_path: string;
}

type Group = {
    group_name: string;
    posts: Post[];
};

export type { Post, Group }