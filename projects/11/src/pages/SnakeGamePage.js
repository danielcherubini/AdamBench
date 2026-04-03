import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef, useCallback } from 'react';
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SnakeGamePage = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const directionRef = useRef('RIGHT');
    const directionDisplayRef = useRef('RIGHT');
    const gameLoopRef = useRef();
    const generateFood = useCallback(() => {
        let newFood;
        let isOnSnake;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
            isOnSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
        } while (isOnSnake);
        return newFood;
    }, [snake]);
    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        directionDisplayRef.current = 'RIGHT';
        directionRef.current = 'RIGHT';
        setGameOver(false);
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setIsPlaying(true);
    };
    const gameOverEffect = () => {
        setGameOver(true);
        setIsPlaying(false);
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }
    };
    const moveSnake = useCallback(() => {
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
            // Check wall collision
            if (newHead.x < 0 ||
                newHead.x >= GRID_SIZE ||
                newHead.y < 0 ||
                newHead.y >= GRID_SIZE) {
                gameOverEffect();
                return prevSnake;
            }
            // Check self collision
            if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
                gameOverEffect();
                return prevSnake;
            }
            const newSnake = [newHead, ...prevSnake];
            // Check food collision
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore((s) => s + 1);
                setFood(generateFood());
                // Increase speed slightly every 5 points
                if ((score + 1) % 5 === 0 && speed > 50) {
                    setSpeed((s) => s - 5);
                }
            }
            else {
                newSnake.pop();
            }
            return newSnake;
        });
    }, [food, generateFood, score, speed]);
    useEffect(() => {
        if (isPlaying && !gameOver) {
            gameLoopRef.current = window.setInterval(moveSnake, speed);
        }
        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [isPlaying, gameOver, moveSnake, speed]);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying || gameOver)
                return;
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (directionRef.current !== 'DOWN')
                        directionRef.current = 'UP';
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (directionRef.current !== 'UP')
                        directionRef.current = 'DOWN';
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (directionRef.current !== 'RIGHT')
                        directionRef.current = 'LEFT';
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (directionRef.current !== 'LEFT')
                        directionRef.current = 'RIGHT';
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, gameOver]);
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Snake Game" }), _jsx("p", { className: "text-gray-600", children: "A classic snake game built with React" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "bg-gray-900 rounded-lg p-4 shadow-xl", style: { width: 'fit-content' }, children: _jsx("div", { className: "grid gap-px bg-gray-800", style: {
                                            gridTemplateColumns: `repeat(${GRID_SIZE}, 24px)`,
                                            gridTemplateRows: `repeat(${GRID_SIZE}, 24px)`,
                                        }, children: Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                                            const x = i % GRID_SIZE;
                                            const y = Math.floor(i / GRID_SIZE);
                                            const isSnakeHead = snake[0].x === x && snake[0].y === y;
                                            const isSnakeBody = snake.some((s) => s.x === x && s.y === y && s !== snake[0]);
                                            const isFood = food.x === x && food.y === y;
                                            return (_jsx("div", { style: {
                                                    width: '24px',
                                                    height: '24px',
                                                    backgroundColor: isSnakeHead
                                                        ? '#22c55e'
                                                        : isSnakeBody
                                                            ? '#86efac'
                                                            : isFood
                                                                ? '#ef4444'
                                                                : '#374151',
                                                } }, i));
                                        }) }) }), !isPlaying && !gameOver && (_jsx("button", { onClick: resetGame, className: "mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors", children: "Start Game" })), gameOver && (_jsxs("div", { className: "mt-6 text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-red-600 mb-2", children: "Game Over!" }), _jsxs("p", { className: "text-gray-700 mb-4", children: ["Final Score: ", score] }), _jsx("button", { onClick: resetGame, className: "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: "Play Again" })] }))] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "How to Play" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Objective" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Guide the snake to eat the red food blocks. Each food block increases your score and makes the snake longer. Avoid hitting the walls or your own tail." })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Controls" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "px-2 py-1 bg-gray-100 rounded border text-xs font-mono", children: "W" }), _jsx("span", { children: "or" }), _jsx("span", { className: "px-2 py-1 bg-gray-100 rounded border text-xs font-mono", children: "\u2191" }), _jsx("span", { children: "Move Up" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "px-2 py-1 bg-gray-100 rounded border text-xs font-mono", children: "S" }), _jsx("span", { children: "or" }), _jsx("span", { className: "px-2 py-1 bg-gray-100 rounded border text-xs font-mono", children: "\u2193" }), _jsx("span", { children: "Move Down" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "px-2 py-1 bg-gray-100 rounded border text-xs font-mono", children: "A" }), _jsx("span", { children: "or" }), _jsx("span", { className: "px-2 py-1 bg-gray-100 rounded border text-xs font-mono", children: "\u2190" }), _jsx("span", { children: "Move Left" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "px-2 py-1 bg-gray-100 rounded border text-xs font-mono", children: "D" }), _jsx("span", { children: "or" }), _jsx("span", { className: "px-2 py-1 bg-gray-100 rounded border text-xs font-mono", children: "\u2192" }), _jsx("span", { children: "Move Right" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Scoring" }), _jsx("p", { className: "text-gray-600 text-sm", children: "+1 point for each food block eaten. The game speeds up slightly every 5 points." })] }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-700", children: "Current Score" }), _jsx("span", { className: "text-2xl font-bold text-blue-600", children: score })] }) })] })] })] })] }) }));
};
export default SnakeGamePage;
//# sourceMappingURL=SnakeGamePage.js.map