import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { ProtectedRoute } from './components';
import { LoginPage, DashboardPage, ProfilePage, SnakePage } from './pages';
const App = () => {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/snake", element: _jsx(SnakePage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/", element: _jsx(SnakePage, {}) }), _jsx(Route, { path: "*", element: _jsx(SnakePage, {}) })] }) }) }));
};
export default App;
//# sourceMappingURL=App.js.map