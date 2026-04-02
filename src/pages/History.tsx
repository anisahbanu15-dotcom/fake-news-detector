import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { NewsAnalysis } from '../types';
import { History, Calendar, AlertTriangle, CheckCircle, ChevronRight, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<NewsAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsAnalysis[];
      setAnalyses(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAnalyses = analyses.filter(a => 
    a.newsText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.prediction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
            <History className="w-8 h-8 text-blue-600" />
            <span>Analysis History</span>
          </h2>
          <p className="text-slate-500 mt-1">Review your previous news authenticity checks.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all w-full md:w-80"
          />
        </div>
      </div>

      {filteredAnalyses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No history found</h3>
          <p className="text-slate-500">
            {searchTerm ? "No results match your search." : "You haven't analyzed any news yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAnalyses.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1",
                        analysis.prediction === 'Real' 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      )}>
                        {analysis.prediction === 'Real' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{analysis.prediction}</span>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(analysis.timestamp).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <p className="text-slate-900 font-medium line-clamp-2 mb-2">
                      {analysis.newsText}
                    </p>
                    <p className="text-slate-500 text-sm line-clamp-1 italic">
                      {analysis.explanation}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between self-stretch">
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{Math.round(analysis.confidence * 100)}%</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Confidence</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
