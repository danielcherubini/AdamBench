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
const SNAKE_SPEED = 200; // milliseconds
const GRID_SIZE = 20;
const CELL_SIZE = 20; // pixels
const SnakeGame = () => {
    const [snake, setSnake] = (0, react_1.useState)([{ x: 10, y: 10 }]);
    const [direction, setDirection] = (0, react_1.useState)('ArrowRight');
    const [food, setFood] = (0, react_1.useState)({ x: 5, y: 5 });
    const [gameOver, setGameOver] = (0, react_1.useState)(false);
    const [score, setScore] = (0, react_1.useState)(0);
    const gameLoopRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (gameOver)
            return;
        gameLoopRef.current = window.setInterval(() => {
            setSnake(prevSnake => {
                const head = { ...prevSnake[0] };
                switch (direction) {
                    case 'ArrowUp':
                        head.y--;
                        break;
                    case 'ArrowDown':
                        head.y++;
                        break;
                    case 'ArrowLeft':
                        head.x--;
                        break;
                    case 'ArrowRight':
                        head.x++;
                        break;
                }
                // Check wall collision
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    setGameOver(true);
                    return prevSnake;
                }
                // Check self collision
                if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    setGameOver(true);
                    return prevSnake;
                }
                // Check food collision
                if (head.x === food.x && head.y === food.y) {
                    setScore(prevScore => prevScore + 1);
                    setFood({
                        x: Math.floor(Math.random() * GRID_SIZE),
                        y: Math.floor(Math.random() * GRID_SIZE),
                    });
                    return [head, ...prevSnake];
                }
                return [head, ...prevSnake.slice(0, -1)];
            });
        }, SNAKE_SPEED);
        return () => {
            if (gameLoopRef.current !== null) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [direction, food, gameOver]);
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'ArrowDown')
                        setDirection('ArrowUp');
                    break;
                case 'ArrowDown':
                    if (direction !== 'ArrowUp')
                        setDirection('ArrowDown');
                    break;
                case 'ArrowLeft':
                    if (direction !== 'ArrowRight')
                        setDirection('ArrowLeft');
                    break;
                case 'ArrowRight':
                    if (direction !== 'ArrowLeft')
                        setDirection('ArrowRight');
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction]);
    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection('ArrowRight');
        setFood({ x: 5, y: 5 });
        setGameOver(false);
        setScore(0);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', marginTop: '20px' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Snake Game" }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("svg", { width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE, style: { border: '1px solid #333', margin: '0 auto', display: 'block' }, children: [[...Array(GRID_SIZE + 1)].map((_, i) => ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)("line", { x1: i * CELL_SIZE, y1: 0, x2: i * CELL_SIZE, y2: GRID_SIZE * CELL_SIZE, stroke: "#eee", strokeWidth: 1 }), (0, jsx_runtime_1.jsx)("line", { x1: 0, y1: i * CELL_SIZE, x2: GRID_SIZE * CELL_SIZE, y2: i * CELL_SIZE, stroke: "#eee", strokeWidth: 1 })] }, i))), snake.map((segment, index) => ((0, jsx_runtime_1.jsx)("rect", { x: segment.x * CELL_SIZE, y: segment.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE, fill: index === 0 ? '#4CAF50' : '#8BC34A' }, index))), (0, jsx_runtime_1.jsx)("circle", { cx: food.x * CELL_SIZE + CELL_SIZE / 2, cy: food.y * CELL_SIZE + CELL_SIZE / 2, r: CELL_SIZE / 2 - 2, fill: "#FF5722" })] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Score: ", score] }), gameOver ? ((0, jsx_runtime_1.jsx)("button", { onClick: resetGame, children: "Play Again" })) : ((0, jsx_runtime_1.jsx)("p", { children: "Use arrow keys to move the snake. Eat the red food to grow." }))] })] }));
};
exports.default = SnakeGame;
//# sourceMappingURL=SnakeGame.js.map