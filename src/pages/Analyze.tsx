import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { analyzeNews } from '../services/geminiService';
import { db, auth } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'motion/react';

export default function Analyze() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeNews(text);
      
      // Save to history
      const analysisData = {
        userId: auth.currentUser?.uid,
        newsText: text,
        prediction: result.prediction,
        confidence: result.confidence,
        explanation: result.explanation,
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, 'analyses'), analysisData);
      
      // Navigate to result page with data
      navigate('/result', { state: { result, text } });
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze the news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Analyze News</h2>
              <p className="text-slate-500">Paste the news article or text you want to verify.</p>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste news text here (minimum 50 characters)..."
                className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none text-slate-700 placeholder:text-slate-400"
                required
                minLength={50}
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                {text.length} characters
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || text.length < 50}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  <span>Analyze Now</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
