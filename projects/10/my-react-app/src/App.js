import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import ProfilePage from './pages/Profile';
import SnakeGame from './pages/Snake';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/snake", element: _jsx(ErrorBoundary, { children: _jsx(SnakeGame, {}) }) }), _jsx(Route, { path: "*", element: _jsx(LoginPage, {}) })] }) }) }));
}
export default App;
//# sourceMappingURL=App.js.map