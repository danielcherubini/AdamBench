"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const AuthContext_1 = require("../context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
const ProfilePage = () => {
    const { profile, updateProfile } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [name, setName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
        }
    }, [profile]);
    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile({ name, email });
        setMessage('Profile updated successfully');
    };
    const goBack = () => navigate('/dashboard');
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.container, children: [(0, jsx_runtime_1.jsx)("h2", { children: "User Profile" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, style: styles.form, children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Name", value: name, onChange: (e) => setName(e.target.value), style: styles.input, required: true }), (0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), style: styles.input, required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", style: styles.button, children: "Save" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: goBack, style: styles.button, children: "Back" }), message && (0, jsx_runtime_1.jsx)("p", { style: styles.success, children: message })] })] }));
};
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '40px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        gap: '10px',
    },
    input: {
        padding: '8px',
        fontSize: '1rem',
    },
    button: {
        padding: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    success: {
        color: 'green',
        marginTop: '10px',
    },
};
exports.default = ProfilePage;
//# sourceMappingURL=ProfilePage.js.map