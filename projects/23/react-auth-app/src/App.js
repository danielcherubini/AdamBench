import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SnakePage } from "./pages/SnakePage";
import { NotFoundPage } from "./pages/NotFoundPage";
function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading)
        return _jsx("div", { className: "loading-screen", children: _jsx("div", { className: "spinner" }) });
    return isAuthenticated ? _jsx(Outlet, {}) : _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
}
function PublicRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading)
        return _jsx("div", { className: "loading-screen", children: _jsx("div", { className: "spinner" }) });
    return isAuthenticated ? _jsx(Navigate, { to: "/dashboard", replace: true }) : _jsx(Outlet, {});
}
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "/snake", element: _jsx(SnakePage, {}) }), _jsx(Route, { element: _jsx(PublicRoute, {}), children: _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }) }));
}
//# sourceMappingURL=App.js.map