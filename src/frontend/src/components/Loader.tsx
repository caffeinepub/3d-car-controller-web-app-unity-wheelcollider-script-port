export function Loader() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-muted border-t-foreground rounded-full animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground">Loading 3D scene...</p>
      </div>
    </div>
  );
}
