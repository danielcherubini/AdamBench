import type { FormEvent } from "react";
export type SaveStatus = "idle" | "saving" | "success" | "error";
export declare function useProfile(): {
    name: any;
    setName: any;
    email: any;
    setEmail: any;
    isDirty: boolean;
    saveStatus: any;
    errorMessage: any;
    handleSubmit: (e: FormEvent) => Promise<void>;
    handleReset: () => void;
};
//# sourceMappingURL=useProfile.d.ts.map