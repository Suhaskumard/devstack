import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGithubData, uploadResume } from '../services/api';
import { Github, Loader2, FileText } from 'lucide-react';

export default function GithubInputPage() {
  const [username, setUsername] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      let parsedResumeText = null;
      if (resumeFile) {
        try {
          parsedResumeText = await uploadResume(resumeFile);
        } catch (uploadErr) {
          console.error("Resume parsing failed", uploadErr);
          // Non blocking error, we can still fetch github data
        }
      }

      const data = await fetchGithubData(username);
      if (parsedResumeText) {
        data.resume_text = parsedResumeText;
      }
      // For a simple app without Redux/Context, localStorage is great for passing data
      localStorage.setItem('devstack_github_data', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Could not fetch data. Please check the username and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 glass-card animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-primary/10 rounded-full">
          <Github className="w-10 h-10 text-primary" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-2">Connect GitHub</h2>
      <p className="text-textMuted text-center mb-8">Enter your username to fetch repositories and analyze your skills.</p>
      
      <form onSubmit={handleFetch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-2">GitHub Username</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. torvalds"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-textMuted mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Optional: Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            className="input-field text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary/90"
            onChange={(e) => setResumeFile(e.target.files[0])}
            disabled={loading}
          />
        </div>
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2"
          disabled={loading || !username.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Fetching...
            </>
          ) : (
            'Analyze Profile'
          )}
        </button>
      </form>
    </div>
  );
}
