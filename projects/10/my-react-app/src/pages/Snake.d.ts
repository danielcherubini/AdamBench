import './Snake.css';
/**
 * Simple Snake game – public page (no auth required)
 *
 * Controls: Arrow keys – move the snake
 *   Eat the red food to grow
 *   Game ends when the snake hits the wall or itself
 *
 * Implementation notes:
 *   • All hooks are declared in a fixed order to satisfy the Rules of Hooks.
 *   • Refs are grouped together, then state, then effects.
 *   • Every state update is guarded by an `isMounted` ref to prevent
 *     “destroy” errors when the component unmounts.
 *   • The drawing routine safely checks the 2‑D context before using it.
 */
declare const SnakeGame: () => any;
export default SnakeGame;
//# sourceMappingURL=Snake.d.ts.map