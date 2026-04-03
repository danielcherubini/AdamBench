export declare const COLS = 20;
export declare const ROWS = 20;
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type GameState = "idle" | "running" | "paused" | "dead";
export interface Point {
    x: number;
    y: number;
}
export interface SnakeGame {
    snake: Point[];
    food: Point;
    score: number;
    best: number;
    state: GameState;
    /** Call once to start, again to pause/resume, again after death to restart */
    togglePlay: () => void;
}
export declare function useSnake(): SnakeGame;
//# sourceMappingURL=useSnake.d.ts.map