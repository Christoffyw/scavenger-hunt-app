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

export type { Coordinate, Objective };