import React, { useState, useEffect } from 'react';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';
import { Sparkles, Loader } from 'lucide-react';

const AISummary = ({ appointmentId }) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const generateSummary = async () => {
    try {
      setLoading(true);
      const data = await aiService.generateSummary(appointmentId);
      setSummary(data.summary);
      toast.success('AI summary generated');
    } catch (error) {
      toast.error('Failed to generate AI summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSummary();
  }, [appointmentId]);

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 mb-6">
      <div className="flex items-center mb-4">
        <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">AI-Generated Summary</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 text-purple-600 animate-spin" />
          <span className="ml-3 text-gray-600">Generating AI summary...</span>
        </div>
      ) : summary ? (
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No AI summary available</p>
          <button
            onClick={generateSummary}
            className="btn-primary"
          >
            Generate Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default AISummary;
