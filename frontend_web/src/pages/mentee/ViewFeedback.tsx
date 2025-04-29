import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, ChevronDown, Brain, FileText, CheckCircle, AlertCircle, ClipboardList } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Domain {
  id: number;
  name: string;
  status: string;
}

interface Topic {
  id: number;
  name: string;
  feedback: string;
  mentor_name: string;
  mentee_id: number;
}

interface Feedback {
  feedback_id: number;
  mentee_id: number;
  mentor_id: number;
  domain_id: number;
  feedback: string;
  mentor_name: string;
  domain_name: string;
  topic_name: string;
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
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedTopicForModal, setSelectedTopicForModal] = useState<Topic | null>(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyzingFeedbackId, setAnalyzingFeedbackId] = useState<number | null>(null);
  const [summarizingFeedbackId, setSummarizingFeedbackId] = useState<number | null>(null);
  const [activeResult, setActiveResult] = useState<{ id: number; type: 'analysis' | 'summary' } | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<number, AnalysisResponse['data']>>({});
  const [summaryResults, setSummaryResults] = useState<Record<number, string>>({});
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

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
            Token: accessToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      let requests: any[] = [];
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          requests = response.data;
        } else if (response.data.object && Array.isArray(response.data.object)) {
          requests = response.data.object;
        } else if (response.data.requests && Array.isArray(response.data.requests)) {
          requests = response.data.requests;
        }
      }

      const approvedRequests = requests.filter((req) => req.status === 'approved');
      const approvedDomains = approvedRequests.map((req) => ({
        id: req.domain_id,
        name: req.domain_name || req.domain,
        status: req.status,
      }));

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
    setTopics([]);
    setSelectedTopic(null);
    setSelectedTopicForModal(null);
    setShowTopicModal(false);
    setActiveResult(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.get<FeedbackResponse>(
        `${import.meta.env.VITE_API_URL}/feedbacks/view`,
        {
          headers: {
            Token: accessToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.data && response.data['Feedback List']) {
        const domainFeedbacks = response.data['Feedback List'].filter((fb) => fb.domain_name === domain.name);
        const uniqueTopics = domainFeedbacks.reduce((acc: Topic[], feedback) => {
          const existingTopic = acc.find((t) => t.name === feedback.topic_name);
          if (!existingTopic) {
            acc.push({
              id: feedback.feedback_id,
              name: feedback.topic_name,
              feedback: feedback.feedback,
              mentor_name: feedback.mentor_name,
              mentee_id: feedback.mentee_id,
            });
          }
          return acc;
        }, []);

        setTopics(uniqueTopics);
        setFeedbacks(response.data['Feedback List']);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to fetch feedbacks');
    }
  };

  const handleAnalyze = async (feedbackId: number) => {
    setAnalyzingFeedbackId(feedbackId);
    setActiveResult(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const feedback = feedbacks.find((fb) => fb.feedback_id === feedbackId);
      if (!feedback) {
        throw new Error('Feedback not found');
      }

      const response = await axios.get<AnalysisResponse>(
        `${import.meta.env.VITE_AI_API_URL}/mentee/feedback/${feedback.mentee_id}/${feedbackId}`,
        {
          headers: {
            Token: accessToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.data && response.data.data) {
        setAnalysisResults((prev) => ({
          ...prev,
          [feedbackId]: response.data.data,
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
          text: feedbackText,
        },
        {
          headers: {
            Token: accessToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.data) {
        setSummaryResults((prev) => ({
          ...prev,
          [feedbackId]: response.data,
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

  const openTopicModal = (topic: Topic) => {
    setSelectedTopicForModal(topic);
    setShowTopicModal(true);
  };

  const closeTopicModal = () => {
    setShowTopicModal(false);
    setSelectedTopicForModal(null);
    setActiveResult(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-sm sm:text-base text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">View Feedback</h2>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          {/* Domain Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Domain</label>
            <div className="relative">
              <select
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer appearance-none"
                value={selectedDomain?.name || ''}
                onChange={(e) => {
                  const domain = domains.find((d) => d.name === e.target.value);
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
              <ChevronDown className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
          </div>

          {/* Topics List */}
          {selectedDomain && (
            <div className="mt-6">
              {topics.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Topics in {selectedDomain.name}
                  </h3>
                  {topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="group bg-white rounded-lg border border-gray-100 p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:scale-[1.01] hover:-translate-y-1 overflow-hidden"
                      onClick={() => (window.innerWidth <= 768 ? openTopicModal(topic) : setSelectedTopic(selectedTopic?.id === topic.id ? null : topic))}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-800 truncate">{topic.name}</h4>
                        {window.innerWidth > 768 && (
                          <ChevronDown
                            className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transform transition-transform duration-300 ${
                              selectedTopic?.id === topic.id ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </div>
                      {window.innerWidth > 768 && selectedTopic?.id === topic.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 transition-all duration-300">
                          <p className="text-sm text-gray-600 mb-3">by {topic.mentor_name}</p>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 max-h-40 overflow-y-auto">
                            {topic.feedback}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const feedback = feedbacks.find((fb) => fb.feedback_id === topic.id);
                                if (feedback) {
                                  handleAnalyze(topic.id);
                                }
                              }}
                              disabled={analyzingFeedbackId === topic.id || summarizingFeedbackId === topic.id}
                              className="cursor-pointer flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 text-sm sm:text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {analyzingFeedbackId === topic.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                  Analyze
                                </>
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSummarize(topic.id, topic.feedback);
                              }}
                              disabled={summarizingFeedbackId === topic.id || analyzingFeedbackId === topic.id}
                              className="cursor-pointer flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 text-sm sm:text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {summarizingFeedbackId === topic.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                                  Summarizing...
                                </>
                              ) : (
                                <>
                                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                  Summarize
                                </>
                              )}
                            </button>
                          </div>

                          {/* Analysis Results */}
                          {!analyzingFeedbackId &&
                            activeResult?.id === topic.id &&
                            activeResult.type === 'analysis' &&
                            analysisResults[topic.id] && (
                              <div className="mt-4 space-y-3 sm:space-y-4">
                                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-100">
                                  <div className="flex items-center mb-2 sm:mb-3">
                                    <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-green-800">
                                      Key Takeaways
                                    </h4>
                                  </div>
                                  <ul className="space-y-1 sm:space-y-2 pl-4 sm:pl-6">
                                    {analysisResults[topic.id]['key takeaways'].map((item, index) => (
                                      <li key={index} className="text-sm sm:text-base text-green-700 flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 sm:p-4 border border-yellow-100">
                                  <div className="flex items-center mb-2 sm:mb-3">
                                    <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-yellow-800">
                                      Improvement Areas
                                    </h4>
                                  </div>
                                  <ul className="space-y-1 sm:space-y-2 pl-4 sm:pl-6">
                                    {analysisResults[topic.id]['improvement areas'].map((item, index) => (
                                      <li key={index} className="text-sm sm:text-base text-yellow-700 flex items-start">
                                        <span className="text-yellow-500 mr-2">•</span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-100">
                                  <div className="flex items-center mb-2 sm:mb-3">
                                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                                      <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-blue-800">
                                      Action Items
                                    </h4>
                                  </div>
                                  <ul className="space-y-1 sm:space-y-2 pl-4 sm:pl-6">
                                    {analysisResults[topic.id]['action items'].map((item, index) => (
                                      <li key={index} className="text-sm sm:text-base text-blue-700 flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                          {/* Summary Results */}
                          {!summarizingFeedbackId &&
                            activeResult?.id === topic.id &&
                            activeResult.type === 'summary' &&
                            summaryResults[topic.id] && (
                              <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-2 sm:mb-3">
                                  <div className="bg-gray-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                                  </div>
                                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Summary</h4>
                                </div>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                  {summaryResults[topic.id]}
                                </p>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm sm:text-base text-gray-600">
                    No feedback has been received in this domain yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Topic Details Modal */}
          {showTopicModal && selectedTopicForModal && (
            <div className="fixed inset-0 backdrop-blur-md bg-opacity-30 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-4 max-w-[90vw] max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Topic Feedback</h3>
                  <button onClick={closeTopicModal} className="text-gray-600 hover:text-gray-800">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">{selectedTopicForModal.name}</h4>
                  <p className="text-sm text-gray-600">by {selectedTopicForModal.mentor_name}</p>
                  <p className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto">
                    {selectedTopicForModal.feedback}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const feedback = feedbacks.find((fb) => fb.feedback_id === selectedTopicForModal.id);
                        if (feedback) {
                          handleAnalyze(selectedTopicForModal.id);
                        }
                      }}
                      disabled={analyzingFeedbackId === selectedTopicForModal.id || summarizingFeedbackId === selectedTopicForModal.id}
                      className="flex items-center px-3 py-2 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {analyzingFeedbackId === selectedTopicForModal.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSummarize(selectedTopicForModal.id, selectedTopicForModal.feedback);
                      }}
                      disabled={summarizingFeedbackId === selectedTopicForModal.id || analyzingFeedbackId === selectedTopicForModal.id}
                      className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {summarizingFeedbackId === selectedTopicForModal.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Summarizing...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Summarize
                        </>
                      )}
                    </button>
                  </div>

                  {/* Analysis Results */}
                  {!analyzingFeedbackId &&
                    activeResult?.id === selectedTopicForModal.id &&
                    activeResult.type === 'analysis' &&
                    analysisResults[selectedTopicForModal.id] && (
                      <div className="mt-4 space-y-3">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-100">
                          <div className="flex items-center mb-2">
                            <div className="bg-green-100 p-1.5 rounded-full mr-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <h4 className="text-base font-semibold text-green-800">Key Takeaways</h4>
                          </div>
                          <ul className="space-y-1 pl-4">
                            {analysisResults[selectedTopicForModal.id]['key takeaways'].map((item, index) => (
                              <li key={index} className="text-sm text-green-700 flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-100">
                          <div className="flex items-center mb-2">
                            <div className="bg-yellow-100 p-1.5 rounded-full mr-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            </div>
                            <h4 className="text-base font-semibold text-yellow-800">Improvement Areas</h4>
                          </div>
                          <ul className="space-y-1 pl-4">
                            {analysisResults[selectedTopicForModal.id]['improvement areas'].map((item, index) => (
                              <li key={index} className="text-sm text-yellow-700 flex items-start">
                                <span className="text-yellow-500 mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-100">
                          <div className="flex items-center mb-2">
                            <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                              <ClipboardList className="h-4 w-4 text-blue-600" />
                            </div>
                            <h4 className="text-base font-semibold text-blue-800">Action Items</h4>
                          </div>
                          <ul className="space-y-1 pl-4">
                            {analysisResults[selectedTopicForModal.id]['action items'].map((item, index) => (
                              <li key={index} className="text-sm text-blue-700 flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                  {/* Summary Results */}
                  {!summarizingFeedbackId &&
                    activeResult?.id === selectedTopicForModal.id &&
                    activeResult.type === 'summary' &&
                    summaryResults[selectedTopicForModal.id] && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-2">
                          <div className="bg-gray-100 p-1.5 rounded-full mr-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                          </div>
                          <h4 className="text-base font-semibold text-gray-800">Summary</h4>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{summaryResults[selectedTopicForModal.id]}</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewFeedback;