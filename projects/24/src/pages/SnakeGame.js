import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const getRandomPosition = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
});
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
export function SnakeGame() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState(getRandomPosition);
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
    });
    const directionRef = useRef(direction);
    directionRef.current = direction;
    const resetGame = useCallback(() => {
        setSnake(INITIAL_SNAKE);
        setFood(getRandomPosition());
        setDirection('RIGHT');
        directionRef.current = 'RIGHT';
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
    }, []);
    const moveSnake = useCallback(() => {
        if (gameOver || isPaused)
            return;
        setSnake((prevSnake) => {
            const head = prevSnake[0];
            const newHead = { ...head };
            switch (directionRef.current) {
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
            if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
                setGameOver(true);
                return prevSnake;
            }
            // Self collision
            if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
                setGameOver(true);
                return prevSnake;
            }
            const newSnake = [newHead, ...prevSnake];
            // Food collision
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore((s) => {
                    const newScore = s + 10;
                    if (newScore > highScore) {
                        setHighScore(newScore);
                        localStorage.setItem('snakeHighScore', newScore.toString());
                    }
                    return newScore;
                });
                setFood(getRandomPosition());
            }
            else {
                newSnake.pop();
            }
            return newSnake;
        });
    }, [food, gameOver, isPaused, highScore]);
    // Game loop
    useEffect(() => {
        const interval = setInterval(moveSnake, INITIAL_SPEED);
        return () => clearInterval(interval);
    }, [moveSnake]);
    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver && (e.key === ' ' || e.key === 'Enter')) {
                resetGame();
                return;
            }
            if (e.key === 'p' || e.key === 'P') {
                setIsPaused((p) => !p);
                return;
            }
            const opposites = {
                UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
            };
            const keyToDirection = {
                ArrowUp: 'UP', w: 'UP', W: 'UP',
                ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
                ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
                ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT',
            };
            const newDirection = keyToDirection[e.key];
            if (newDirection && newDirection !== opposites[directionRef.current]) {
                directionRef.current = newDirection;
                setDirection(newDirection);
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, resetGame]);
    return (_jsxs("div", { className: "snake-page", children: [_jsxs("div", { className: "snake-header", children: [_jsx("h1", { children: "\uD83D\uDC0D Snake Game" }), _jsx(Link, { to: "/login", className: "nav-link-btn", children: "Sign In" })] }), _jsxs("div", { className: "snake-content", children: [_jsxs("div", { className: "snake-game-container", children: [_jsxs("div", { className: "snake-score", children: [_jsxs("span", { children: ["Score: ", score] }), _jsxs("span", { children: ["High Score: ", highScore] })] }), _jsxs("div", { className: "snake-board", style: {
                                    width: GRID_SIZE * CELL_SIZE,
                                    height: GRID_SIZE * CELL_SIZE,
                                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                                }, children: [Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                                        const x = i % GRID_SIZE;
                                        const y = Math.floor(i / GRID_SIZE);
                                        const isSnake = snake.some((s) => s.x === x && s.y === y);
                                        const isHead = snake[0].x === x && snake[0].y === y;
                                        const isFood = food.x === x && food.y === y;
                                        return (_jsx("div", { className: `cell ${isSnake ? 'snake' : ''} ${isHead ? 'head' : ''} ${isFood ? 'food' : ''}` }, i));
                                    }), gameOver && (_jsx("div", { className: "game-overlay", children: _jsxs("div", { className: "game-over-text", children: [_jsx("h2", { children: "Game Over!" }), _jsxs("p", { children: ["Final Score: ", score] }), _jsx("button", { onClick: resetGame, children: "Play Again" }), _jsx("span", { className: "hint", children: "or press Space/Enter" })] }) })), isPaused && !gameOver && (_jsx("div", { className: "game-overlay", children: _jsxs("div", { className: "game-over-text", children: [_jsx("h2", { children: "Paused" }), _jsx("button", { onClick: () => setIsPaused(false), children: "Resume" }), _jsx("span", { className: "hint", children: "or press P" })] }) }))] })] }), _jsxs("div", { className: "snake-info", children: [_jsxs("div", { className: "info-card", children: [_jsx("h3", { children: "\uD83D\uDCCB Rules" }), _jsxs("ul", { children: [_jsx("li", { children: "Guide the snake to eat the food (red square)" }), _jsxs("li", { children: ["Each food eaten gives you ", _jsx("strong", { children: "10 points" })] }), _jsx("li", { children: "The snake grows longer with each food eaten" }), _jsx("li", { children: "Don't hit the walls!" }), _jsx("li", { children: "Don't hit your own tail!" }), _jsx("li", { children: "Game speed stays constant - it's all about skill" })] })] }), _jsxs("div", { className: "info-card", children: [_jsx("h3", { children: "\uD83C\uDFAE Controls" }), _jsxs("div", { className: "controls-grid", children: [_jsxs("div", { className: "control-item", children: [_jsx("kbd", { children: "\u2191" }), " or ", _jsx("kbd", { children: "W" }), _jsx("span", { children: "Move Up" })] }), _jsxs("div", { className: "control-item", children: [_jsx("kbd", { children: "\u2193" }), " or ", _jsx("kbd", { children: "S" }), _jsx("span", { children: "Move Down" })] }), _jsxs("div", { className: "control-item", children: [_jsx("kbd", { children: "\u2190" }), " or ", _jsx("kbd", { children: "A" }), _jsx("span", { children: "Move Left" })] }), _jsxs("div", { className: "control-item", children: [_jsx("kbd", { children: "\u2192" }), " or ", _jsx("kbd", { children: "D" }), _jsx("span", { children: "Move Right" })] }), _jsxs("div", { className: "control-item", children: [_jsx("kbd", { children: "P" }), _jsx("span", { children: "Pause / Resume" })] }), _jsxs("div", { className: "control-item", children: [_jsx("kbd", { children: "Space" }), _jsx("span", { children: "Restart (after game over)" })] })] })] }), _jsxs("div", { className: "info-card tips", children: [_jsx("h3", { children: "\uD83D\uDCA1 Tips" }), _jsxs("ul", { children: [_jsx("li", { children: "Plan your path ahead - don't just chase the food" }), _jsx("li", { children: "Use the edges to your advantage" }), _jsx("li", { children: "Stay calm as the snake gets longer!" })] })] })] })] })] }));
}
//# sourceMappingURL=SnakeGame.js.map