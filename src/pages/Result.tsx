import { useLocation, Link, Navigate } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, ArrowLeft, Info } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export default function Result() {
  const location = useLocation();
  const { result, text } = location.state || {};

  if (!result) {
    return <Navigate to="/analyze" replace />;
  }

  const isFake = result.prediction === 'Fake';
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
      >
        <Link to="/analyze" className="inline-flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Analysis</span>
        </Link>

        <div className={cn(
          "rounded-3xl p-8 md:p-12 border shadow-xl",
          isFake ? "bg-red-50 border-red-100 shadow-red-100" : "bg-green-50 border-green-100 shadow-green-100"
        )}>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className={cn(
                "w-20 h-20 rounded-3xl flex items-center justify-center mb-6",
                isFake ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              )}>
                {isFake ? <AlertTriangle className="w-12 h-12" /> : <CheckCircle className="w-12 h-12" />}
              </div>
              <h2 className={cn(
                "text-4xl font-black mb-2",
                isFake ? "text-red-900" : "text-green-900"
              )}>
                {isFake ? "Likely Fake News" : "Likely Real News"}
              </h2>
              <p className={cn(
                "text-lg font-medium",
                isFake ? "text-red-700" : "text-green-700"
              )}>
                Confidence Level: {confidencePercent}%
              </p>
            </div>

            <div className="w-full md:w-64 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Reliability</span>
                <span className="text-sm font-bold text-slate-900">{confidencePercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePercent}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={cn(
                    "h-full rounded-full",
                    isFake ? "bg-red-500" : "bg-green-500"
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-4 text-slate-900">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold">AI Explanation</h3>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
              <ReactMarkdown>{result.explanation}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Original Text</h3>
          <p className="text-slate-500 text-sm line-clamp-6 italic leading-relaxed">
            "{text}"
          </p>
        </div>
      </motion.div>
    </div>
  );
}
