import { Link } from 'react-router-dom';
import { Code2, Github } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-white/5 z-50 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-textMain hover:text-primary transition-colors">
        <Code2 className="w-6 h-6 text-primary" />
        <span className="font-bold text-xl tracking-tight">DevStack</span>
      </Link>
      <div className="flex gap-6 text-sm font-medium text-textMuted">
        <Link to="/about" className="hover:text-textMain transition-colors">About</Link>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-textMain transition-colors">
          <Github className="w-4 h-4" /> Repo
        </a>
      </div>
    </nav>
  );
}
