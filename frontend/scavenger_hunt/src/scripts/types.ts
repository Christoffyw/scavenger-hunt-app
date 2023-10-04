type Objective = {
    id: number;
    title: string;
    description: string;
    score: number;
    location?: Coordinate;
    rejected?: boolean;
    completed?: boolean;
    uploading?: boolean;
}

type Coordinate = {
    longitude: number;
    latitude: number;
}

type GameStatus = {
    text?: string;
    status: boolean;
    end_time: number;
    total_score: number;
    objectives: Objective[];
    rejected: Objective[];
}

export type { Coordinate, Objective, GameStatus };