import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useRef } from 'react';
const SnakeGame = () => {
    // Game constants
    const GRID_SIZE = 20;
    const CELL_SIZE = 25;
    const INITIAL_SPEED = 150;
    const MAX_SPEED = 50;
    // Game state
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [score, setScore] = useState(0);
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const [isPlaying, setIsPlaying] = useState(false);
    const gameLoopRef = useRef(null);
    const inputBufferRef = useRef(null);
    // Refs for game state to avoid recreation of gameLoop
    const directionRef = useRef(direction);
    const foodRef = useRef(food);
    const gameOverRef = useRef(gameOver);
    const isPausedRef = useRef(isPaused);
    const snakeRef = useRef(snake);
    // Update refs when state changes
    useEffect(() => {
        directionRef.current = direction;
        foodRef.current = food;
        gameOverRef.current = gameOver;
        isPausedRef.current = isPaused;
    }, [direction, food, gameOver, isPaused, snake]);
    // Generate random food position
    const generateFood = useCallback((currentSnake = snake) => {
        let newFood;
        let isOnSnake;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        } while (isOnSnake);
        return newFood;
    }, []);
    // Initialize game
    const initGame = useCallback(() => {
        const initialSnake = [{ x: 10, y: 10 }];
        setSnake(initialSnake);
        setFood(generateFood(initialSnake));
        setDirection('RIGHT');
        setGameOver(false);
        setIsPaused(false);
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setIsPlaying(true);
        inputBufferRef.current = null;
    }, [generateFood]);
    // Handle keyboard input
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!isPlaying)
                return;
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (direction !== 'DOWN')
                        inputBufferRef.current = 'UP';
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (direction !== 'UP')
                        inputBufferRef.current = 'DOWN';
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (direction !== 'RIGHT')
                        inputBufferRef.current = 'LEFT';
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (direction !== 'LEFT')
                        inputBufferRef.current = 'RIGHT';
                    break;
                case ' ':
                    setIsPaused(prev => !prev);
                    break;
                case 'r':
                case 'R':
                    if (gameOver)
                        initGame();
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction, gameOver, isPlaying, initGame]);
    // Game loop
    const gameLoop = useCallback(() => {
        if (gameOverRef.current || isPausedRef.current)
            return;
        // Process buffered input
        if (inputBufferRef.current) {
            setDirection(inputBufferRef.current);
            inputBufferRef.current = null;
        }
        // Get current snake synchronously
        const currentSnake = [...snakeRef.current];
        console.log('Game loop - Current snake:', currentSnake);
        console.log('Food position:', foodRef.current);
        const head = { ...currentSnake[0] };
        // Move head based on direction
        switch (directionRef.current) {
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
        console.log('New head position:', head);
        // Check collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            setGameOver(true);
            return;
        }
        // Check collision with self
        if (currentSnake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y)) {
            setGameOver(true);
            return;
        }
        const newSnake = [head, ...currentSnake];
        // Check if food is eaten
        const ateFood = head.x === foodRef.current.x && head.y === foodRef.current.y;
        if (ateFood) {
            // Debug log
            console.log('Food eaten! Head at:', head, 'Food at:', foodRef.current);
            // Generate new food
            const newFood = generateFood(newSnake);
            console.log('New food generated:', newFood);
            setFood(newFood);
            foodRef.current = newFood;
            // Increase score
            setScore(prev => {
                const newScore = prev + 10;
                console.log('Score increased to:', newScore);
                // Increase speed every 50 points
                if (newScore > 0 && newScore % 50 === 0) {
                    setSpeed(prevSpeed => Math.max(MAX_SPEED, prevSpeed - 10));
                }
                return newScore;
            });
        }
        else {
            // Remove tail if no food eaten
            newSnake.pop();
        }
        console.log('Final snake array:', newSnake);
        // Update both state and ref synchronously
        setSnake(newSnake);
        snakeRef.current = newSnake;
    }, [generateFood]);
    // Start/stop game loop
    useEffect(() => {
        const runGameLoop = () => {
            if (isPlaying && !gameOver && !isPaused) {
                gameLoop();
                gameLoopRef.current = setTimeout(runGameLoop, speed);
            }
        };
        if (isPlaying && !gameOver && !isPaused) {
            gameLoopRef.current = setTimeout(runGameLoop, speed);
        }
        return () => {
            if (gameLoopRef.current) {
                clearTimeout(gameLoopRef.current);
            }
        };
    }, [isPlaying, gameOver, isPaused, speed]);
    // Initialize game on component mount
    useEffect(() => {
        initGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full", children: [_jsx("h1", { className: "text-4xl font-bold text-center mb-6 text-gray-800", children: "\uD83D\uDC0D Snake Game" }), _jsxs("div", { className: "flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg", children: [_jsxs("div", { className: "text-lg font-semibold", children: ["Score: ", _jsx("span", { className: "text-blue-600", children: score })] }), _jsxs("div", { className: "text-lg font-semibold", children: ["Speed: ", _jsx("span", { className: "text-green-600", children: Math.round((INITIAL_SPEED - speed) / 10) + 1 })] })] }), _jsxs("div", { className: "mb-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300", children: [_jsx("h3", { className: "text-sm font-bold text-yellow-800 mb-2", children: "\uD83D\uDD0D Debug Info:" }), _jsxs("div", { className: "text-xs text-yellow-700 space-y-1", children: [_jsxs("div", { children: ["Snake Length: ", _jsx("span", { className: "font-mono", children: snake.length })] }), _jsxs("div", { children: ["Snake Position: ", _jsxs("span", { className: "font-mono", children: ["[", snake.map(s => `(${s.x},${s.y})`).join(', '), "]"] })] }), _jsxs("div", { children: ["Food Position: ", _jsxs("span", { className: "font-mono", children: ["(", food.x, ", ", food.y, ")"] })] }), _jsxs("div", { children: ["Direction: ", _jsx("span", { className: "font-mono", children: direction })] })] })] }), _jsx("div", { className: "flex justify-center mb-6", children: _jsxs("div", { className: "border-4 border-gray-800 bg-gray-200 rounded-lg overflow-hidden relative", children: [_jsxs("div", { className: "absolute top-0 left-0 bg-black text-white text-xs p-1 rounded-br", children: ["Debug: Grid ", GRID_SIZE, "x", GRID_SIZE] }), _jsx("div", { style: {
                                    position: 'relative',
                                    width: '500px',
                                    height: '500px',
                                    backgroundColor: '#e5e7eb'
                                }, children: Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                                    const x = index % GRID_SIZE;
                                    const y = Math.floor(index / GRID_SIZE);
                                    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                                    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
                                    const isFood = food.x === x && food.y === y;
                                    let bgColor = '#f3f4f6'; // gray-100
                                    if (isSnakeHead)
                                        bgColor = '#059669'; // green-700
                                    else if (isSnake)
                                        bgColor = '#10b981'; // green-500
                                    else if (isFood)
                                        bgColor = '#ef4444'; // red-500
                                    // Debug: Show cell coordinates for snake positions
                                    const debugText = isSnake ? `${x},${y}` : '';
                                    return (_jsx("div", { style: {
                                            position: 'absolute',
                                            width: '25px',
                                            height: '25px',
                                            backgroundColor: bgColor,
                                            left: `${x * 25}px`,
                                            top: `${y * 25}px`,
                                            border: '1px solid #d1d5db',
                                            fontSize: '8px',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }, children: debugText }, index));
                                }) })] }) }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex justify-center space-x-4", children: !isPlaying ? (_jsx("button", { onClick: initGame, className: "px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold", children: "Start Game" })) : (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => setIsPaused(!isPaused), className: "px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold", children: [isPaused ? 'Resume' : 'Pause', " (SPACE)"] }), _jsx("button", { onClick: initGame, className: "px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold", children: "Restart (R)" })] })) }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg border border-gray-200", children: [_jsx("h3", { className: "text-xl font-semibold mb-3 text-gray-800", children: "\uD83C\uDFAE Game Rules & Controls" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 text-sm text-gray-600", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800 mb-2", children: "\uD83C\uDFAF Objective:" }), _jsxs("ul", { className: "space-y-1", children: [_jsx("li", { children: "\u2022 Eat the red food to grow longer" }), _jsx("li", { children: "\u2022 Avoid hitting walls or yourself" }), _jsx("li", { children: "\u2022 Try to get the highest score!" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800 mb-2", children: "\uD83C\uDFAE Controls:" }), _jsxs("ul", { className: "space-y-1", children: [_jsx("li", { children: "\u2022 Arrow Keys or WASD to move" }), _jsx("li", { children: "\u2022 SPACE to pause/unpause" }), _jsx("li", { children: "\u2022 R to restart when game over" })] })] })] }), _jsxs("div", { className: "mt-3 p-3 bg-blue-50 rounded border border-blue-200", children: [_jsx("h4", { className: "font-semibold text-blue-800 mb-1", children: "\uD83D\uDCA1 Pro Tips:" }), _jsx("p", { className: "text-blue-700 text-sm", children: "Your snake speeds up every 50 points! Plan your moves carefully as the game gets faster." })] })] })] })] }) }));
};
export default SnakeGame;
//# sourceMappingURL=SnakeGamePage.js.map