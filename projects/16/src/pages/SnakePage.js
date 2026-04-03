import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout';
const SIZE = 12;
const TICK_MS = 160;
const randomPoint = (snake) => {
    while (true) {
        const p = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
        if (!snake.some((s) => s.x === p.x && s.y === p.y))
            return p;
    }
};
export const SnakePage = () => {
    const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
    const [food, setFood] = useState({ x: 8, y: 5 });
    const [isGameOver, setIsGameOver] = useState(false);
    const directionRef = useRef('right');
    const restart = () => {
        const start = [{ x: 5, y: 5 }];
        setSnake(start);
        setFood(randomPoint(start));
        directionRef.current = 'right';
        setIsGameOver(false);
    };
    useEffect(() => {
        const onKeyDown = (event) => {
            const key = event.key.toLowerCase();
            const d = directionRef.current;
            if (key === 'r')
                return restart();
            if ((key === 'arrowup' || key === 'w') && d !== 'down')
                directionRef.current = 'up';
            if ((key === 'arrowdown' || key === 's') && d !== 'up')
                directionRef.current = 'down';
            if ((key === 'arrowleft' || key === 'a') && d !== 'right')
                directionRef.current = 'left';
            if ((key === 'arrowright' || key === 'd') && d !== 'left')
                directionRef.current = 'right';
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);
    useEffect(() => {
        if (isGameOver)
            return;
        const id = window.setInterval(() => {
            setSnake((currentSnake) => {
                const head = currentSnake[0];
                const next = { ...head };
                if (directionRef.current === 'up')
                    next.y -= 1;
                if (directionRef.current === 'down')
                    next.y += 1;
                if (directionRef.current === 'left')
                    next.x -= 1;
                if (directionRef.current === 'right')
                    next.x += 1;
                const hitWall = next.x < 0 || next.x >= SIZE || next.y < 0 || next.y >= SIZE;
                const hitSelf = currentSnake.some((segment) => segment.x === next.x && segment.y === next.y);
                if (hitWall || hitSelf) {
                    setIsGameOver(true);
                    return currentSnake;
                }
                const ateFood = next.x === food.x && next.y === food.y;
                const grownSnake = [next, ...currentSnake];
                if (ateFood) {
                    setFood(randomPoint(grownSnake));
                    return grownSnake;
                }
                return grownSnake.slice(0, -1);
            });
        }, TICK_MS);
        return () => window.clearInterval(id);
    }, [food, isGameOver]);
    const board = useMemo(() => {
        const snakeSet = new Set(snake.map((s) => `${s.x}-${s.y}`));
        let text = '';
        for (let y = 0; y < SIZE; y += 1) {
            for (let x = 0; x < SIZE; x += 1) {
                if (x === snake[0].x && y === snake[0].y)
                    text += '🟢';
                else if (snakeSet.has(`${x}-${y}`))
                    text += '🟩';
                else if (x === food.x && y === food.y)
                    text += '🍎';
                else
                    text += '· ';
            }
            text += '\n';
        }
        return text;
    }, [snake, food]);
    return (_jsxs(Layout, { children: [_jsx("h1", { children: "Snake Game" }), _jsx("p", { className: "muted", children: "A tiny public mini-game (no login required)." }), _jsx("pre", { className: "snake-board", children: board }), _jsxs("p", { children: ["Score: ", _jsx("strong", { children: snake.length - 1 })] }), isGameOver && _jsx("p", { className: "error", children: "Game over. Press R to restart." }), _jsx("h3", { children: "Rules & Controls" }), _jsxs("ul", { className: "rules-list muted small", children: [_jsx("li", { children: "Eat \uD83C\uDF4E to grow and gain score." }), _jsx("li", { children: "Avoid walls and your own body." }), _jsx("li", { children: "Move with Arrow keys or W/A/S/D." }), _jsx("li", { children: "Press R to restart." })] }), _jsxs("p", { className: "muted small", children: ["Go to ", _jsx(Link, { to: "/login", children: "login" }), " or ", _jsx(Link, { to: "/dashboard", children: "dashboard" }), "."] })] }));
};
//# sourceMappingURL=SnakePage.js.map