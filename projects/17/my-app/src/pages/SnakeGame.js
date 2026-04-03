"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const SnakeGame = () => {
    const canvasRef = (0, react_1.useRef)(null);
    const GRID = 20;
    const CELL_SIZE = 20;
    const [snake, setSnake] = (0, react_1.useState)([]);
    const [food, setFood] = (0, react_1.useState)({ x: 0, y: 0 });
    const [score, setScore] = (0, react_1.useState)(0);
    const [gameOver, setGameOver] = (0, react_1.useState)(false);
    const directionRef = (0, react_1.useRef)({ x: 1, y: 0 });
    const generateFood = (snakeBody) => {
        while (true) {
            const candidate = {
                x: Math.floor(Math.random() * GRID),
                y: Math.floor(Math.random() * GRID),
            };
            if (!snakeBody.some((seg) => seg.x === candidate.x && seg.y === candidate.y)) {
                return candidate;
            }
        }
    };
    // Initialize game
    (0, react_1.useEffect)(() => {
        const start = { x: 5, y: 5 };
        setSnake([start]);
        setFood(generateFood([start]));
        setScore(0);
        setGameOver(false);
        directionRef.current = { x: 1, y: 0 };
    }, []); // run once
    // Main game loop
    (0, react_1.useEffect)(() => {
        if (gameOver)
            return;
        const interval = setInterval(() => {
            setSnake((prev) => {
                // Use current head (first segment) to compute next position
                const head = prev[0];
                const newHead = {
                    x: head.x + directionRef.current.x,
                    y: head.y + directionRef.current.y,
                };
                // Wall collision
                if (newHead.x < 0 ||
                    newHead.x >= GRID ||
                    newHead.y < 0 ||
                    newHead.y >= GRID) {
                    setGameOver(true);
                    return prev;
                }
                // Self collision (ignore the tail because it will move)
                const collisionCheck = prev.slice(0, -1); // all segments except the last one that will be removed if not eating
                if (collisionCheck.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
                    setGameOver(true);
                    return prev;
                }
                let newSnake = [newHead, ...prev];
                // Eat food
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore((s) => s + 1);
                    // Generate new food that is not in the new snake (including the new head)
                    setFood(generateFood(newSnake));
                    // Do not remove tail when eating, so snake grows
                }
                else {
                    // Remove tail segment when not eating
                    newSnake = [newHead, ...prev.slice(0, -1)];
                }
                return newSnake;
            });
        }, 150);
        return () => clearInterval(interval);
    }, [gameOver, food]); // food dependency keeps interval in sync when food changes
    // Keyboard handling
    (0, react_1.useEffect)(() => {
        const onKeyDown = (e) => {
            if (gameOver) {
                if (e.key.startsWith('Arrow')) {
                    const start = { x: 5, y: 5 };
                    setSnake([start]);
                    setFood(generateFood([start]));
                    setScore(0);
                    setGameOver(false);
                    directionRef.current = { x: 1, y: 0 };
                }
                return;
            }
            const dir = directionRef.current;
            const key = e.key;
            if (key === 'ArrowUp' && dir.y !== 1) {
                directionRef.current = { x: 0, y: -1 };
            }
            else if (key === 'ArrowDown' && dir.y !== -1) {
                directionRef.current = { x: 0, y: 1 };
            }
            else if (key === 'ArrowLeft' && dir.x !== 1) {
                directionRef.current = { x: -1, y: 0 };
            }
            else if (key === 'ArrowRight' && dir.x !== -1) {
                directionRef.current = { x: 1, y: 0 };
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [gameOver]);
    // Render to canvas
    (0, react_1.useEffect)(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx)
            return;
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, GRID * CELL_SIZE, GRID * CELL_SIZE);
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = 'lime';
        snake.forEach((seg) => {
            ctx.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });
    }, [snake, food]); // eslint-disable-next-line react-hooks/exhaustive-deps
    return ((0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', fontFamily: 'sans-serif', marginTop: '2rem' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Snake Game (public)" }), (0, jsx_runtime_1.jsx)("p", { children: "Use Arrow keys to move. Eat the red dot and avoid hitting the walls or your own tail. Score is the length of the snake minus 1." }), (0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, width: GRID * CELL_SIZE, height: GRID * CELL_SIZE, style: { border: '1px solid #333', margin: '0 auto' } }), (0, jsx_runtime_1.jsxs)("p", { children: ["Score: ", score] }), gameOver && ((0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: "Game Over! Press any Arrow key to restart." }))] }));
};
exports.default = SnakeGame;
//# sourceMappingURL=SnakeGame.js.map