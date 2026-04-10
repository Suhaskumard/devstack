import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Github, LayoutTemplate } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] animate-fade-in text-center max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
        <Sparkles className="w-4 h-4" />
        <span>AI-Powered Portfolio Generation</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
        Turn your GitHub into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">stunning portfolio</span>
      </h1>
      
      <p className="text-lg md:text-xl text-textMuted mb-12 max-w-2xl mx-auto leading-relaxed">
        DevStack analyzes your repositories, understands your skills using AI, 
        and automatically generates a production-ready developer portfolio in seconds.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-slide-up">
        <Link to="/input" className="btn-primary flex items-center justify-center gap-2">
          Generate Portfolio <ArrowRight className="w-5 h-5" />
        </Link>
        <Link to="/about" className="btn-secondary">
          How it works
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full text-left">
        <div className="glass-card p-6">
          <Github className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Automated Data Fetch</h3>
          <p className="text-textMuted text-sm">Pulls repositories, languages, and stars directly from your GitHub profile instantly.</p>
        </div>
        <div className="glass-card p-6">
          <Sparkles className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
          <p className="text-textMuted text-sm">Analyzes your tech stack to highlight strengths and recommend areas to improve.</p>
        </div>
        <div className="glass-card p-6">
          <LayoutTemplate className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Beautiful Output</h3>
          <p className="text-textMuted text-sm">Compiles everything into a clean, modern webpage you can share with recruiters.</p>
        </div>
      </div>
    </div>
  );
}
