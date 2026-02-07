import { X, Keyboard } from 'lucide-react';

interface HelpOverlayProps {
  onClose: () => void;
}

export function HelpOverlay({ onClose }: HelpOverlayProps) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-card border border-border rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Keyboard className="w-6 h-6 text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Controls</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-accent transition-colors"
            aria-label="Close help"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <ControlItem 
            keys={['W', '↑']} 
            description="Accelerate forward" 
            unity="Vertical (positive)"
          />
          <ControlItem 
            keys={['S', '↓']} 
            description="Reverse" 
            unity="Vertical (negative)"
          />
          <ControlItem 
            keys={['A', '←']} 
            description="Steer left" 
            unity="Horizontal (negative)"
          />
          <ControlItem 
            keys={['D', '→']} 
            description="Steer right" 
            unity="Horizontal (positive)"
          />
          <ControlItem 
            keys={['Space']} 
            description="Brake" 
            unity="Space key"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            This demo replicates Unity's WheelCollider physics with rear-wheel drive, 
            front-wheel steering, and realistic drag simulation.
          </p>
        </div>
      </div>
    </div>
  );
}

interface ControlItemProps {
  keys: string[];
  description: string;
  unity: string;
}

function ControlItem({ keys, description, unity }: ControlItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex gap-2 min-w-[100px]">
        {keys.map((key) => (
          <kbd 
            key={key}
            className="px-3 py-1.5 bg-muted border border-border rounded text-sm font-mono text-foreground"
          >
            {key}
          </kbd>
        ))}
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground font-medium">{description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Unity: {unity}</p>
      </div>
    </div>
  );
}
