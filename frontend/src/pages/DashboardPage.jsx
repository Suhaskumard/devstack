import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, GitFork, BookOpen, Code, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('devstack_github_data');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      navigate('/input');
    }
  }, [navigate]);

  if (!data) return null;

  const { user, repos, languages, total_stars } = data;

  // Sort languages by count
  const sortedLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12 bg-surface/50 p-6 rounded-2xl border border-white/5">
        <img src={user.avatar_url} alt="Profile" className="w-24 h-24 rounded-full border-4 border-primary/20" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{user.name || user.login}</h1>
          <p className="text-textMuted">{user.bio || 'Developer on GitHub'}</p>
        </div>
        <div className="md:ml-auto">
          <button onClick={() => navigate('/insights')} className="btn-primary flex items-center gap-2">
            Ask AI for Insights <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <BookOpen className="w-8 h-8 text-primary mb-2" />
          <span className="text-3xl font-bold">{user.public_repos}</span>
          <span className="text-textMuted text-sm">Repositories</span>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <Star className="w-8 h-8 text-yellow-400 mb-2" />
          <span className="text-3xl font-bold">{total_stars}</span>
          <span className="text-textMuted text-sm">Total Stars</span>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <Code className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-3xl font-bold">{Object.keys(languages).length}</span>
          <span className="text-textMuted text-sm">Languages Used</span>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <GitFork className="w-8 h-8 text-purple-400 mb-2" />
          <span className="text-3xl font-bold">{repos.length}</span>
          <span className="text-textMuted text-sm">Source Repos</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Top Languages</h2>
      <div className="flex flex-wrap gap-4 mb-12">
        {sortedLanguages.map(([lang, count]) => (
          <div key={lang} className="px-6 py-3 bg-surface rounded-xl border border-white/5 flex items-center gap-3 shadow-lg">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="font-medium">{lang}</span>
            <span className="bg-background text-textMuted text-xs px-2 py-1 rounded-md">{count} repos</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-10 border-t border-white/10 pt-10">
        <button onClick={() => navigate('/portfolio')} className="btn-primary text-lg w-full md:w-auto px-10 py-4 shadow-primary/30">
          Generate Full Portfolio
        </button>
      </div>
    </div>
  );
}
