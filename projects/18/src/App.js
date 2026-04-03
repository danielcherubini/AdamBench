import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './auth';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { Profile } from './Profile';
import { SnakeGame } from './SnakeGame';
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/snake", element: _jsx(SnakeGame, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(RequireAuth, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(RequireAuth, { children: _jsx(Profile, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) }) }));
}
//# sourceMappingURL=App.js.map