import { Settings, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onToggleHelp: () => void;
  onToggleSettings: () => void;
}

export function Header({ onToggleHelp, onToggleSettings }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img 
          src="/assets/generated/app-logo.dim_512x512.png" 
          alt="Logo" 
          className="w-10 h-10 rounded-lg"
        />
        <div>
          <h1 className="text-xl font-bold text-foreground">3D Car Controller</h1>
          <p className="text-xs text-muted-foreground">Unity WheelCollider Physics Demo</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleHelp}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Toggle help"
        >
          <HelpCircle className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={onToggleSettings}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Toggle settings"
        >
          <Settings className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
}
