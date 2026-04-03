import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
const SnakeGamePage = () => {
    const canvasRef = useRef(null);
    const [gameStatus, setGameStatus] = useState('ready');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved) : 0;
    });
    // Game configuration
    const gridSize = 20;
    const canvasSize = 400;
    const tileCount = canvasSize / gridSize;
    // Game state
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState({ x: 0, y: 0 });
    // Initialize game
    const initGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 15, y: 15 });
        setDirection({ x: 0, y: 0 });
        setScore(0);
        setGameStatus('playing');
    };
    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Prevent default for arrow keys to stop page scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
            // Only allow direction changes when playing
            if (gameStatus !== 'playing') {
                if (e.key === 'Enter' || e.key === ' ') {
                    initGame();
                }
                return;
            }
            switch (e.key) {
                case 'ArrowUp':
                    if (direction.y !== 1)
                        setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    if (direction.y !== -1)
                        setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    if (direction.x !== 1)
                        setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    if (direction.x !== -1)
                        setDirection({ x: 1, y: 0 });
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameStatus, direction]);
    // Game loop
    useEffect(() => {
        let gameLoop;
        if (gameStatus === 'playing' && direction.x !== 0 || direction.y !== 0) {
            gameLoop = setInterval(() => {
                setSnake((prevSnake) => {
                    const newSnake = [...prevSnake];
                    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
                    // Check wall collision
                    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                        setGameStatus('gameover');
                        if (score > highScore) {
                            setHighScore(score);
                            localStorage.setItem('snakeHighScore', score.toString());
                        }
                        return prevSnake;
                    }
                    // Check self collision
                    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                        setGameStatus('gameover');
                        if (score > highScore) {
                            setHighScore(score);
                            localStorage.setItem('snakeHighScore', score.toString());
                        }
                        return prevSnake;
                    }
                    newSnake.unshift(head);
                    // Check food collision
                    if (head.x === food.x && head.y === food.y) {
                        setScore((prev) => prev + 10);
                        // Generate new food position
                        setFood({
                            x: Math.floor(Math.random() * tileCount),
                            y: Math.floor(Math.random() * tileCount)
                        });
                        // Don't pop tail, so snake grows
                    }
                    else {
                        newSnake.pop();
                    }
                    return newSnake;
                });
            }, 150); // Game speed
        }
        return () => clearInterval(gameLoop);
    }, [gameStatus, direction, food]);
    // Draw game
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        // Draw grid
        ctx.strokeStyle = '#16213e';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvasSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvasSize, i * gridSize);
            ctx.stroke();
        }
        // Draw snake
        snake.forEach((segment, index) => {
            const isHead = index === 0;
            ctx.fillStyle = isHead ? '#4ade80' : '#22c55e';
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
            // Draw eyes on head
            if (isHead) {
                ctx.fillStyle = '#1a1a2e';
                const eyeSize = 4;
                const eyeOffset = 5;
                if (direction.x === 1) { // Right
                    ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                }
                else if (direction.x === -1) { // Left
                    ctx.fillRect(segment.x * gridSize + eyeOffset - eyeSize, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * gridSize + eyeOffset - eyeSize, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                }
                else if (direction.y === -1) { // Up
                    ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                }
                else { // Down
                    ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
                }
            }
        });
        // Draw food
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        // Draw food shine
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2 - 3, food.y * gridSize + gridSize / 2 - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        // Draw game status text
        if (gameStatus === 'ready') {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Press ENTER or SPACE', canvasSize / 2, canvasSize / 2 - 20);
            ctx.font = '16px Arial';
            ctx.fillText('to start the game', canvasSize / 2, canvasSize / 2 + 20);
        }
        else if (gameStatus === 'gameover') {
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvasSize / 2, canvasSize / 2 - 20);
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText(`Final Score: ${score}`, canvasSize / 2, canvasSize / 2 + 20);
            ctx.font = '16px Arial';
            ctx.fillText('Press ENTER or SPACE to play again', canvasSize / 2, canvasSize / 2 + 50);
        }
    }, [snake, food, direction, gameStatus, score]);
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-3xl mx-auto", children: _jsxs("div", { className: "bg-white shadow rounded-lg overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Snake Game" }), _jsx("p", { className: "mt-1 text-sm text-gray-600", children: "A classic arcade game" })] }), _jsxs("div", { className: "px-6 py-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Score" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: score })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "High Score" }), _jsx("p", { className: "text-3xl font-bold text-indigo-600", children: highScore })] })] }), _jsx("div", { className: "flex justify-center mb-6", children: _jsx("canvas", { ref: canvasRef, width: canvasSize, height: canvasSize, className: "border-4 border-gray-800 rounded-lg shadow-lg" }) }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-6", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: "How to Play" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-700 mb-2", children: "Objective" }), _jsx("p", { className: "text-gray-600", children: "Guide the snake to eat the red food. Each piece of food increases your score by 10 points and makes the snake grow longer." })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-700 mb-2", children: "Controls" }), _jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("kbd", { className: "px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-mono shadow-sm", children: "\u2191" }), _jsx("span", { className: "text-gray-600", children: "Move Up" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("kbd", { className: "px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-mono shadow-sm", children: "\u2193" }), _jsx("span", { className: "text-gray-600", children: "Move Down" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("kbd", { className: "px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-mono shadow-sm", children: "\u2190" }), _jsx("span", { className: "text-gray-600", children: "Move Left" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("kbd", { className: "px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-mono shadow-sm", children: "\u2192" }), _jsx("span", { className: "text-gray-600", children: "Move Right" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-700 mb-2", children: "Starting the Game" }), _jsxs("p", { className: "text-gray-600", children: ["Press ", _jsx("kbd", { className: "px-2 py-1 bg-white border border-gray-300 rounded-md text-sm font-mono shadow-sm", children: "ENTER" }), " or ", _jsx("kbd", { className: "px-2 py-1 bg-white border border-gray-300 rounded-md text-sm font-mono shadow-sm", children: "SPACE" }), " to start."] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-700 mb-2", children: "Game Over" }), _jsx("p", { className: "text-gray-600", children: "The game ends if you hit a wall or your own tail. Your high score is saved automatically." })] })] })] }), _jsxs("div", { className: "mt-6 flex gap-3 justify-center", children: [_jsx("a", { href: "/login", className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center", children: "Go to Login" }), _jsx("a", { href: "/dashboard", className: "px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center", children: "Go to Dashboard" })] })] })] }) }) }));
};
export default SnakeGamePage;
//# sourceMappingURL=SnakeGamePage.js.map