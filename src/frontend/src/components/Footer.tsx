import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border px-6 py-3 text-center text-sm text-muted-foreground">
      © 2026. Built with <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> using{' '}
      <a 
        href="https://caffeine.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-foreground hover:underline font-medium"
      >
        caffeine.ai
      </a>
    </footer>
  );
}
