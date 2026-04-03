import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useSnake, COLS, ROWS } from "../hooks/useSnake";
// ── Grid cell classifier ──────────────────────────────────────────────────────
function cellType(x, y, snake, food) {
    if (snake[0]?.x === x && snake[0]?.y === y)
        return "head";
    if (x === food.x && y === food.y)
        return "food";
    if (snake.some((s) => s.x === x && s.y === y))
        return "body";
    return "empty";
}
// ── Page ──────────────────────────────────────────────────────────────────────
export function SnakePage() {
    const { snake, food, score, best, state, togglePlay } = useSnake();
    const statusLabel = {
        idle: "Press Space to start",
        running: "Press Space to pause",
        paused: "Paused — Space to resume",
        dead: "Game over! Space to restart",
    };
    return (_jsxs("div", { className: "snake-page", children: [_jsxs("header", { className: "snake-header", children: [_jsxs("div", { className: "snake-brand", children: [_jsx("span", { className: "logo-icon", children: "\u26A1" }), _jsx("span", { children: "AppName" })] }), _jsx(Link, { to: "/login", className: "snake-login-link", children: "Sign in \u2192" })] }), _jsxs("main", { className: "snake-main", children: [_jsx("h1", { className: "snake-title", children: "Snake" }), _jsxs("div", { className: "snake-scores", children: [_jsxs("div", { className: "snake-score-item", children: [_jsx("span", { className: "snake-score-label", children: "Score" }), _jsx("span", { className: "snake-score-value", children: score })] }), _jsxs("div", { className: "snake-score-item", children: [_jsx("span", { className: "snake-score-label", children: "Best" }), _jsx("span", { className: "snake-score-value", children: best })] })] }), _jsxs("div", { className: "snake-board", style: { "--cols": COLS, "--rows": ROWS }, "aria-label": "Snake game board", children: [Array.from({ length: ROWS }, (_, y) => Array.from({ length: COLS }, (_, x) => {
                                const type = cellType(x, y, snake, food);
                                return (_jsx("div", { className: `snake-cell snake-cell--${type}`, "aria-hidden": "true" }, `${x}-${y}`));
                            })), state !== "running" && (_jsxs("div", { className: "snake-overlay", children: [state === "dead" && (_jsxs("p", { className: "snake-overlay-score", children: ["Score: ", score] })), _jsxs("button", { className: "btn-primary snake-play-btn", onClick: togglePlay, children: [state === "idle" ? "▶  Start" : null, state === "paused" ? "▶  Resume" : null, state === "dead" ? "↺  Restart" : null] })] }))] }), _jsx("p", { className: "snake-status", children: statusLabel[state] }), _jsxs("div", { className: "snake-info", children: [_jsxs("section", { className: "snake-info-section", children: [_jsx("h2", { children: "Rules" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Guide the snake to eat the ", _jsx("span", { className: "snake-chip snake-chip--food", children: "food" }), "."] }), _jsx("li", { children: "Each piece of food grows the snake by one segment and adds 1 point." }), _jsx("li", { children: "The snake wraps around the edges \u2014 passing through a wall exits the other side." }), _jsx("li", { children: "Running into your own body ends the game." }), _jsx("li", { children: "Speed increases by a small amount every 5 food eaten." })] })] }), _jsxs("section", { className: "snake-info-section", children: [_jsx("h2", { children: "Controls" }), _jsx("table", { className: "snake-controls-table", children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("kbd", { children: "\u2191" }), " / ", _jsx("kbd", { children: "W" })] }), _jsx("td", { children: "Move up" })] }), _jsxs("tr", { children: [_jsxs("td", { children: [_jsx("kbd", { children: "\u2193" }), " / ", _jsx("kbd", { children: "S" })] }), _jsx("td", { children: "Move down" })] }), _jsxs("tr", { children: [_jsxs("td", { children: [_jsx("kbd", { children: "\u2190" }), " / ", _jsx("kbd", { children: "A" })] }), _jsx("td", { children: "Move left" })] }), _jsxs("tr", { children: [_jsxs("td", { children: [_jsx("kbd", { children: "\u2192" }), " / ", _jsx("kbd", { children: "D" })] }), _jsx("td", { children: "Move right" })] }), _jsxs("tr", { children: [_jsxs("td", { children: [_jsx("kbd", { children: "Space" }), " / ", _jsx("kbd", { children: "Enter" })] }), _jsx("td", { children: "Start \u00B7 Pause \u00B7 Resume \u00B7 Restart" })] })] }) })] })] })] })] }));
}
//# sourceMappingURL=SnakePage.js.map