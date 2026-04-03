"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("./context/AuthContext");
const ProtectedContext_1 = __importDefault(require("./context/ProtectedContext"));
const protectedRouteService_1 = require("./services/protectedRouteService");
const LoginPage_1 = __importDefault(require("./pages/LoginPage"));
const RegisterPage_1 = __importDefault(require("./pages/RegisterPage"));
const ProtectedRoutePage_1 = __importDefault(require("./pages/ProtectedRoutePage"));
const DashboardPage_1 = __importDefault(require("./pages/DashboardPage"));
require("./styles/main.css");
function App() {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
    });
    const handleLogin = async (credentials) => {
        async;
        mockAuth.login(credentials);
    };
    return path = "/login";
    element = {}
        < LoginPage_1.default;
    handleLogin = { handleLogin };
    onSubmit = { async() { } };
    {
        await handleLogin({ username: '', password: '' });
    }
}
/>;
/>
    < react_router_dom_1.Route;
path = "/register";
element = {}
    < RegisterPage_1.default;
handleLogin = { handleLogin };
onSubmit = { async() { } };
{
    await handleLogin({ username: '', password: '' });
}
/>;
/>
    < react_router_dom_1.Route;
element = {}
    < ProtectedRoutePage_1.default;
handleLogin = { handleLogin };
handleLogout = { async() { } };
{
    await protectedRouteService_1.protectedRouteService.checkAuth();
    await ();
    {
        // Call logout from AuthContext
    }
    ;
    // Reset protected route page
    window.location.href = '/login';
}
;
/>;
;
/>
    < react_router_dom_1.Route;
path = "/dashboard";
element = {
    DashboardPage: DashboardPage_1.default,
    handleLogout = { async() { },
        await: protectedRouteService_1.protectedRouteService.checkAuth(),
        await() { }
    },
    window, : .location.href = '/login'
};
;
/>;
;
/>
    < react_router_dom_1.Route;
path = "/";
element = { DashboardPage: DashboardPage_1.default } /  >
    /Routes>
    < /ProtectedContext>
    < /AuthProvider>
    < /Router>;
;
;
;
exports.default = App;
//# sourceMappingURL=App.tsx.js.map