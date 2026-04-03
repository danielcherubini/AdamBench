import '@testing-library/jest-dom';
import { vi } from 'vitest';
// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
// Mock matchMedia globally
vi.stubGlobal('matchMedia', window.matchMedia);
//# sourceMappingURL=setup.js.map