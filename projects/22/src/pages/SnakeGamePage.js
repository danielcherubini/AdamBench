import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
export function SnakeGamePage() {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [highScore, setHighScore] = useState(0);
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
    const resetGame = useCallback(() => {
        const initialSnake = [{ x: 10, y: 10 }];
        setSnake(initialSnake);
        setFood(generateFood(initialSnake));
        setDirection('RIGHT');
        directionRef.current = 'RIGHT';
        setGameOver(false);
        setScore(0);
        setIsPlaying(true);
    }, [generateFood]);
    const moveSnake = useCallback(() => {
        if (gameOver)
            return;
        setSnake((prevSnake) => {
            const head = { ...prevSnake[0] };
            const currentDirection = directionRef.current;
            switch (currentDirection) {
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
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                setGameOver(true);
                setIsPlaying(false);
                return prevSnake;
            }
            // Check self collision
            if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
                setGameOver(true);
                setIsPlaying(false);
                return prevSnake;
            }
            const newSnake = [head, ...prevSnake];
            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                setScore((s) => {
                    const newScore = s + 10;
                    if (newScore > highScore) {
                        setHighScore(newScore);
                        localStorage.setItem('snakeHighScore', newScore.toString());
                    }
                    return newScore;
                });
                setFood(generateFood(newSnake));
            }
            else {
                newSnake.pop();
            }
            return newSnake;
        });
    }, [food, gameOver, generateFood, highScore]);
    // Game loop
    useEffect(() => {
        if (isPlaying && !gameOver) {
            gameLoopRef.current = window.setInterval(moveSnake, INITIAL_SPEED);
        }
        return () => {
            if (gameLoopRef.current)
                window.clearInterval(gameLoopRef.current);
        };
    }, [isPlaying, gameOver, moveSnake]);
    // Keyboard controls
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!isPlaying && !gameOver && e.code === 'Space') {
                resetGame();
                return;
            }
            if (gameOver && e.code === 'Space') {
                resetGame();
                return;
            }
            const keyDirectionMap = {
                ArrowUp: 'UP',
                ArrowDown: 'DOWN',
                ArrowLeft: 'LEFT',
                ArrowRight: 'RIGHT',
                KeyW: 'UP',
                KeyS: 'DOWN',
                KeyA: 'LEFT',
                KeyD: 'RIGHT',
            };
            const newDirection = keyDirectionMap[e.code];
            if (!newDirection)
                return;
            const opposites = {
                UP: 'DOWN',
                DOWN: 'UP',
                LEFT: 'RIGHT',
                RIGHT: 'LEFT',
            };
            if (opposites[newDirection] !== directionRef.current) {
                setDirection(newDirection);
                directionRef.current = newDirection;
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isPlaying, gameOver, resetGame]);
    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem('snakeHighScore');
        if (saved)
            setHighScore(parseInt(saved, 10));
    }, []);
    const handleDirectionButton = (newDir) => {
        const opposites = {
            UP: 'DOWN',
            DOWN: 'UP',
            LEFT: 'RIGHT',
            RIGHT: 'LEFT',
        };
        if (opposites[newDir] !== directionRef.current) {
            setDirection(newDir);
            directionRef.current = newDir;
        }
    };
    return (_jsxs("div", { style: styles.container, children: [_jsxs("header", { style: styles.header, children: [_jsx(Link, { to: "/login", style: styles.backLink, children: "\u2190 Back to Login" }), _jsx("h1", { style: styles.title, children: "\uD83D\uDC0D Snake Game" })] }), _jsxs("main", { style: styles.main, children: [_jsxs("div", { style: styles.gameContainer, children: [_jsxs("div", { style: styles.scoreBoard, children: [_jsxs("span", { style: styles.score, children: ["Score: ", score] }), _jsxs("span", { style: styles.highScore, children: ["High Score: ", highScore] })] }), _jsx("div", { style: styles.grid, children: Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                                    const x = index % GRID_SIZE;
                                    const y = Math.floor(index / GRID_SIZE);
                                    const isSnakeHead = snake[0].x === x && snake[0].y === y;
                                    const isSnakeBody = snake.slice(1).some((seg) => seg.x === x && seg.y === y);
                                    const isFood = food.x === x && food.y === y;
                                    let cellStyle = styles.cell;
                                    if (isSnakeHead)
                                        cellStyle = { ...cellStyle, ...styles.snakeHead };
                                    else if (isSnakeBody)
                                        cellStyle = { ...cellStyle, ...styles.snakeBody };
                                    else if (isFood)
                                        cellStyle = { ...cellStyle, ...styles.food };
                                    return _jsx("div", { style: cellStyle }, index);
                                }) }), (!isPlaying || gameOver) && (_jsxs("div", { style: styles.overlay, children: [gameOver ? (_jsxs(_Fragment, { children: [_jsx("h2", { style: styles.gameOverTitle, children: "Game Over!" }), _jsxs("p", { style: styles.finalScore, children: ["Final Score: ", score] })] })) : (_jsx("h2", { style: styles.gameOverTitle, children: "Ready to Play?" })), _jsx("button", { onClick: resetGame, style: styles.startButton, children: gameOver ? 'Play Again' : 'Start Game' }), _jsx("p", { style: styles.hint, children: "or press Space" })] }))] }), _jsxs("div", { style: styles.infoPanel, children: [_jsxs("div", { style: styles.infoSection, children: [_jsx("h3", { style: styles.infoTitle, children: "\uD83C\uDFAE Controls" }), _jsxs("ul", { style: styles.controlList, children: [_jsxs("li", { children: [_jsx("strong", { children: "Arrow Keys" }), " or ", _jsx("strong", { children: "WASD" }), " - Move"] }), _jsxs("li", { children: [_jsx("strong", { children: "Space" }), " - Start / Restart"] })] }), _jsxs("div", { style: styles.mobileControls, children: [_jsx("button", { onClick: () => handleDirectionButton('UP'), style: styles.dPadButton, children: "\u25B2" }), _jsxs("div", { style: styles.dPadRow, children: [_jsx("button", { onClick: () => handleDirectionButton('LEFT'), style: styles.dPadButton, children: "\u25C0" }), _jsx("button", { onClick: () => handleDirectionButton('DOWN'), style: styles.dPadButton, children: "\u25BC" }), _jsx("button", { onClick: () => handleDirectionButton('RIGHT'), style: styles.dPadButton, children: "\u25B6" })] })] })] }), _jsxs("div", { style: styles.infoSection, children: [_jsx("h3", { style: styles.infoTitle, children: "\uD83D\uDCDC Rules" }), _jsxs("ul", { style: styles.rulesList, children: [_jsx("li", { children: "Eat the red food to grow and score points" }), _jsx("li", { children: "Each food gives you +10 points" }), _jsx("li", { children: "Don't hit the walls!" }), _jsx("li", { children: "Don't eat yourself!" }), _jsx("li", { children: "Try to beat your high score" })] })] })] })] })] }));
}
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#eee',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        gap: '24px',
    },
    backLink: {
        color: '#4a9eff',
        textDecoration: 'none',
        fontSize: '16px',
    },
    title: {
        margin: 0,
        fontSize: '28px',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        gap: '24px',
    },
    gameContainer: {
        position: 'relative',
        border: '3px solid #4a9eff',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    scoreBoard: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#16213e',
        fontSize: '18px',
    },
    score: {
        color: '#4a9eff',
        fontWeight: 'bold',
    },
    highScore: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
        gap: '1px',
        backgroundColor: '#0f0f23',
        padding: '4px',
    },
    cell: {
        width: '20px',
        height: '20px',
        backgroundColor: '#1a1a2e',
        borderRadius: '2px',
    },
    snakeHead: {
        backgroundColor: '#4a9eff',
        borderRadius: '4px',
    },
    snakeBody: {
        backgroundColor: '#2d6cdf',
        borderRadius: '3px',
    },
    food: {
        backgroundColor: '#ff4757',
        borderRadius: '50%',
    },
    overlay: {
        position: 'absolute',
        top: '44px',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
    },
    gameOverTitle: {
        margin: 0,
        fontSize: '32px',
        color: '#ff4757',
    },
    finalScore: {
        fontSize: '20px',
        color: '#eee',
    },
    startButton: {
        padding: '12px 32px',
        backgroundColor: '#4a9eff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    hint: {
        color: '#888',
        fontSize: '14px',
    },
    infoPanel: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        width: '100%',
        maxWidth: '800px',
    },
    infoSection: {
        backgroundColor: '#16213e',
        padding: '20px',
        borderRadius: '8px',
    },
    infoTitle: {
        margin: '0 0 16px 0',
        fontSize: '18px',
        color: '#4a9eff',
    },
    controlList: {
        margin: 0,
        paddingLeft: '20px',
        color: '#ccc',
    },
    rulesList: {
        margin: 0,
        paddingLeft: '20px',
        color: '#ccc',
    },
    mobileControls: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        marginTop: '16px',
    },
    dPadRow: {
        display: 'flex',
        gap: '8px',
    },
    dPadButton: {
        width: '50px',
        height: '50px',
        backgroundColor: '#2d6cdf',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '20px',
        cursor: 'pointer',
    },
};
//# sourceMappingURL=SnakeGamePage.js.map