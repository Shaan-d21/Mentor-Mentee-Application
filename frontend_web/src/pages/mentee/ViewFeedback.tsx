import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, ChevronDown, Brain, FileText, CheckCircle, AlertCircle, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

interface Domain {
  id: number;
  name: string;
  status: string;
}

interface Feedback {
  feedback_id: number;
  mentee_id: number;
  mentor_id: number;
  domain_id: number;
  feedback: string;
  mentor_name: string;
  domain_name: string;
}

interface FeedbackResponse {
  status_code: number;
  Message: string;
  "Feedback List": Feedback[];
}

interface AnalysisResponse {
  status_code: number;
  message: string;
  data: {
    "feedback id": number;
    "key takeaways": string[];
    "improvement areas": string[];
    "action items": string[];
  };
}

const ViewFeedback: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingFeedbackId, setAnalyzingFeedbackId] = useState<number | null>(null);
  const [summarizingFeedbackId, setSummarizingFeedbackId] = useState<number | null>(null);
  const [activeResult, setActiveResult] = useState<{id: number, type: 'analysis' | 'summary'} | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<number, AnalysisResponse['data']>>({});
  const [summaryResults, setSummaryResults] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mentee/Requests`,
        {
          headers: { 
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Requests response:', response.data);
      
      // Initialize empty arrays for requests
      let requests: any[] = [];
      
      // Check if response.data is an object and has the expected structure
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          requests = response.data;
        } else if (response.data.object && Array.isArray(response.data.object)) {
          requests = response.data.object;
        } else if (response.data.requests && Array.isArray(response.data.requests)) {
          requests = response.data.requests;
        }
      }
      
      console.log('Processed requests:', requests);
      
      // Filter requests for approved status
      const approvedRequests = requests.filter(req => req.status === 'approved');
      console.log('Approved requests:', approvedRequests);
      
      // Extract domains from approved requests
      const approvedDomains = approvedRequests.map(req => ({
        id: req.domain_id,
        name: req.domain_name || req.domain,
        status: req.status
      }));
      
      console.log('Approved domains:', approvedDomains);
      
      setDomains(approvedDomains);
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to fetch domains');
    } finally {
      setLoading(false);
    }
  };

  const handleDomainSelect = async (domain: Domain) => {
    setSelectedDomain(domain);
    setFeedbacks([]);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.get<FeedbackResponse>(
        `${import.meta.env.VITE_API_URL}/feedbacks/view`,
        {
          headers: { 
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data && response.data["Feedback List"]) {
        // Filter feedbacks for the selected domain
        const domainFeedbacks = response.data["Feedback List"].filter(
          fb => fb.domain_name === domain.name
        );
        setFeedbacks(domainFeedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to fetch feedbacks');
    }
  };

  const handleAnalyze = async (feedbackId: number, menteeId: number) => {
    setAnalyzingFeedbackId(feedbackId);
    setActiveResult(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.get<AnalysisResponse>(
        `${import.meta.env.VITE_AI_API_URL}/mentee/feedback/${menteeId}/${feedbackId}`,
        {
          headers: { 
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data && response.data.data) {
        setAnalysisResults(prev => ({
          ...prev,
          [feedbackId]: response.data.data
        }));
        setActiveResult({ id: feedbackId, type: 'analysis' });
        toast.success('Analysis completed successfully');
      }
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      toast.error('Failed to analyze feedback');
    } finally {
      setAnalyzingFeedbackId(null);
    }
  };

  const handleSummarize = async (feedbackId: number, feedbackText: string) => {
    setSummarizingFeedbackId(feedbackId);
    setActiveResult(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.post<string>(
        `${import.meta.env.VITE_AI_API_URL}/summarize`,
        {
          text: feedbackText
        },
        {
          headers: { 
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data) {
        setSummaryResults(prev => ({
          ...prev,
          [feedbackId]: response.data
        }));
        setActiveResult({ id: feedbackId, type: 'summary' });
        toast.success('Summary generated successfully');
      } else {
        throw new Error('Empty response received');
      }
    } catch (error) {
      console.error('Error summarizing feedback:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate summary');
    } finally {
      setSummarizingFeedbackId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8">View Feedback</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Domain
          </label>
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              value={selectedDomain?.name || ''}
              onChange={(e) => {
                const domain = domains.find(d => d.name === e.target.value);
                if (domain) handleDomainSelect(domain);
              }}
            >
              <option value="">Select a domain</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.name}>
                  {domain.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {selectedDomain && (
          <div className="mt-6">
            {feedbacks.length > 0 ? (
              <div className="space-y-6">
                {/* Mentor Name Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Feedback from {feedbacks[0].mentor_name}
                  </h3>
                </div>

                {/* Feedback Cards */}
                <div className="grid gap-4">
                  {feedbacks.map((feedback) => (
                    <div 
                      key={feedback.feedback_id} 
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <p className="text-gray-700 leading-relaxed mb-4">{feedback.feedback}</p>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => handleAnalyze(feedback.feedback_id, feedback.mentee_id)}
                          disabled={analyzingFeedbackId === feedback.feedback_id || summarizingFeedbackId === feedback.feedback_id}
                          className="flex items-center px-4 py-2 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {analyzingFeedbackId === feedback.feedback_id ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="w-5 h-5 mr-2" />
                              Analyze
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleSummarize(feedback.feedback_id, feedback.feedback)}
                          disabled={summarizingFeedbackId === feedback.feedback_id || analyzingFeedbackId === feedback.feedback_id}
                          className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {summarizingFeedbackId === feedback.feedback_id ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Summarizing...
                            </>
                          ) : (
                            <>
                              <FileText className="w-5 h-5 mr-2" />
                              Summarize
                            </>
                          )}
                        </button>
                      </div>

                      {/* Analysis Results */}
                      {!analyzingFeedbackId && activeResult?.id === feedback.feedback_id && activeResult.type === 'analysis' && analysisResults[feedback.feedback_id] && (
                        <div className="mt-4 space-y-4">
                          {/* Key Takeaways Section */}
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="flex items-center mb-3">
                              <div className="bg-green-100 p-2 rounded-full mr-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                              <h4 className="text-lg font-semibold text-green-800">Key Takeaways</h4>
                            </div>
                            <ul className="space-y-2 pl-6">
                              {analysisResults[feedback.feedback_id]["key takeaways"].map((item, index) => (
                                <li key={index} className="text-green-700 flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Improvement Areas Section */}
                          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                            <div className="flex items-center mb-3">
                              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                              </div>
                              <h4 className="text-lg font-semibold text-yellow-800">Improvement Areas</h4>
                            </div>
                            <ul className="space-y-2 pl-6">
                              {analysisResults[feedback.feedback_id]["improvement areas"].map((item, index) => (
                                <li key={index} className="text-yellow-700 flex items-start">
                                  <span className="text-yellow-500 mr-2">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Action Items Section */}
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center mb-3">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <ClipboardList className="w-5 h-5 text-blue-600" />
                              </div>
                              <h4 className="text-lg font-semibold text-blue-800">Action Items</h4>
                            </div>
                            <ul className="space-y-2 pl-6">
                              {analysisResults[feedback.feedback_id]["action items"].map((item, index) => (
                                <li key={index} className="text-blue-700 flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Summary Results */}
                      {!summarizingFeedbackId && activeResult?.id === feedback.feedback_id && activeResult.type === 'summary' && summaryResults[feedback.feedback_id] && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center mb-3">
                            <div className="bg-gray-100 p-2 rounded-full mr-3">
                              <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Summary</h4>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{summaryResults[feedback.feedback_id]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No feedback has been received in this domain yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFeedback; 