export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
}

export interface NewsAnalysis {
  id: string;
  userId: string;
  newsText: string;
  prediction: 'Real' | 'Fake';
  confidence: number;
  explanation: string;
  timestamp: string;
}

export interface AnalysisResult {
  prediction: 'Real' | 'Fake';
  confidence: number;
  explanation: string;
}
