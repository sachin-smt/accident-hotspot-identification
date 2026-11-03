export function Unavailable({ title = 'Unavailable from current API' }: { title?: string }) {
  return <div className="unavailable"><strong>{title}</strong><span>This visualization needs accident-level fields that are not exposed by the read-only backend.</span></div>;
}
