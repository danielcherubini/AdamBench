import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
function SnakeGame() {
    const navigate = useNavigate();
    const resetGameRef = useRef();
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const generateFood = useCallback(() => {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }, [snake]);
    const resetGame = useCallback(() => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        setDirection('RIGHT');
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
    }, [generateFood]);
    useEffect(() => {
        resetGameRef.current = resetGame;
    }, [resetGame]);
    const handleKeyDown = useCallback((e) => {
        if (gameOver) {
            if (e.key === 'Enter' || e.key === ' ') {
                resetGameRef.current?.();
            }
            return;
        }
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (direction !== 'DOWN')
                    setDirection('UP');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (direction !== 'UP')
                    setDirection('DOWN');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (direction !== 'RIGHT')
                    setDirection('LEFT');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (direction !== 'LEFT')
                    setDirection('RIGHT');
                break;
            case 'p':
            case 'P':
            case ' ':
                setIsPaused(prev => !prev);
                break;
            case 'Escape':
                navigate('/welcome');
                break;
        }
    }, [direction, gameOver, navigate]);
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    useEffect(() => {
        if (gameOver || isPaused)
            return;
        const moveSnake = () => {
            setSnake(prevSnake => {
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
                // Check wall collision
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    setGameOver(true);
                    return prevSnake;
                }
                // Check self collision
                if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    setGameOver(true);
                    return prevSnake;
                }
                const newSnake = [head, ...prevSnake];
                // Check food collision
                if (head.x === food.x && head.y === food.y) {
                    setScore(prev => prev + 10);
                    setFood(generateFood());
                }
                else {
                    newSnake.pop();
                }
                return newSnake;
            });
        };
        const gameInterval = setInterval(moveSnake, INITIAL_SPEED);
        return () => clearInterval(gameInterval);
    }, [direction, food, gameOver, isPaused, generateFood]);
    return (_jsxs("div", { style: styles.container, children: [_jsx("button", { onClick: () => navigate('/welcome'), style: styles.backButton, children: "\u2190 Back" }), _jsx("h1", { style: styles.title, children: "\uD83D\uDC0D Snake Game" }), _jsxs("div", { style: styles.infoSection, children: [_jsxs("div", { style: styles.card, children: [_jsx("h2", { style: styles.cardTitle, children: "Rules" }), _jsxs("ul", { style: styles.rulesList, children: [_jsx("li", { children: "Use arrow keys or WASD to control the snake" }), _jsx("li", { children: "Eat the red food to grow and gain 10 points" }), _jsx("li", { children: "Don't hit the walls or yourself!" }), _jsx("li", { children: "Press Space or P to pause/resume" }), _jsx("li", { children: "Press Escape to quit" })] })] }), _jsxs("div", { style: styles.card, children: [_jsx("h2", { style: styles.cardTitle, children: "Controls" }), _jsxs("div", { style: styles.controlsGrid, children: [_jsxs("div", { style: styles.controlRow, children: [_jsx("kbd", { style: styles.key, children: "\u2191" }), _jsx("kbd", { style: styles.key, children: "\u2193" }), _jsx("kbd", { style: styles.key, children: "\u2190" }), _jsx("kbd", { style: styles.key, children: "\u2192" })] }), _jsx("p", { style: styles.controlText, children: "Move the snake" }), _jsxs("div", { style: styles.controlRow, children: [_jsx("kbd", { style: styles.key, children: "W" }), _jsx("kbd", { style: styles.key, children: "A" }), _jsx("kbd", { style: styles.key, children: "S" }), _jsx("kbd", { style: styles.key, children: "D" })] }), _jsx("p", { style: styles.controlText, children: "Alternative controls" }), _jsx("div", { style: styles.controlRow, children: _jsx("kbd", { style: styles.key, children: "Space" }) }), _jsx("p", { style: styles.controlText, children: "Pause/Resume" }), _jsx("div", { style: styles.controlRow, children: _jsx("kbd", { style: styles.key, children: "Esc" }) }), _jsx("p", { style: styles.controlText, children: "Quit game" })] })] })] }), _jsxs("div", { style: styles.gameSection, children: [_jsxs("div", { style: styles.scoreBoard, children: [_jsx("span", { style: styles.scoreLabel, children: "Score:" }), _jsx("span", { style: styles.scoreValue, children: score })] }), _jsx("div", { style: styles.gameBoard, children: Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                            const x = index % GRID_SIZE;
                            const y = Math.floor(index / GRID_SIZE);
                            const isSnakeHead = snake[0].x === x && snake[0].y === y;
                            const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
                            const isFood = food.x === x && food.y === y;
                            return (_jsx("div", { style: {
                                    ...styles.cell,
                                    backgroundColor: isSnakeHead
                                        ? '#4CAF50'
                                        : isSnakeBody
                                            ? '#81C784'
                                            : isFood
                                                ? '#E53935'
                                                : '#E8F5E9',
                                    border: isSnakeHead ? '2px solid #2E7D32' : '1px solid #C8E6C9',
                                } }, index));
                        }) }), gameOver && (_jsxs("div", { style: styles.gameOverOverlay, children: [_jsx("h2", { style: styles.gameOverTitle, children: "Game Over!" }), _jsxs("p", { style: styles.gameOverText, children: ["Final Score: ", score] }), _jsx("button", { onClick: resetGame, style: styles.restartButton, children: "Play Again" }), _jsx("p", { style: styles.gameOverHint, children: "Or press Enter to restart" })] })), isPaused && !gameOver && (_jsxs("div", { style: styles.pauseOverlay, children: [_jsx("h2", { style: styles.pauseTitle, children: "Paused" }), _jsx("p", { style: styles.pauseText, children: "Press Space or P to continue" })] }))] })] }));
}
export default SnakeGame;
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '24px',
    },
    infoSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '800px',
        marginBottom: '24px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '16px',
    },
    rulesList: {
        margin: 0,
        paddingLeft: '20px',
        color: '#666',
        lineHeight: '1.8',
    },
    controlsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    controlRow: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
    },
    key: {
        padding: '6px 12px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 2px 0 #ddd',
    },
    controlText: {
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        margin: '0',
    },
    gameSection: {
        position: 'relative',
    },
    scoreBoard: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '12px',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
    },
    scoreLabel: {
        marginRight: '8px',
    },
    scoreValue: {
        color: '#4CAF50',
    },
    gameBoard: {
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gap: '1px',
        backgroundColor: '#C8E6C9',
        border: '4px solid #81C784',
        borderRadius: '4px',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
    },
    gameOverOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
    },
    gameOverTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#E53935',
        marginBottom: '12px',
    },
    gameOverText: {
        fontSize: '18px',
        color: '#666',
        marginBottom: '20px',
    },
    restartButton: {
        padding: '12px 32px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    gameOverHint: {
        marginTop: '12px',
        fontSize: '12px',
        color: '#999',
    },
    pauseOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
    },
    pauseTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '8px',
    },
    pauseText: {
        fontSize: '14px',
        color: '#666',
        margin: 0,
    },
};
//# sourceMappingURL=SnakeGame.js.map