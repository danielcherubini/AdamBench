import React from 'react';
interface LoginFormProps {
    onLogin: (email: string, password: string) => Promise<any>;
    isLoading?: boolean;
}
declare const LoginForm: React.FC<LoginFormProps>;
export default LoginForm;
//# sourceMappingURL=LoginForm.d.ts.map