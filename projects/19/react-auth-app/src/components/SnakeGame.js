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
require("../styles/SnakeGame.css");
// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 50;
const SnakeGame = () => {
    // Game state
    const [snake, setSnake] = (0, react_1.useState)([{ x: 10, y: 10 }]);
    const [food, setFood] = (0, react_1.useState)({ x: 15, y: 15 });
    const [direction, setDirection] = (0, react_1.useState)('RIGHT');
    const [nextDirection, setNextDirection] = (0, react_1.useState)('RIGHT');
    const [gameStatus, setGameStatus] = (0, react_1.useState)('IDLE');
    const [score, setScore] = (0, react_1.useState)(0);
    const [speed, setSpeed] = (0, react_1.useState)(INITIAL_SPEED);
    const gameLoopRef = (0, react_1.useRef)(null);
    const lastRenderTimeRef = (0, react_1.useRef)(0);
    const foodRef = (0, react_1.useRef)(food);
    // Generate random food position
    const generateFood = (0, react_1.useCallback)(() => {
        const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        // Make sure food doesn't appear on snake
        const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        if (isOnSnake) {
            return generateFood();
        }
        return newFood;
    }, [snake]);
    // Initialize game
    const initGame = (0, react_1.useCallback)(() => {
        setSnake([{ x: 10, y: 10 }]);
        const newFood = generateFood();
        setFood(newFood);
        foodRef.current = newFood;
        setDirection('RIGHT');
        setNextDirection('RIGHT');
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setGameStatus('PLAYING');
    }, [generateFood]);
    // Handle keyboard input
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (gameStatus === 'GAME_OVER' && e.key === ' ') {
                initGame();
                return;
            }
            if (gameStatus !== 'PLAYING')
                return;
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN')
                        setNextDirection('UP');
                    break;
                case 'ArrowDown':
                    if (direction !== 'UP')
                        setNextDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    if (direction !== 'RIGHT')
                        setNextDirection('LEFT');
                    break;
                case 'ArrowRight':
                    if (direction !== 'LEFT')
                        setNextDirection('RIGHT');
                    break;
                case ' ':
                    setGameStatus(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, gameStatus, initGame]);
    // Game loop with explicit dependencies
    (0, react_1.useEffect)(() => {
        if (gameStatus !== 'PLAYING')
            return;
        const gameLoop = (timestamp) => {
            if (timestamp - lastRenderTimeRef.current < speed) {
                gameLoopRef.current = requestAnimationFrame(gameLoop);
                return;
            }
            lastRenderTimeRef.current = timestamp;
            setDirection(nextDirection);
            // Create a new snake state without using food state directly in the effect
            const newSnake = [...snake];
            const head = { ...newSnake[0] };
            // Move head based on direction
            switch (nextDirection) {
                case 'UP':
                    head.y -= 1;
                    break;
                case 'DOWN':
                    head.y += 1;
                    break;
                case 'LEFT':
                    head.x -= 1;
                    break;
                case 'RIGHT':
                    head.x += 1;
                    break;
            }
            // Check wall collision
            if (head.x < 0 ||
                head.x >= GRID_SIZE ||
                head.y < 0 ||
                head.y >= GRID_SIZE) {
                setGameStatus('GAME_OVER');
                gameLoopRef.current = requestAnimationFrame(gameLoop);
                return;
            }
            // Check self collision
            if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                setGameStatus('GAME_OVER');
                gameLoopRef.current = requestAnimationFrame(gameLoop);
                return;
            }
            // Add new head to snake
            newSnake.unshift(head);
            // Check food collision
            const foodAtHead = foodRef.current.x === head.x && foodRef.current.y === head.y;
            if (foodAtHead) {
                // Don't remove tail when food is eaten
                const newFood = generateFood();
                setFood(newFood);
                foodRef.current = newFood;
                setScore(prev => prev + 10);
                // Increase speed every 50 points
                if (score > 0 && score % 50 === 0 && speed > MIN_SPEED) {
                    setSpeed(prev => Math.max(MIN_SPEED, prev - 10));
                }
            }
            else {
                // Remove tail if no food eaten
                newSnake.pop();
            }
            setSnake(newSnake);
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameStatus, nextDirection, speed, score]); // Removed food and generateFood from dependencies
    // Start game on mount
    (0, react_1.useEffect)(() => {
        initGame();
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [initGame]);
    // Render game grid
    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const isSnakeHead = snake[0].x === x && snake[0].y === y;
                const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
                const isFood = food.x === x && food.y === y;
                let cellClass = 'cell';
                if (isSnakeHead) {
                    cellClass += ' snake-head';
                }
                else if (isSnakeBody) {
                    cellClass += ' snake-body';
                }
                else if (isFood) {
                    cellClass += ' food';
                }
                grid.push((0, jsx_runtime_1.jsx)("div", { className: cellClass, style: {
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                    } }, `${x}-${y}`));
            }
        }
        return grid;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "snake-game", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Snake Game" }), (0, jsx_runtime_1.jsxs)("div", { className: "game-info", children: [(0, jsx_runtime_1.jsxs)("div", { className: "score", children: ["Score: ", score] }), (0, jsx_runtime_1.jsxs)("div", { className: "speed", children: ["Speed: ", Math.round((INITIAL_SPEED - speed + MIN_SPEED) / 10)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "game-board", style: {
                    width: GRID_SIZE * CELL_SIZE,
                    height: GRID_SIZE * CELL_SIZE,
                }, children: renderGrid() }), (0, jsx_runtime_1.jsxs)("div", { className: "game-controls", children: [gameStatus === 'IDLE' && ((0, jsx_runtime_1.jsx)("button", { onClick: initGame, className: "start-button", children: "Start Game" })), gameStatus === 'PLAYING' && ((0, jsx_runtime_1.jsx)("button", { onClick: () => setGameStatus('PAUSED'), className: "pause-button", children: "Pause" })), gameStatus === 'PAUSED' && ((0, jsx_runtime_1.jsx)("button", { onClick: () => setGameStatus('PLAYING'), className: "resume-button", children: "Resume" })), gameStatus === 'GAME_OVER' && ((0, jsx_runtime_1.jsxs)("div", { className: "game-over", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Game Over! Final Score: ", score] }), (0, jsx_runtime_1.jsx)("button", { onClick: initGame, className: "restart-button", children: "Play Again" })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "game-rules", children: [(0, jsx_runtime_1.jsx)("h3", { children: "How to Play" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { children: ["Use ", (0, jsx_runtime_1.jsx)("strong", { children: "Arrow Keys" }), " to control the snake"] }), (0, jsx_runtime_1.jsxs)("li", { children: ["Eat the ", (0, jsx_runtime_1.jsx)("span", { className: "food", children: "food" }), " to grow and earn points"] }), (0, jsx_runtime_1.jsx)("li", { children: "Avoid hitting the walls or yourself" }), (0, jsx_runtime_1.jsxs)("li", { children: ["Press ", (0, jsx_runtime_1.jsx)("strong", { children: "Space" }), " to pause/resume the game"] }), (0, jsx_runtime_1.jsx)("li", { children: "Game speeds up as your score increases" })] })] })] }));
};
exports.default = SnakeGame;
//# sourceMappingURL=SnakeGame.js.map