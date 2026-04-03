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
// Simple Snake game using a HTML canvas.
// Controls: Arrow keys (← ↑ → ↓) to change direction.
// Goal: Eat the red square (food). Each food increases the snake length.
// The game ends when the snake runs into the wall or itself.
const CELL_SIZE = 20; // px
const CANVAS_SIZE = 400; // width & height in px (20 cells)
const getRandomFood = (snake) => {
    let point;
    do {
        point = {
            x: Math.floor(Math.random() * (CANVAS_SIZE / CELL_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_SIZE / CELL_SIZE)),
        };
    } while (snake.some(seg => seg.x === point.x && seg.y === point.y));
    return point;
};
const SnakeGamePage = () => {
    const canvasRef = (0, react_1.useRef)(null);
    const [snake, setSnake] = (0, react_1.useState)([{ x: 5, y: 5 }]);
    const [food, setFood] = (0, react_1.useState)(getRandomFood(snake));
    const [dir, setDir] = (0, react_1.useState)('RIGHT');
    const [gameOver, setGameOver] = (0, react_1.useState)(false);
    // Handle key presses
    (0, react_1.useEffect)(() => {
        const handler = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (dir !== 'DOWN')
                        setDir('UP');
                    break;
                case 'ArrowDown':
                    if (dir !== 'UP')
                        setDir('DOWN');
                    break;
                case 'ArrowLeft':
                    if (dir !== 'RIGHT')
                        setDir('LEFT');
                    break;
                case 'ArrowRight':
                    if (dir !== 'LEFT')
                        setDir('RIGHT');
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [dir]);
    // Game loop
    (0, react_1.useEffect)(() => {
        if (gameOver)
            return;
        const interval = setInterval(() => {
            setSnake(prev => {
                const head = prev[0];
                let newHead = { ...head };
                switch (dir) {
                    case 'UP':
                        newHead.y -= 1;
                        break;
                    case 'DOWN':
                        newHead.y += 1;
                        break;
                    case 'LEFT':
                        newHead.x -= 1;
                        break;
                    case 'RIGHT':
                        newHead.x += 1;
                        break;
                }
                // Wall collision
                if (newHead.x < 0 || newHead.x >= CANVAS_SIZE / CELL_SIZE ||
                    newHead.y < 0 || newHead.y >= CANVAS_SIZE / CELL_SIZE) {
                    setGameOver(true);
                    return prev;
                }
                // Self collision
                if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
                    setGameOver(true);
                    return prev;
                }
                // Grow when eating food
                const ateFood = newHead.x === food.x && newHead.y === food.y;
                const newSnake = [newHead, ...prev];
                if (!ateFood)
                    newSnake.pop();
                if (ateFood)
                    setFood(getRandomFood(newSnake));
                return newSnake;
            });
        }, 150);
        return () => clearInterval(interval);
    }, [dir, food, gameOver]);
    // Drawing
    (0, react_1.useEffect)(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Clear
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        // Draw food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        // Draw snake
        ctx.fillStyle = 'green';
        snake.forEach(seg => {
            ctx.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });
        // Game over overlay
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            ctx.fillStyle = 'white';
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        }
    }, [snake, food, gameOver]);
    const restart = () => {
        setSnake([{ x: 5, y: 5 }]);
        setFood(getRandomFood([{ x: 5, y: 5 }]));
        setDir('RIGHT');
        setGameOver(false);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.container, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Snake Game (Unauthenticated)" }), (0, jsx_runtime_1.jsx)("p", { children: "Use arrow keys to move. Eat the red square. Avoid walls and yourself." }), (0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, width: CANVAS_SIZE, height: CANVAS_SIZE, style: styles.canvas }), gameOver && ((0, jsx_runtime_1.jsx)("button", { onClick: restart, style: styles.button, children: "Restart" }))] }));
};
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
    },
    canvas: {
        border: '2px solid #333',
        backgroundColor: '#fff',
    },
    button: {
        marginTop: '10px',
        padding: '8px 12px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};
exports.default = SnakeGamePage;
//# sourceMappingURL=SnakeGamePage.js.map