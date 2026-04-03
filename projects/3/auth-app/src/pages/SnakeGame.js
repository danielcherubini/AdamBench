import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useRef } from 'react';
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SPEED = 150;
const SnakeGame = () => {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 10 });
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const directionRef = useRef(direction);
    directionRef.current = direction;
    const getRandomPosition = useCallback(() => {
        return {
            x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        };
    }, []);
    const resetGame = useCallback(() => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(getRandomPosition());
        setDirection('RIGHT');
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
        setGameStarted(true);
    }, [getRandomPosition]);
    const moveSnake = useCallback(() => {
        if (gameOver || isPaused || !gameStarted)
            return;
        setSnake((prevSnake) => {
            const head = { ...prevSnake[0] };
            const currentDir = directionRef.current;
            switch (currentDir) {
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
            if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
                setGameOver(true);
                return prevSnake;
            }
            // Check self collision
            if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
                setGameOver(true);
                return prevSnake;
            }
            const newSnake = [head, ...prevSnake];
            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                setScore((s) => s + 10);
                setFood(getRandomPosition());
            }
            else {
                newSnake.pop();
            }
            return newSnake;
        });
    }, [food, gameOver, isPaused, gameStarted, getRandomPosition]);
    useEffect(() => {
        const interval = setInterval(moveSnake, INITIAL_SPEED);
        return () => clearInterval(interval);
    }, [moveSnake]);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameStarted && (e.key === ' ' || e.key === 'Enter')) {
                resetGame();
                return;
            }
            if (gameOver && (e.key === ' ' || e.key === 'Enter')) {
                resetGame();
                return;
            }
            if (e.key === ' ' && gameStarted && !gameOver) {
                setIsPaused((p) => !p);
                return;
            }
            const currentDir = directionRef.current;
            const keyMap = {
                ArrowUp: 'UP',
                ArrowDown: 'DOWN',
                ArrowLeft: 'LEFT',
                ArrowRight: 'RIGHT',
                w: 'UP',
                s: 'DOWN',
                a: 'LEFT',
                d: 'RIGHT',
            };
            const newDir = keyMap[e.key];
            if (!newDir)
                return;
            // Prevent 180-degree turns
            const opposites = {
                UP: 'DOWN',
                DOWN: 'UP',
                LEFT: 'RIGHT',
                RIGHT: 'LEFT',
            };
            if (opposites[newDir] !== currentDir) {
                setDirection(newDir);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameStarted, gameOver, resetGame]);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        // Draw grid (subtle)
        ctx.strokeStyle = '#252542';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, CANVAS_SIZE);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(CANVAS_SIZE, i);
            ctx.stroke();
        }
        // Draw food
        ctx.fillStyle = '#e94560';
        ctx.beginPath();
        ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        // Draw snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#00ff88' : '#00cc6a';
            ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
        });
        // Draw overlay for game states
        if (!gameStarted || gameOver || isPaused) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            if (!gameStarted) {
                ctx.fillText('Snake Game', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
                ctx.font = '16px Arial';
                ctx.fillText('Press SPACE or ENTER to start', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
            }
            else if (gameOver) {
                ctx.fillStyle = '#e94560';
                ctx.font = '28px Arial';
                ctx.fillText('GAME OVER', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
                ctx.fillStyle = '#fff';
                ctx.font = '18px Arial';
                ctx.fillText(`Score: ${score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 10);
                ctx.font = '14px Arial';
                ctx.fillText('Press SPACE or ENTER to restart', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 40);
            }
            else if (isPaused) {
                ctx.font = '24px Arial';
                ctx.fillText('PAUSED', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
                ctx.font = '14px Arial';
                ctx.fillText('Press SPACE to continue', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 30);
            }
        }
    }, [snake, food, gameOver, isPaused, score, gameStarted]);
    return (_jsxs("div", { className: "snake-game-container", children: [_jsx("h1", { children: "Snake Game" }), _jsxs("div", { className: "game-wrapper", children: [_jsx("div", { className: "game-info", children: _jsxs("div", { className: "score-display", children: ["Score: ", score] }) }), _jsx("canvas", { ref: canvasRef, width: CANVAS_SIZE, height: CANVAS_SIZE, className: "game-canvas" })] }), _jsxs("div", { className: "game-rules", children: [_jsx("h2", { children: "How to Play" }), _jsxs("div", { className: "rules-content", children: [_jsxs("div", { className: "rules-section", children: [_jsx("h3", { children: "Controls" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("kbd", { children: "Arrow Keys" }), " or ", _jsx("kbd", { children: "WASD" }), " - Move the snake"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Space" }), " or ", _jsx("kbd", { children: "Enter" }), " - Start/Pause/Restart"] })] })] }), _jsxs("div", { className: "rules-section", children: [_jsx("h3", { children: "Rules" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Eat the ", _jsx("span", { className: "food-indicator", children: "red food" }), " to grow and score points"] }), _jsxs("li", { children: ["Each food = ", _jsx("strong", { children: "10 points" })] }), _jsx("li", { children: "Avoid hitting the walls" }), _jsx("li", { children: "Avoid hitting your own body" }), _jsx("li", { children: "The game ends if you collide with walls or yourself" })] })] }), _jsxs("div", { className: "rules-section tips", children: [_jsx("h3", { children: "Tips" }), _jsx("p", { children: "Plan your path ahead of time. The snake keeps growing, so you'll need more space as you play!" })] })] })] }), _jsx("div", { className: "mobile-controls", children: _jsx("p", { className: "mobile-hint", children: "Use keyboard for best experience" }) })] }));
};
export default SnakeGame;
//# sourceMappingURL=SnakeGame.js.map