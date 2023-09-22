type Objective = {
    id: number;
    title: string;
    description: string;
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
    objectives: Objective[];
    rejected: Objective[];
}

export type { Coordinate, Objective, GameStatus };