
import React, { useState, useEffect } from 'react';
import { generateConstructionEstimate } from '../services/geminiService.ts';
import { EstimateItem } from '../types.ts';
import { Calculator, Sparkles, Download, RefreshCw, WifiOff } from 'lucide-react';

const AIEstimator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [estimate, setEstimate] = useState<EstimateItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const h = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', h); window.addEventListener('offline', h);
    return () => { window.removeEventListener('online', h); window.removeEventListener('offline', h); };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || !isOnline) return;
    setLoading(true); setEstimate(null);
    try { const items = await generateConstructionEstimate(prompt); setEstimate(items); } catch (e) {} finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">AI Cost Estimator</h1>
      <div className="bg-white p-6 rounded-xl border shadow-lg">
        <textarea className="w-full h-32 p-4 border rounded-lg" placeholder="Describe project..." value={prompt} onChange={e => setPrompt(e.target.value)} />
        <button onClick={handleGenerate} className="w-full mt-4 bg-orange-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="animate-spin"/> : <Sparkles/>} {loading ? 'Generating...' : 'Generate Estimate'}
        </button>
      </div>
      {estimate && (
          <div className="bg-white rounded border overflow-hidden">
              <table className="w-full text-sm">
                  <thead className="bg-slate-100"><tr><th>Desc</th><th>Qty</th><th>Unit</th><th className="text-right">Price</th></tr></thead>
                  <tbody>{estimate.map((i, idx) => <tr key={idx} className="border-t"><td>{i.description}</td><td>{i.quantity}</td><td>{i.unit}</td><td className="text-right">₹{i.unitPrice}</td></tr>)}</tbody>
              </table>
          </div>
      )}
    </div>
  );
};

export default AIEstimator;
