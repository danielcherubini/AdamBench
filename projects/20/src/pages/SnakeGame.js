import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const GAME_SPEED = 150;
const SnakeGame = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [direction, setDirection] = useState('RIGHT');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const generateFood = useCallback(() => {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        return { x, y };
    }, []);
    const startGame = useCallback(() => {
        setSnake(INITIAL_SNAKE);
        setFood(generateFood());
        setDirection('RIGHT');
        setScore(0);
        setIsPlaying(true);
        setGameOver(false);
    }, [generateFood]);
    const checkCollision = (head) => {
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            return true;
        }
        return snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y);
    };
    // Game loop
    useEffect(() => {
        if (!isPlaying || gameOver)
            return;
        const interval = setInterval(() => {
            setSnake((prevSnake) => {
                const head = { ...prevSnake[0] };
                switch (direction) {
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
                if (checkCollision(head)) {
                    setGameOver(true);
                    if (score > highScore)
                        setHighScore(score);
                    return prevSnake;
                }
                const newSnake = [head, ...prevSnake];
                // Check if snake ate food
                if (head.x === food.x && head.y === food.y) {
                    const newScore = score + 10;
                    setScore(newScore);
                    if (newScore > highScore)
                        setHighScore(newScore);
                    setFood(generateFood());
                }
                else {
                    newSnake.pop();
                }
                return newSnake;
            });
        }, GAME_SPEED);
        return () => clearInterval(interval);
    }, [isPlaying, gameOver, direction, snake, food, score, highScore, generateFood]);
    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver && (e.key === ' ' || e.key === 'Enter')) {
                startGame();
                return;
            }
            if (!isPlaying && (e.key === ' ' || e.key === 'Enter')) {
                startGame();
                return;
            }
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN')
                        setDirection('UP');
                    break;
                case 'ArrowDown':
                    if (direction !== 'UP')
                        setDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    if (direction !== 'RIGHT')
                        setDirection('LEFT');
                    break;
                case 'ArrowRight':
                    if (direction !== 'LEFT')
                        setDirection('RIGHT');
                    break;
                case ' ':
                case 'Enter':
                    if (isPlaying)
                        setIsPlaying(false);
                    else
                        startGame();
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, isPlaying, gameOver, startGame]);
    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const isSnake = snake.some(s => s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;
                const isHead = snake[0]?.x === x && snake[0]?.y === y;
                let bgColor = 'bg-gray-100';
                if (isHead)
                    bgColor = 'bg-green-600';
                else if (isSnake)
                    bgColor = 'bg-green-500';
                else if (isFood)
                    bgColor = 'bg-red-500';
                grid.push(_jsx("div", { className: `border border-gray-200 ${bgColor}`, style: { width: CELL_SIZE, height: CELL_SIZE } }, `${x}-${y}`));
            }
        }
        return grid;
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "\uD83D\uDC0D Snake Game" }), _jsx("p", { className: "text-gray-600 mb-6", children: "A simple snake game - no login required!" }), _jsx(Link, { to: "/", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700", children: "\u2190 Back to Home" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "flex space-x-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Score" }), _jsx("div", { className: "text-3xl font-bold text-gray-900", children: score })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "High Score" }), _jsx("div", { className: "text-3xl font-bold text-gray-900", children: highScore })] })] }), _jsxs("div", { className: "flex space-x-3", children: [!isPlaying && !gameOver && (_jsx("button", { onClick: startGame, className: "px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700", children: "Start Game" })), isPlaying && (_jsx("button", { onClick: () => setIsPlaying(false), className: "px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700", children: "Pause" })), gameOver && (_jsx("button", { onClick: startGame, className: "px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700", children: "Play Again" }))] })] }), gameOver && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-md", children: [_jsxs("h3", { className: "text-lg font-medium text-red-800", children: ["Game Over! Score: ", score] }), _jsx("p", { className: "text-red-700", children: "Press Space or Enter to play again." })] })), !isPlaying && !gameOver && (_jsxs("div", { className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md", children: [_jsx("h3", { className: "text-lg font-medium text-blue-800", children: "Ready to Play?" }), _jsx("p", { className: "text-blue-700", children: "Press Space or Enter, or click Start Game." })] })), _jsx("div", { className: "flex justify-center mb-8", children: _jsx("div", { className: "grid border-2 border-gray-300 rounded-lg overflow-hidden", style: {
                                                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                                                width: GRID_SIZE * CELL_SIZE,
                                                height: GRID_SIZE * CELL_SIZE,
                                            }, children: renderGrid() }) })] }) }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 h-full", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "How to Play" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Objective" }), _jsx("p", { className: "text-gray-600", children: "Control the snake to eat red food. Each food increases your score and makes the snake longer. Avoid walls and the snake's body." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Controls" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between p-2 bg-gray-50 rounded", children: [_jsx("span", { children: "Move Up" }), _jsx("span", { className: "font-bold", children: "\u2191 Arrow Up" })] }), _jsxs("div", { className: "flex justify-between p-2 bg-gray-50 rounded", children: [_jsx("span", { children: "Move Down" }), _jsx("span", { className: "font-bold", children: "\u2193 Arrow Down" })] }), _jsxs("div", { className: "flex justify-between p-2 bg-gray-50 rounded", children: [_jsx("span", { children: "Move Left" }), _jsx("span", { className: "font-bold", children: "\u2190 Arrow Left" })] }), _jsxs("div", { className: "flex justify-between p-2 bg-gray-50 rounded", children: [_jsx("span", { children: "Move Right" }), _jsx("span", { className: "font-bold", children: "\u2192 Arrow Right" })] }), _jsxs("div", { className: "flex justify-between p-2 bg-gray-50 rounded", children: [_jsx("span", { children: "Start/Pause" }), _jsx("span", { className: "font-bold", children: "Space or Enter" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Rules" }), _jsxs("ul", { className: "space-y-2 text-gray-600", children: [_jsxs("li", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 bg-red-500 rounded-full mr-2" }), _jsx("span", { children: "Red square = Food (+10 points)" })] }), _jsxs("li", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full mr-2" }), _jsx("span", { children: "Green = Snake body" })] }), _jsxs("li", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 bg-green-600 rounded-full mr-2" }), _jsx("span", { children: "Dark green = Snake head" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("svg", { className: "h-5 w-5 text-red-500 mr-2 mt-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }), _jsx("span", { children: "Game ends if snake hits wall or itself" })] })] })] }), _jsxs("div", { className: "pt-4 border-t border-gray-200", children: [_jsx("p", { className: "text-gray-600", children: "This page is accessible to all users, authenticated or not. Enjoy the game!" }), _jsxs("div", { className: "mt-4 flex space-x-3", children: [_jsx(Link, { to: "/login", className: "flex-1 text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700", children: "Go to Login" }), _jsx(Link, { to: "/dashboard", className: "flex-1 text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50", children: "Try Dashboard" })] })] })] })] }) })] })] }) }));
};
export default SnakeGame;
//# sourceMappingURL=SnakeGame.js.map