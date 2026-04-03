import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import styles from './Snake.module.css';
const SIZE = 15;
const SPEED = 150;
export const SnakePage = () => {
    const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
    const [food, setFood] = useState({ x: 10, y: 7 });
    const [dir, setDir] = useState({ x: 1, y: 0 });
    const [nextDir, setNextDir] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [running, setRunning] = useState(false);
    const reset = useCallback(() => {
        setSnake([{ x: 7, y: 7 }]);
        setFood({ x: 10, y: 7 });
        setDir({ x: 1, y: 0 });
        setNextDir({ x: 1, y: 0 });
        setGameOver(false);
        setScore(0);
        setRunning(false);
    }, []);
    const spawnFood = useCallback((snake) => {
        let pos;
        do {
            pos = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
        } while (snake.some(s => s.x === pos.x && s.y === pos.y));
        return pos;
    }, []);
    useEffect(() => {
        const onKey = (e) => {
            if (gameOver)
                return;
            const map = {
                ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
                ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
                w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
                a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
            };
            const nd = map[e.key];
            if (nd && (nd.x !== -dir.x || nd.y !== -dir.y)) {
                setNextDir(nd);
                if (!running)
                    setRunning(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [dir, running, gameOver]);
    useEffect(() => {
        if (!running || gameOver)
            return;
        const interval = setInterval(() => {
            setDir(nextDir);
            setSnake(prev => {
                const head = { x: prev[0].x + nextDir.x, y: prev[0].y + nextDir.y };
                if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE ||
                    prev.some(s => s.x === head.x && s.y === head.y)) {
                    setGameOver(true);
                    setRunning(false);
                    return prev;
                }
                const next = [head, ...prev];
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10);
                    setFood(spawnFood(next));
                }
                else {
                    next.pop();
                }
                return next;
            });
        }, SPEED);
        return () => clearInterval(interval);
    }, [running, nextDir, food, gameOver, spawnFood]);
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "Snake Game" }), _jsx("p", { className: styles.subtitle, children: "Play without logging in!" })] }), _jsxs("div", { className: styles.gameContainer, children: [_jsxs("div", { className: styles.score, children: ["Score: ", score] }), _jsx("div", { className: styles.board, children: Array.from({ length: SIZE }, (_, y) => Array.from({ length: SIZE }, (_, x) => {
                            const isHead = snake[0].x === x && snake[0].y === y;
                            const isBody = snake.slice(1).some(s => s.x === x && s.y === y);
                            const isFood = food.x === x && food.y === y;
                            let cls = styles.cell;
                            if (isHead)
                                cls += ` ${styles.head}`;
                            else if (isBody)
                                cls += ` ${styles.body}`;
                            else if (isFood)
                                cls += ` ${styles.food}`;
                            return _jsx("div", { className: cls }, `${x}-${y}`);
                        })) }), gameOver && (_jsxs("div", { className: styles.overlay, children: [_jsx("p", { children: "Game Over!" }), _jsxs("p", { children: ["Score: ", score] }), _jsx("button", { onClick: reset, className: styles.restartBtn, children: "Play Again" })] })), !running && !gameOver && _jsx("p", { className: styles.hint, children: "Press arrow key to start" })] }), _jsxs("div", { className: styles.info, children: [_jsxs("div", { className: styles.section, children: [_jsx("h2", { children: "Controls" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("kbd", { children: "\u2191\u2193\u2190\u2192" }), " or ", _jsx("kbd", { children: "WASD" }), " to move"] }), _jsx("li", { children: "Cannot reverse direction" })] })] }), _jsxs("div", { className: styles.section, children: [_jsx("h2", { children: "Rules" }), _jsxs("ul", { children: [_jsx("li", { children: "Eat red food to grow" }), _jsx("li", { children: "Avoid walls and yourself" }), _jsx("li", { children: "Each food = 10 points" })] })] })] })] }));
};
//# sourceMappingURL=SnakePage.js.map