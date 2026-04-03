import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SnakeGame.css';
const GRID_SIZE = 15;
const CELL_SIZE = 24;
const INITIAL_SPEED = 150;
const Direction = { UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3 };
export function SnakeGame() {
    const { isAuthenticated } = useAuth();
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('menu');
    const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
    const [food, setFood] = useState({ x: 3, y: 3 });
    const [direction, setDirection] = useState(Direction.RIGHT);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved, 10) : 0;
    });
    const directionRef = useRef(direction);
    const getRandomFood = useCallback((snakePos) => {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (snakePos.some((s) => s.x === newFood.x && s.y === newFood.y));
        return newFood;
    }, []);
    const resetGame = useCallback(() => {
        const startPos = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
        setSnake([startPos]);
        setFood(getRandomFood([startPos]));
        setDirection(Direction.RIGHT);
        directionRef.current = Direction.RIGHT;
        setScore(0);
        setGameState('playing');
    }, [getRandomFood]);
    const handleKeyDown = useCallback((e) => {
        if (e.key === ' ') {
            e.preventDefault();
            if (gameState === 'gameover')
                resetGame();
            return;
        }
        if (gameState !== 'playing')
            return;
        const currentDir = directionRef.current;
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (currentDir !== Direction.DOWN) {
                    directionRef.current = Direction.UP;
                    setDirection(Direction.UP);
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (currentDir !== Direction.UP) {
                    directionRef.current = Direction.DOWN;
                    setDirection(Direction.DOWN);
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (currentDir !== Direction.RIGHT) {
                    directionRef.current = Direction.LEFT;
                    setDirection(Direction.LEFT);
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (currentDir !== Direction.LEFT) {
                    directionRef.current = Direction.RIGHT;
                    setDirection(Direction.RIGHT);
                }
                break;
        }
    }, [gameState, resetGame]);
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    useEffect(() => {
        if (gameState !== 'playing')
            return;
        const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 5) * 10);
        const interval = setInterval(() => {
            setSnake((prev) => {
                const head = { ...prev[0] };
                switch (directionRef.current) {
                    case Direction.UP:
                        head.y -= 1;
                        break;
                    case Direction.DOWN:
                        head.y += 1;
                        break;
                    case Direction.LEFT:
                        head.x -= 1;
                        break;
                    case Direction.RIGHT:
                        head.x += 1;
                        break;
                }
                if (head.x < 0 ||
                    head.x >= GRID_SIZE ||
                    head.y < 0 ||
                    head.y >= GRID_SIZE ||
                    prev.some((s) => s.x === head.x && s.y === head.y)) {
                    setGameState('gameover');
                    if (score > highScore) {
                        setHighScore(score);
                        localStorage.setItem('snakeHighScore', score.toString());
                    }
                    return prev;
                }
                const newSnake = [head, ...prev];
                if (head.x === food.x && head.y === food.y) {
                    setScore((s) => s + 1);
                    setFood(getRandomFood(newSnake));
                }
                else {
                    newSnake.pop();
                }
                return newSnake;
            });
        }, speed);
        return () => clearInterval(interval);
    }, [gameState, food, score, highScore, getRandomFood]);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        snake.forEach((segment, i) => {
            ctx.fillStyle = i === 0 ? '#4ecdc4' : '#45b7aa';
            ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        });
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.strokeStyle = '#252540';
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
            ctx.stroke();
        }
    }, [snake, food, gameState]);
    const handleMobileDirection = (dir) => {
        if (gameState !== 'playing')
            return;
        const currentDir = directionRef.current;
        if ((dir === Direction.UP && currentDir !== Direction.DOWN) ||
            (dir === Direction.DOWN && currentDir !== Direction.UP) ||
            (dir === Direction.LEFT && currentDir !== Direction.RIGHT) ||
            (dir === Direction.RIGHT && currentDir !== Direction.LEFT)) {
            directionRef.current = dir;
            setDirection(dir);
        }
    };
    return (_jsx("div", { className: "snake-page", children: _jsxs("div", { className: "snake-container", children: [_jsxs("div", { className: "snake-header", children: [_jsx("h1", { children: "\uD83D\uDC0D Snake Game" }), isAuthenticated && (_jsx(Link, { to: "/dashboard", className: "back-link", children: "\u2190 Back to Dashboard" }))] }), _jsx("div", { className: "snake-info", children: _jsxs("div", { className: "snake-stats", children: [_jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Score" }), _jsx("span", { className: "stat-value", children: score })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "High Score" }), _jsx("span", { className: "stat-value", children: highScore })] })] }) }), _jsxs("div", { className: "snake-game-wrapper", children: [_jsx("canvas", { ref: canvasRef, width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE, className: "snake-canvas" }), gameState === 'menu' && (_jsxs("div", { className: "snake-overlay", children: [_jsx("h2", { children: "\uD83D\uDC0D Snake Game" }), _jsxs("div", { className: "snake-rules", children: [_jsx("h3", { children: "Rules" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use ", _jsx("strong", { children: "Arrow Keys" }), " or ", _jsx("strong", { children: "WASD" }), " to move"] }), _jsxs("li", { children: ["Eat the ", _jsx("span", { className: "food-dot", children: "\u25CF" }), " food to grow and score points"] }), _jsx("li", { children: "Avoid hitting the walls or your own tail" }), _jsx("li", { children: "Speed increases as you eat more food!" })] })] }), _jsx("button", { onClick: resetGame, className: "snake-start-btn", children: "\uD83C\uDFAE Start Game" })] })), gameState === 'gameover' && (_jsxs("div", { className: "snake-overlay", children: [_jsx("h2", { children: "\uD83D\uDC80 Game Over!" }), _jsxs("div", { className: "snake-final-score", children: [_jsxs("p", { children: ["Final Score: ", _jsx("strong", { children: score })] }), score >= highScore && score > 0 && (_jsx("p", { className: "new-high-score", children: "\uD83C\uDF89 New High Score!" }))] }), _jsx("button", { onClick: resetGame, className: "snake-start-btn", children: "\uD83D\uDD04 Play Again" }), _jsxs("p", { className: "snake-hint", children: ["Press ", _jsx("strong", { children: "Space" }), " to restart"] })] }))] }), _jsxs("div", { className: "snake-controls", children: [_jsx("p", { className: "controls-hint", children: "Use Arrow Keys or WASD to move" }), _jsxs("div", { className: "mobile-controls", children: [_jsx("button", { onClick: () => handleMobileDirection(Direction.UP), className: "control-btn", children: "\u2191" }), _jsxs("div", { className: "control-row", children: [_jsx("button", { onClick: () => handleMobileDirection(Direction.LEFT), className: "control-btn", children: "\u2190" }), _jsx("button", { onClick: () => handleMobileDirection(Direction.DOWN), className: "control-btn", children: "\u2193" }), _jsx("button", { onClick: () => handleMobileDirection(Direction.RIGHT), className: "control-btn", children: "\u2192" })] })] })] }), isAuthenticated && (_jsx("div", { className: "snake-footer", children: _jsx(Link, { to: "/login", className: "auth-link", children: "\uD83D\uDD12 Login to access Dashboard" }) }))] }) }));
}
//# sourceMappingURL=SnakeGame.js.map