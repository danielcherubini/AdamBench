import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
const GRID_SIZE = 15;
const INITIAL_SPEED = 200;
const DIRECTION = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};
const INITIAL_SNAKE = [
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 7, y: 9 },
];
export const SnakeGamePage = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 10, y: 10 });
    const [direction, setDirection] = useState(DIRECTION.UP);
    const [nextDirection, setNextDirection] = useState(DIRECTION.UP);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem('snakeHighScore');
        if (saved) {
            setHighScore(parseInt(saved, 10));
        }
    }, []);
    // Generate random food position
    const generateFood = useCallback(() => {
        let newFood;
        let isOnSnake;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
            isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        } while (isOnSnake);
        return newFood;
    }, [snake]);
    // Move snake
    const moveSnake = useCallback(() => {
        setDirection(nextDirection);
        const newHead = {
            x: snake[0].x + nextDirection.x,
            y: snake[0].y + nextDirection.y,
        };
        // Check wall collision
        if (newHead.x < 0 ||
            newHead.x >= GRID_SIZE ||
            newHead.y < 0 ||
            newHead.y >= GRID_SIZE) {
            setGameOver(true);
            setGameStarted(false);
            return;
        }
        // Check self collision
        if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            setGameOver(true);
            setGameStarted(false);
            return;
        }
        const newSnake = [newHead, ...snake];
        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
            setScore(prev => prev + 1);
            if (score + 1 > highScore) {
                setHighScore(score + 1);
                localStorage.setItem('snakeHighScore', (score + 1).toString());
            }
            setFood(generateFood());
            setSpeed(prev => Math.max(50, prev - 5));
        }
        else {
            newSnake.pop();
        }
        setSnake(newSnake);
    }, [snake, nextDirection, food, score, highScore, generateFood]);
    // Game loop
    useEffect(() => {
        if (!gameOver && !gameStarted)
            return;
        if (gameOver) {
            const interval = setInterval(() => {
                setGameOver(prev => !prev);
                setGameStarted(prev => !prev);
                if (!gameStarted) {
                    setSnake(INITIAL_SNAKE);
                    setDirection(DIRECTION.UP);
                    setNextDirection(DIRECTION.UP);
                    setScore(0);
                    setSpeed(INITIAL_SPEED);
                }
            }, 500);
            return () => clearInterval(interval);
        }
        if (!gameOver && gameStarted) {
            const interval = setInterval(moveSnake, speed);
            return () => clearInterval(interval);
        }
    }, [gameOver, gameStarted, moveSnake, speed]);
    // Handle keyboard input
    const handleKeyPress = useCallback((e) => {
        if (!gameStarted && gameOver)
            return;
        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 0)
                    setNextDirection(DIRECTION.UP);
                break;
            case 'ArrowDown':
                if (direction.y === 0)
                    setNextDirection(DIRECTION.DOWN);
                break;
            case 'ArrowLeft':
                if (direction.x === 0)
                    setNextDirection(DIRECTION.LEFT);
                break;
            case 'ArrowRight':
                if (direction.x === 0)
                    setNextDirection(DIRECTION.RIGHT);
                break;
        }
    }, [direction, gameOver, gameStarted]);
    // Handle button click
    const handleDirectionClick = (dir) => {
        if (gameOver)
            return;
        if (dir.y !== direction.y && dir.x !== direction.x) {
            setNextDirection(dir);
        }
    };
    // Reset game
    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection(DIRECTION.UP);
        setNextDirection(DIRECTION.UP);
        setFood(generateFood());
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setGameOver(false);
        setGameStarted(true);
    };
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);
    // Render grid cell
    const renderCell = (x, y) => {
        const isHead = snake[0].x === x && snake[0].y === y;
        const isBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        let cellClass = 'cell';
        let content = '';
        if (isHead) {
            cellClass += ' head';
            content = '🐍';
        }
        else if (isBody) {
            cellClass += ' body';
            content = '⬜';
        }
        else if (isFood) {
            cellClass += ' food';
            content = '🍎';
        }
        else {
            cellClass += ' empty';
        }
        return _jsx("div", { className: cellClass, children: content }, `${x}-${y}`);
    };
    return (_jsx("div", { className: "snake-game-page", children: _jsxs("div", { className: "snake-container", children: [_jsxs("div", { className: "snake-header", children: [_jsx("h1", { children: "Snake Game \uD83D\uDC0D" }), _jsxs("div", { className: "score-board", children: [_jsxs("span", { className: "score", children: ["Score: ", score] }), _jsxs("span", { className: "high-score", children: ["Best: ", highScore] })] })] }), _jsxs("div", { className: "snake-info", children: [_jsxs("div", { className: "game-status", children: [!gameStarted && !gameOver && (_jsx("span", { className: "status-text", children: "Press Start to Play" })), gameStarted && !gameOver && _jsx("span", { className: "status-text", children: "Playing..." }), gameOver && _jsx("span", { className: "status-text", children: "Game Over!" })] }), _jsxs("div", { className: "rules", children: [_jsx("h2", { children: "Rules" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use ", _jsx("strong", { children: "Arrow Keys" }), " or ", _jsx("strong", { children: "Buttons" }), " to move"] }), _jsxs("li", { children: ["Eat ", _jsx("strong", { children: "\uD83C\uDF4E apples" }), " to grow and score points"] }), _jsxs("li", { children: ["Avoid hitting ", _jsx("strong", { children: "walls" }), " and ", _jsx("strong", { children: "your own body" })] }), _jsxs("li", { children: ["Each apple gives you ", _jsx("strong", { children: "1 point" })] }), _jsx("li", { children: "Speed increases with every apple eaten" }), _jsxs("li", { children: ["Press ", _jsx("strong", { children: "Space" }), " or ", _jsx("strong", { children: "Restart" }), " to continue after game over"] })] })] }), _jsxs("div", { className: "controls", children: [_jsx("h2", { children: "Controls" }), _jsxs("div", { className: "control-buttons", children: [_jsx("button", { className: "control-btn", onClick: () => handleDirectionClick(DIRECTION.UP), disabled: gameOver || !gameStarted, children: "\u2B06\uFE0F" }), _jsx("button", { className: "control-btn", onClick: () => handleDirectionClick(DIRECTION.LEFT), disabled: gameOver || !gameStarted, children: "\u2B05\uFE0F" }), _jsx("button", { className: "control-btn", onClick: () => handleDirectionClick(DIRECTION.DOWN), disabled: gameOver || !gameStarted, children: "\u2B07\uFE0F" }), _jsx("button", { className: "control-btn", onClick: () => handleDirectionClick(DIRECTION.RIGHT), disabled: gameOver || !gameStarted, children: "\u27A1\uFE0F" })] }), _jsx("p", { className: "control-hint", children: "Or use arrow keys on your keyboard" })] }), _jsxs("div", { className: "actions", children: [!gameStarted && !gameOver && (_jsx("button", { className: "start-btn", onClick: resetGame, children: "Start Game" })), gameOver && (_jsx("button", { className: "restart-btn", onClick: resetGame, children: "Restart Game" }))] })] }), _jsx("div", { className: "snake-grid", children: Array.from({ length: GRID_SIZE }).map((_, y) => Array.from({ length: GRID_SIZE }).map((_, x) => renderCell(x, y))) })] }) }));
};
//# sourceMappingURL=SnakeGamePage.js.map