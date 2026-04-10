import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePortfolio } from '../services/api';
import { Loader2, ExternalLink, Github, Mail, Code2, MapPin } from 'lucide-react';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      const stored = localStorage.getItem('devstack_github_data');
      if (!stored) {
        navigate('/input');
        return;
      }

      const parsedData = JSON.parse(stored);
      setData(parsedData);

      try {
        const response = await generatePortfolio(parsedData);
        setPortfolio(response);
      } catch (err) {
        console.error("Failed to generate portfolio", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [navigate]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-bold mb-2">Crafting your portfolio</h2>
        <p className="text-textMuted">Compiling projects and generating your AI bio...</p>
      </div>
    );
  }

  if (!portfolio) {
    return <div className="text-center mt-20 text-red-400">Failed to generate portfolio. Please try again.</div>;
  }

  const { user } = data;

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in relative">
      {/* Decorative Blob */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-20 pt-10">
        <div className="shrink-0 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-300 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <img src={user.avatar_url} alt="Profile" className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-surface object-cover shadow-2xl" />
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="inline-block px-4 py-1.5 rounded-full bg-surface border border-white/10 text-primary font-medium text-sm mb-6">
            Available for work
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">{user.name || user.login}</h1>
          <p className="text-xl md:text-2xl text-textMuted mb-8 leading-relaxed max-w-2xl">
            {portfolio.bio}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
            <a href={user.html_url} target="_blank" rel="noreferrer" className="btn-primary flex items-center gap-2 px-6">
              <Github className="w-5 h-5" /> GitHub Profile
            </a>
            {/* Added mock contact button for realness */}
            <a href={`mailto:${user.email || 'hello@' + user.login + '.com'}`} className="btn-secondary flex items-center gap-2 px-6">
              <Mail className="w-5 h-5" /> Contact Me
            </a>
            <button onClick={() => navigate('/')} className="px-4 py-2 hover:bg-white/5 rounded-xl transition-colors text-textMuted hover:text-textMain text-sm font-medium">
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Auto-Summary */}
      <div className="glass-card p-10 mb-20 text-center relative overflow-hidden">
        <Code2 className="absolute -right-10 -bottom-10 w-48 h-48 text-white/[0.03] rotate-12" />
        <h2 className="text-xl text-primary font-bold mb-4 uppercase tracking-widest">Technical Expertise</h2>
        <p className="text-2xl md:text-3xl font-medium leading-tight max-w-3xl mx-auto">
          "{portfolio.skill_summary}"
        </p>
      </div>

      {/* Top Projects Section */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.highlighted_projects.map(repo => (
            <div key={repo.name} className="glass-card hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full group relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="p-6 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                   <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{repo.name}</h3>
                   <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-textMuted hover:text-white">
                     <ExternalLink className="w-5 h-5" />
                   </a>
                 </div>
                 <p className="text-textMuted mb-6 flex-1">{repo.description || 'No description provided.'}</p>
                 
                 <div className="flex items-center justify-between mt-auto">
                   {repo.language ? (
                     <div className="flex items-center gap-2">
                       <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                       <span className="text-sm text-textMuted">{repo.language}</span>
                     </div>
                   ) : <span></span>}
                   
                   <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium bg-yellow-400/10 px-2 py-1 rounded-md">
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                     {repo.stargazers_count}
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
