import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from 'react';
const GRID = 20, CELL = 20, SPEED = 150;
export function SnakeGame() {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => +(localStorage.getItem('snake_high') || 0));
    const [gameOver, setGameOver] = useState(false);
    const [playing, setPlaying] = useState(false);
    const stateRef = useRef({
        snake: [{ x: 10, y: 10 }],
        food: { x: 15, y: 10 },
        dir: { x: 1, y: 0 },
        nextDir: { x: 1, y: 0 },
    });
    const spawnFood = useCallback((snake) => {
        let food;
        do {
            food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
        } while (snake.some((s) => s.x === food.x && s.y === food.y));
        return food;
    }, []);
    const reset = useCallback(() => {
        const snake = [{ x: 10, y: 10 }];
        stateRef.current = { snake, food: spawnFood(snake), dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 } };
        setScore(0);
        setGameOver(false);
        setPlaying(true);
    }, [spawnFood]);
    useEffect(() => {
        if (!playing || gameOver)
            return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx)
            return;
        const loop = setInterval(() => {
            const { snake, food, dir, nextDir } = stateRef.current;
            stateRef.current.dir = nextDir;
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
            if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || snake.some((s) => s.x === head.x && s.y === head.y)) {
                setGameOver(true);
                setPlaying(false);
                if (score > highScore) {
                    setHighScore(score);
                    localStorage.setItem('snake_high', score.toString());
                }
                return;
            }
            const newSnake = [head, ...snake];
            if (head.x === food.x && head.y === food.y) {
                setScore((s) => s + 10);
                stateRef.current.food = spawnFood(newSnake);
            }
            else {
                newSnake.pop();
            }
            stateRef.current.snake = newSnake;
            // Draw
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(food.x * CELL, food.y * CELL, CELL - 1, CELL - 1);
            newSnake.forEach((s, i) => {
                ctx.fillStyle = i ? '#2ecc71' : '#27ae60';
                ctx.fillRect(s.x * CELL, s.y * CELL, CELL - 1, CELL - 1);
            });
        }, SPEED);
        return () => clearInterval(loop);
    }, [playing, gameOver, score, highScore, spawnFood]);
    useEffect(() => {
        const handleKey = (e) => {
            const keys = {
                ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
                ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
                w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
                a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
            };
            const newDir = keys[e.key];
            const { dir } = stateRef.current;
            if (newDir && !(newDir.x === -dir.x && newDir.y === -dir.y)) {
                stateRef.current.nextDir = newDir;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(10 * CELL, 10 * CELL, CELL - 1, CELL - 1);
        }
    }, []);
    return (_jsx("div", { className: "snake-page", children: _jsxs("div", { className: "snake-container", children: [_jsx("h1", { children: "\uD83D\uDC0D Snake Game" }), _jsxs("div", { className: "game-header", children: [_jsxs("span", { children: ["Score: ", _jsx("strong", { children: score })] }), _jsxs("span", { children: ["High: ", _jsx("strong", { children: highScore })] })] }), _jsxs("div", { className: "game-area", children: [_jsx("canvas", { ref: canvasRef, width: GRID * CELL, height: GRID * CELL }), !playing && (_jsxs("div", { className: "game-overlay", children: [gameOver && _jsx("p", { className: "game-over", children: "Game Over!" }), _jsx("button", { onClick: reset, className: "start-button", children: gameOver ? 'Play Again' : 'Start' })] }))] }), _jsxs("div", { className: "game-info", children: [_jsxs("div", { className: "info-section", children: [_jsx("h3", { children: "Controls" }), _jsx("ul", { children: _jsxs("li", { children: [_jsx("kbd", { children: "\u2191" }), _jsx("kbd", { children: "\u2193" }), _jsx("kbd", { children: "\u2190" }), _jsx("kbd", { children: "\u2192" }), " or ", _jsx("kbd", { children: "W" }), _jsx("kbd", { children: "A" }), _jsx("kbd", { children: "S" }), _jsx("kbd", { children: "D" })] }) })] }), _jsxs("div", { className: "info-section", children: [_jsx("h3", { children: "Rules" }), _jsxs("ul", { children: [_jsx("li", { children: "Eat red food to grow (+10 pts)" }), _jsx("li", { children: "Don't hit walls or yourself" })] })] })] }), _jsx("a", { href: "/login", className: "login-link", children: "\u2190 Login" })] }) }));
}
//# sourceMappingURL=SnakeGame.js.map