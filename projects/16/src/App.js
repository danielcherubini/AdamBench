import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SnakePage } from './pages/SnakePage';
import { ProtectedRoute } from './ProtectedRoute';
const App = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/snake", element: _jsx(SnakePage, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/snake", replace: true }) })] }));
};
export default App;
//# sourceMappingURL=App.js.map