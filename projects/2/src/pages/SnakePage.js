import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './SnakePage.module.css';
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const SnakePage = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 10 });
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const directionRef = useRef(direction);
    const gameLoopRef = useRef(null);
    const generateFood = useCallback((currentSnake) => {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
        return newFood;
    }, []);
    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood([{ x: 10, y: 10 }]));
        setDirection({ x: 1, y: 0 });
        directionRef.current = { x: 1, y: 0 };
        setScore(0);
        setGameOver(false);
        setIsPlaying(false);
        setSpeed(INITIAL_SPEED);
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }
    };
    const startGame = () => {
        resetGame();
        setIsPlaying(true);
    };
    const moveSnake = useCallback(() => {
        setSnake((prevSnake) => {
            const head = prevSnake[0];
            const newHead = {
                x: head.x + directionRef.current.x,
                y: head.y + directionRef.current.y,
            };
            // Check wall collision
            if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
                setGameOver(true);
                setIsPlaying(false);
                return prevSnake;
            }
            // Check self collision
            if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
                setGameOver(true);
                setIsPlaying(false);
                return prevSnake;
            }
            const newSnake = [newHead, ...prevSnake];
            // Check food collision
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore((s) => s + 10);
                setFood(generateFood(newSnake));
                setSpeed((s) => Math.max(50, s - 2));
                if (gameLoopRef.current) {
                    clearInterval(gameLoopRef.current);
                    gameLoopRef.current = setInterval(moveSnake, Math.max(50, speed - 2));
                }
            }
            else {
                newSnake.pop();
            }
            return newSnake;
        });
    }, [food, generateFood, speed]);
    const handleKeyDown = useCallback((e) => {
        if (!isPlaying)
            return;
        const { key } = e;
        const currentDir = directionRef.current;
        if ((key === 'ArrowUp' || key === 'w') && currentDir.y !== 1) {
            directionRef.current = { x: 0, y: -1 };
            setDirection({ x: 0, y: -1 });
        }
        else if ((key === 'ArrowDown' || key === 's') && currentDir.y !== -1) {
            directionRef.current = { x: 0, y: 1 };
            setDirection({ x: 0, y: 1 });
        }
        else if ((key === 'ArrowLeft' || key === 'a') && currentDir.x !== 1) {
            directionRef.current = { x: -1, y: 0 };
            setDirection({ x: -1, y: 0 });
        }
        else if ((key === 'ArrowRight' || key === 'd') && currentDir.x !== -1) {
            directionRef.current = { x: 1, y: 0 };
            setDirection({ x: 1, y: 0 });
        }
    }, [isPlaying]);
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    useEffect(() => {
        if (isPlaying) {
            gameLoopRef.current = setInterval(moveSnake, speed);
        }
        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [isPlaying, moveSnake, speed]);
    const renderGrid = () => {
        const cells = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                let cellClass = styles.cell;
                let content = '';
                // Check if snake head
                if (snake[0].x === x && snake[0].y === y) {
                    cellClass += ' ' + styles.snakeHead;
                    content = '🐍';
                }
                // Check if snake body
                else if (snake.slice(1).some((seg) => seg.x === x && seg.y === y)) {
                    cellClass += ' ' + styles.snakeBody;
                    content = '█';
                }
                // Check if food
                else if (food.x === x && food.y === y) {
                    cellClass += ' ' + styles.food;
                    content = '🍎';
                }
                cells.push(_jsx("div", { className: cellClass, style: { width: CELL_SIZE, height: CELL_SIZE }, children: content }, `${x}-${y}`));
            }
        }
        return cells;
    };
    return (_jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.gameCard, children: [_jsxs("header", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "\uD83D\uDC0D Snake Game" }), _jsxs("div", { className: styles.score, children: ["Score: ", _jsx("span", { className: styles.scoreValue, children: score })] })] }), _jsx("div", { className: styles.gameBoard, children: renderGrid() }), _jsxs("div", { className: styles.controls, children: [!isPlaying && !gameOver && (_jsx("button", { className: styles.button, onClick: startGame, children: "Start Game" })), gameOver && (_jsxs("div", { className: styles.gameOver, children: [_jsx("p", { className: styles.gameOverText, children: "Game Over!" }), _jsxs("p", { className: styles.finalScore, children: ["Final Score: ", score] }), _jsx("button", { className: styles.button, onClick: startGame, children: "Play Again" })] }))] }), _jsxs("section", { className: styles.rules, children: [_jsx("h2", { children: "How to Play" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use ", _jsx("strong", { children: "Arrow Keys" }), " or ", _jsx("strong", { children: "WASD" }), " to control the snake"] }), _jsxs("li", { children: ["Eat the ", _jsx("strong", { children: "\uD83C\uDF4E apples" }), " to grow and score points (+10 per apple)"] }), _jsxs("li", { children: ["Avoid hitting the ", _jsx("strong", { children: "walls" }), " or your own ", _jsx("strong", { children: "body" })] }), _jsx("li", { children: "The snake speeds up as you eat more apples!" })] })] }), _jsxs("section", { className: styles.controlsInfo, children: [_jsx("h2", { children: "Controls" }), _jsxs("div", { className: styles.controlGrid, children: [_jsxs("div", { className: styles.controlItem, children: [_jsx("span", { className: styles.key, children: "\u2191 W" }), _jsx("span", { children: "Move Up" })] }), _jsxs("div", { className: styles.controlItem, children: [_jsx("span", { className: styles.key, children: "\u2193 S" }), _jsx("span", { children: "Move Down" })] }), _jsxs("div", { className: styles.controlItem, children: [_jsx("span", { className: styles.key, children: "\u2190 A" }), _jsx("span", { children: "Move Left" })] }), _jsxs("div", { className: styles.controlItem, children: [_jsx("span", { className: styles.key, children: "\u2192 D" }), _jsx("span", { children: "Move Right" })] })] })] })] }) }));
};
export default SnakePage;
//# sourceMappingURL=SnakePage.js.map