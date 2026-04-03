import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component, Error as ReactError } from 'react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { style: { padding: '2rem', color: 'red' }, children: [_jsx("h2", { children: "Something went wrong." }), _jsxs("details", { style: { marginTop: '0.5rem' }, children: [_jsx("summary", { children: "View details" }), this.state.error] })] }));
        }
        return this.props.children;
    }
}
// Default export for React to pick up
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map