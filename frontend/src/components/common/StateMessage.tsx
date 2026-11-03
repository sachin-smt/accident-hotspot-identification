export function StateMessage({ kind, message }: { kind: 'loading' | 'error' | 'empty'; message: string }) {
  return <div className={`state-message ${kind}`} role={kind === 'error' ? 'alert' : undefined}>{message}</div>;
}
