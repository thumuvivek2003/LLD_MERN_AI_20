/** Tiny conditional-className joiner. Keeps JSX readable without a dependency. */
export const cx = (...parts) => parts.filter(Boolean).join(' ');

export default cx;
