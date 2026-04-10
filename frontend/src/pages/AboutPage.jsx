import { Heart, Code2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 animate-fade-in text-center">
      <div className="flex justify-center mb-8">
        <div className="p-4 bg-primary/10 rounded-full">
          <Code2 className="w-12 h-12 text-primary" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-6">About DevStack</h1>
      <p className="text-xl text-textMuted mb-12 leading-relaxed">
        DevStack is an AI-powered Developer Portfolio Generator designed to help 
        engineers showcase their work beautifully, easily, and instantly.
      </p>
      
      <div className="glass-card text-left p-8 space-y-6 mb-12">
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">Tech Stack</h3>
          <p className="text-textMuted">Built with React, Vite, Tailwind CSS on the frontend, and FastAPI with Python on the backend. It integrates the GitHub REST API and OpenAI's GPT models for intelligent analysis and generation.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">The Goal</h3>
          <p className="text-textMuted">To remove the friction from creating a portfolio. Developers often build amazing things but don't market themselves well. DevStack solves this by transforming raw code statistics into an elegant narrative.</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-textMuted font-medium">
        Built with <Heart className="w-5 h-5 text-red-500 fill-current" /> by the AI Engineer
      </div>
    </div>
  );
}
