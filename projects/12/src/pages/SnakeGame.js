"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GRID_SIZE = 10;
const CELL_EMPTY = '⬛';
const CELL_SNAKE = '🟩';
const CELL_FOOD = '🟥';
const randomFood = (snake) => {
    const empty = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (!snake.some(p => p.x === x && p.y === y))
                empty.push({ x, y });
        }
    }
    return empty[Math.floor(Math.random() * empty.length)];
};
const SnakeGame = () => {
    const [snake, setSnake] = (0, react_1.useState)([{ x: 5, y: 5 }]);
    const [dir, setDir] = (0, react_1.useState)({ x: 1, y: 0 });
    const [food, setFood] = (0, react_1.useState)(randomFood(snake));
    const [gameOver, setGameOver] = (0, react_1.useState)(false);
    const [score, setScore] = (0, react_1.useState)(0);
    const timerRef = (0, react_1.useRef)();
    const move = () => {
        if (gameOver)
            return;
        const newHead = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        // wrap around
        newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
        newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;
        if (snake.some(p => p.x === newHead.x && p.y === newHead.y)) {
            setGameOver(true);
            return;
        }
        const newSnake = [newHead, ...snake];
        if (newHead.x === food.x && newHead.y === food.y) {
            setScore(score + 1);
            setFood(randomFood(newSnake));
        }
        else {
            newSnake.pop();
        }
        setSnake(newSnake);
    };
    (0, react_1.useEffect)(() => {
        timerRef.current = window.setInterval(move, 200);
        const handler = (e) => {
            if (e.key === 'ArrowUp')
                setDir({ x: 0, y: -1 });
            if (e.key === 'ArrowDown')
                setDir({ x: 0, y: 1 });
            if (e.key === 'ArrowLeft')
                setDir({ x: -1, y: 0 });
            if (e.key === 'ArrowRight')
                setDir({ x: 1, y: 0 });
        };
        window.addEventListener('keydown', handler);
        return () => { window.clearInterval(timerRef.current); window.removeEventListener('keydown', handler); };
    }, [snake, dir, food, gameOver]);
    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            const row = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                let cell = CELL_EMPTY;
                if (snake.some(p => p.x === x && p.y === y))
                    cell = CELL_SNAKE;
                else if (food.x === x && food.y === y)
                    cell = CELL_FOOD;
                row.push((0, jsx_runtime_1.jsx)("span", { children: cell }, x));
            }
            grid.push((0, jsx_runtime_1.jsx)("div", { style: { fontSize: '2rem' }, children: row }, y));
        }
        return grid;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 400, margin: 'auto', padding: 20, textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Snake Game" }), (0, jsx_runtime_1.jsx)("p", { children: "Use arrow keys to move. Eat the red squares to grow." }), (0, jsx_runtime_1.jsxs)("p", { children: ["Score: ", score] }), gameOver ? (0, jsx_runtime_1.jsx)("p", { children: "Game Over! Press Refresh to play again." }) : renderGrid()] }));
};
exports.default = SnakeGame;
//# sourceMappingURL=SnakeGame.js.map