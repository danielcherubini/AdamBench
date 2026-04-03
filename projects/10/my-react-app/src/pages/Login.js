import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
const LoginPage = () => {
    const { login } = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        login();
    };
    return (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h2", { children: "Login" }), _jsx("form", { onSubmit: handleSubmit, children: _jsx("button", { type: "submit", children: "Fake Login" }) })] }));
};
export default LoginPage;
//# sourceMappingURL=Login.js.map