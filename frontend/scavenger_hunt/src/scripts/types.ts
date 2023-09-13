type Objective = {
    id: number;
    title: string;
    description: string;
    location?: Coordinate;
    completed?: boolean;
}

type Coordinate = {
    longitude: number;
    latitude: number;
}

type GameStatus = {
    text?: string;
    status: boolean;
    objectives: Objective[];
}

export type { Coordinate, Objective, GameStatus };