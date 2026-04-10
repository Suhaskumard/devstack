import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAiSuggestions } from '../services/api';
import { Lightbulb, TrendingUp, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

export default function AiInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsights = async () => {
      const stored = localStorage.getItem('devstack_github_data');
      if (!stored) {
        navigate('/input');
        return;
      }

      const data = JSON.parse(stored);
      try {
        const response = await getAiSuggestions(data);
        setInsights(response);
      } catch (err) {
        console.error("Failed to fetch insights", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-textMuted text-lg">AI is analyzing your profile...</p>
      </div>
    );
  }

  if (!insights) {
    return <div className="text-center mt-20 text-red-400">Failed to load AI Insights. Please try again.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Lightbulb className="text-yellow-400 w-8 h-8" />
          AI Developer Insights
        </h1>
        <p className="text-textMuted">Based on deep analysis of your repositories and coding habits.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="glass-card p-8 border-t-4 border-t-primary">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-primary w-6 h-6" /> Strengths
          </h2>
          <ul className="space-y-4">
            {insights.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-3 bg-surface/50 p-4 rounded-lg">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="text-textMain">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-8 border-t-4 border-t-red-500">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="text-red-500 w-6 h-6" /> Growth Areas
          </h2>
          <ul className="space-y-4">
            {insights.growth_areas?.map((weak, i) => (
              <li key={i} className="flex items-start gap-3 bg-surface/50 p-4 rounded-lg">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                <span className="text-textMain">{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {insights.visualization_ideas && insights.visualization_ideas.length > 0 && (
        <div className="glass-card p-8 mb-12 border-t-4 border-t-purple-500 bg-gradient-to-br from-surface to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <h2 className="text-2xl font-bold mb-6 relative z-10 text-purple-400">Data Visualization Ideas</h2>
          <div className="space-y-4 relative z-10">
            {insights.visualization_ideas.map((idea, i) => (
               <div key={i} className="p-5 border border-white/10 rounded-xl bg-background/50 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">
                   {i + 1}
                 </div>
                 <p className="text-lg">{idea}</p>
               </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card p-8 bg-gradient-to-br from-surface to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <h2 className="text-2xl font-bold mb-6 relative z-10">AI Recommendations</h2>
        <div className="space-y-4 relative z-10">
          {insights.suggestions.map((sug, i) => (
             <div key={i} className="p-5 border border-white/10 rounded-xl bg-background/50 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                 {i + 1}
               </div>
               <p className="text-lg">{sug}</p>
             </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
         <button onClick={() => navigate('/portfolio')} className="btn-primary w-full md:w-auto text-lg px-8 py-4 flex items-center justify-center gap-2 mx-auto">
            View Final Portfolio <ArrowRight className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
}
