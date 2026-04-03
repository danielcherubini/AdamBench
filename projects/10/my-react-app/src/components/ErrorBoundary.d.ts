import { Component, Error as ReactError } from 'react';
type Props = {
    children: React.ReactNode;
};
type State = {
    hasError: boolean;
    error?: ReactError;
};
export declare class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props);
    static getDerivedStateFromError(error: ReactError): {
        hasError: boolean;
        error: ReactError;
    };
    componentDidCatch(error: Error, info: any): void;
    render(): any;
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map