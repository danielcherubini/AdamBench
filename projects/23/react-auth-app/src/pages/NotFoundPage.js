import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
export function NotFoundPage() {
    const navigate = useNavigate();
    return (_jsx("div", { className: "auth-wrapper", children: _jsxs("div", { className: "notfound-card", children: [_jsx("p", { className: "notfound-code", children: "404" }), _jsx("h2", { children: "Page not found" }), _jsx("p", { className: "auth-subtitle", children: "The page you're looking for doesn't exist." }), _jsx("button", { className: "btn-primary", onClick: () => navigate(-1), children: "Go back" })] }) }));
}
//# sourceMappingURL=NotFoundPage.js.map