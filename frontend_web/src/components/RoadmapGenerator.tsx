import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, ChevronDown, ChevronRight } from 'lucide-react';

interface Mentee {
    id: number;
    name: string;
    domain_id: number;
    domain_name: string;
    mail: string;
    contact: string;
    designation: string;
    exp: number;
    profile_pic_url: string | null;
    role: string;
    is_profile_complete: boolean;
    created_at: string;
    updated_at: string;
    has_roadmap?: boolean;
}

interface Topic {
    topic_id: number;
    name: string;
    description: string;
    subtopics: string[];
    importance: string;
    topic_status: string;
    isExpanded?: boolean;
    topic_duration_hours: number;
}

interface RoadmapResponse {
    status_code: number;
    message: string;
    roadmap_id: number;
    roadmap_explanation: string;
    topics: Topic[];
}

const RoadmapGenerator: React.FC = () => {
    const [mentees, setMentees] = useState<Mentee[]>([]);
    const [selectedMentee, setSelectedMentee] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isAssigned, setIsAssigned] = useState(false);
    const [currentRoadmapId, setCurrentRoadmapId] = useState<number | null>(null);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
    const [showAddTopicModal, setShowAddTopicModal] = useState(false);
    const [showAddSubtopicModal, setShowAddSubtopicModal] = useState(false);
    const [roadmapDescription, setRoadmapDescription] = useState<string>('');
    const [selectedMenteeData, setSelectedMenteeData] = useState<Mentee | null>(null);
    const [viewingAssignedRoadmap, setViewingAssignedRoadmap] = useState(false);
    const [showDeleteTopicConfirmation, setShowDeleteTopicConfirmation] = useState<{ show: boolean; topicId: number | null }>({ show: false, topicId: null });
    const [showDeleteSubtopicConfirmation, setShowDeleteSubtopicConfirmation] = useState<{ show: boolean; topicId: number; subtopicIndex: number } | null>(null);
    const [showEditModalSubtopicDeleteConfirmation, setShowEditModalSubtopicDeleteConfirmation] = useState<{ show: boolean; subtopicIndex: number } | null>(null);
    const [showAddModalSubtopicDeleteConfirmation, setShowAddModalSubtopicDeleteConfirmation] = useState<{ show: boolean; subtopicIndex: number } | null>(null);
    const [newSubtopicForm, setNewSubtopicForm] = useState({ name: '', duration: 0 });
    const [showSubtopicForm, setShowSubtopicForm] = useState(false);
    const [showAddModalSubtopicForm, setShowAddModalSubtopicForm] = useState(false);
    const [newTopicSubtopicForm, setNewTopicSubtopicForm] = useState({ name: '', duration: 0 });
    const [newTopicSubtopics, setNewTopicSubtopics] = useState<string[]>([]);
    const [showRoadmapModal, setShowRoadmapModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState<Topic | null>(null);

    const newTopicInitialState = {
        name: '',
        description: '',
        importance: ''
    };

    const [newTopic, setNewTopic] = useState(newTopicInitialState);
    const [newSubtopic, setNewSubtopic] = useState({ name: '' });

    const handleNameInput = (name: string): string => {
        return name.trim();
    };

    const fetchMentees = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('No authentication token found. Please log in again.');
                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/mentor/get-approved-mentee`, {
                headers: {
                    'Token': token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            });

            if (response.data && response.data.object) {
                const menteeList = response.data.object;
                if (Array.isArray(menteeList) && menteeList.length > 0) {
                    const menteesWithRoadmapStatus = await Promise.all(
                        menteeList.map(async (mentee) => {
                            try {
                                const roadmapResponse = await axios.get(
                                    `${import.meta.env.VITE_API_URL}/mentor/get-mentee-roadmap/${mentee.id}`,
                                    {
                                        headers: {
                                            'Token': token,
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json'
                                        }
                                    }
                                );
                                return {
                                    ...mentee,
                                    has_roadmap: roadmapResponse.data && roadmapResponse.data.topics && roadmapResponse.data.topics.length > 0
                                };
                            } catch (error) {
                                return {
                                    ...mentee,
                                    has_roadmap: false
                                };
                            }
                        })
                    );
                    setMentees(menteesWithRoadmapStatus);
                    setError(null);
                } else {
                    console.error('Empty mentee list received');
                    setError('No mentees found');
                }
            } else {
                console.error('Invalid response format:', response.data);
                setError('No mentees found');
            }
        } catch (error) {
            console.error('Error fetching mentees:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                } else {
                    setError(`Failed to fetch mentees: ${error.message}`);
                }
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    const handleMenteeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const menteeId = e.target.value;
        setSelectedMentee(menteeId);
        
        const mentee = mentees.find(m => m.id.toString() === menteeId);
        setSelectedMenteeData(mentee || null);
        
        if (mentee?.has_roadmap) {
            setViewingAssignedRoadmap(true);
            fetchAssignedRoadmap(mentee.id);
        } else {
            setViewingAssignedRoadmap(false);
            setTopics([]);
            setRoadmapDescription('');
        }
    };

    const fetchAssignedRoadmap = async (menteeId: number) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/mentor/get-mentee-roadmap/${menteeId}`,
                {
                    headers: {
                        'Token': token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.data) {
                setRoadmapDescription(response.data.roadmap_explanation);
                setTopics(response.data.topics.map((topic: Topic) => ({
                    ...topic,
                    isExpanded: false
                })));
                setCurrentRoadmapId(response.data.roadmap_id);
                setIsAssigned(true);
            }
        } catch (error) {
            console.error('Error fetching assigned roadmap:', error);
            setError('Failed to fetch assigned roadmap');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateRoadmap = async () => {
        if (!selectedMentee) {
            setError('Please select a mentee first');
            return;
        }

        const selectedMenteeData = mentees.find(m => m.id.toString() === selectedMentee);
        if (!selectedMenteeData) {
            setError('Selected mentee not found');
            return;
        }

        if (selectedMenteeData.has_roadmap) {
            setError('A roadmap has already been assigned to this mentee. Please select a different mentee.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('No authentication token found. Please log in again.');
                return;
            }

            const response = await axios.post<RoadmapResponse>(`${import.meta.env.VITE_AI_API_URL}/roadmaps/generate/`, {
                mentee_id: selectedMenteeData.id,
                domain_id: selectedMenteeData.domain_id
            }, {
                headers: {
                    'Token': token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: false
            });

            if (response.data) {
                if (response.data.topics && Array.isArray(response.data.topics)) {
                    setRoadmapDescription(response.data.roadmap_explanation);
                    const transformedTopics = response.data.topics.map((topic: Topic) => {
                        const totalHours = topic.subtopics.reduce((sum, subtopic) => {
                            const match = subtopic.match(/\((\d+)\s*hours\)/);
                            return sum + (match ? parseInt(match[1]) : 0);
                        }, 0);

                        return {
                            ...topic,
                            isExpanded: false,
                            topic_duration_hours: totalHours
                        };
                    });
                    
                    setTopics(transformedTopics);
                    setCurrentRoadmapId(response.data.roadmap_id);
                }
                setError(null);
            } else {
                setError('No roadmap data received');
            }
        } catch (error) {
            console.error('Error generating roadmap:', error);
            if (axios.isAxiosError(error)) {
                setError(`Failed to generate roadmap: ${error.response?.data?.detail || error.message}`);
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRoadmap = async () => {
        if (!selectedMentee || topics.length === 0 || !currentRoadmapId) {
            setError('Please generate a roadmap first and select a mentee');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('No authentication token found. Please log in again.');
                return;
            }

            const selectedMenteeData = mentees.find(m => m.id.toString() === selectedMentee);
            if (!selectedMenteeData) {
                setError('Selected mentee not found');
                return;
            }

            try {
                const roadmapResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/mentor/get-mentee-roadmap/${selectedMenteeData.id}`,
                    {
                        headers: {
                            'Token': token,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );
                if (roadmapResponse.data && roadmapResponse.data.topics && roadmapResponse.data.topics.length > 0) {
                    setError('A roadmap has already been assigned to this mentee. Please select a different mentee.');
                    return;
                }
            } catch (error) {
                if (!axios.isAxiosError(error) || error.response?.status !== 404) {
                    console.error('Error checking roadmap status:', error);
                }
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/mentor/assign-roadmap`,
                {
                    mentee_id: selectedMenteeData.id,
                    domain_id: selectedMenteeData.domain_id,
                    roadmap_id: currentRoadmapId
                },
                {
                    headers: {
                        'Token': token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.data) {
                console.log('Roadmap assigned:', response.data);
                setIsAssigned(true);
                setError(null);
                
                setMentees(mentees.map(mentee => 
                    mentee.id === selectedMenteeData.id 
                        ? { ...mentee, has_roadmap: true }
                        : mentee
                ));

                setTopics([]);
                setRoadmapDescription('');
                setCurrentRoadmapId(null);
            } else {
                setError('Failed to assign roadmap');
            }
        } catch (error) {
            console.error('Error assigning roadmap:', error);
            if (axios.isAxiosError(error)) {
                setError(`Failed to assign roadmap: ${error.response?.data?.detail || error.message}`);
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddTopic = () => {
        if (!newTopic.name) {
            setError('Topic name is required');
            return;
        }

        const totalHours = newTopicSubtopics.reduce((sum, s) => {
            const match = s.match(/\((\d+)\s*hours\)/);
            return sum + (match ? parseInt(match[1]) : 0);
        }, 0);

        const topic: Topic = {
            topic_id: Date.now(),
            name: newTopic.name,
            description: newTopic.description,
            subtopics: newTopicSubtopics,
            importance: newTopic.importance,
            topic_status: 'pending',
            isExpanded: false,
            topic_duration_hours: totalHours
        };

        setTopics([...topics, topic]);
        setNewTopic(newTopicInitialState);
        setNewTopicSubtopics([]);
        setShowAddTopicModal(false);
    };

    const handleAddSubtopic = () => {
        if (!newSubtopicForm.name) {
            setError('Subtopic name is required');
            return;
        }

        if (!editingTopic) {
            setError('No topic selected for editing');
            return;
        }

        const value = newSubtopicForm.duration;
        if (value >= 0 && value <= 255) {
            const newSubtopic = `${newSubtopicForm.name} (${value} hours)`;
            const updatedSubtopics = [...editingTopic.subtopics, newSubtopic];
            const newTotalDuration = updatedSubtopics.reduce((sum, s) => {
                const match = s.match(/\((\d+)\s*hours\)/);
                return sum + (match ? parseInt(match[1]) : 0);
            }, 0);
            setEditingTopic({
                ...editingTopic,
                subtopics: updatedSubtopics,
                topic_duration_hours: newTotalDuration
            });
            setNewSubtopicForm({ name: '', duration: 0 });
            setShowAddSubtopicModal(false);
        }
    };

    const handleEditTopic = (topic: Topic) => {
        setEditingTopic(topic);
    };

    const handleUpdateTopic = async (updatedTopic: Topic) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('No authentication token found');
                return;
            }

            const subtopicNames = updatedTopic.subtopics.map(s => s.replace(/\s*\(\d+\s*hours\)$/, ''));
            const subtopicDurations = updatedTopic.subtopics.map(s => {
                const match = s.match(/\((\d+)\s*hours\)/);
                return match ? parseInt(match[1]) : 0;
            });

            const totalDuration = subtopicDurations.reduce((sum, duration) => sum + duration, 0);

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/roadmap/modify_topic`,
                {
                    topic_id: updatedTopic.topic_id,
                    topic_name: updatedTopic.name,
                    description: updatedTopic.description,
                    subtopics: subtopicNames,
                    reasoning: updatedTopic.importance,
                    subtopics_duration: subtopicDurations
                },
                {
                    headers: {
                        'Token': token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.data) {
                setTopics(topics.map(t => 
                    t.topic_id === updatedTopic.topic_id ? { ...updatedTopic, topic_duration_hours: totalDuration } : t
                ));
                setEditingTopic(null);
            }
        } catch (error) {
            console.error('Error updating topic:', error);
            if (axios.isAxiosError(error)) {
                setError(`Failed to update topic: ${error.response?.data?.detail || error.message}`);
            } else {
                setError('Failed to update topic');
            }
        }
    };

    const handleDeleteTopic = (topicId: number) => {
        setShowDeleteTopicConfirmation({ show: true, topicId });
    };

    const handleConfirmDeleteTopic = async () => {
        if (showDeleteTopicConfirmation.topicId !== null) {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setError('No authentication token found');
                    return;
                }

                const response = await axios.delete(
                    `${import.meta.env.VITE_API_URL}/roadmap/delete_topic`,
                    {
                        headers: {
                            'Token': token,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        data: {
                            topic_id: showDeleteTopicConfirmation.topicId
                        }
                    }
                );

                if (response.data) {
                    setTopics(topics.filter(topic => topic.topic_id !== showDeleteTopicConfirmation.topicId));
                    setShowDeleteTopicConfirmation({ show: false, topicId: null });
                }
            } catch (error) {
                console.error('Error deleting topic:', error);
                if (axios.isAxiosError(error)) {
                    setError(`Failed to delete topic: ${error.response?.data?.detail || error.message}`);
                } else {
                    setError('Failed to delete topic');
                }
            }
        }
    };

    const handleConfirmDeleteSubtopic = () => {
        if (showDeleteSubtopicConfirmation) {
            const { topicId, subtopicIndex } = showDeleteSubtopicConfirmation;
            setTopics(topics.map(topic => {
                if (topic.topic_id === topicId) {
                    const newSubtopics = [...topic.subtopics];
                    newSubtopics.splice(subtopicIndex, 1);
                    const newTotalDuration = newSubtopics.reduce((sum, s) => {
                        const match = s.match(/\((\d+)\s*hours\)/);
                        return sum + (match ? parseInt(match[1]) : 0);
                    }, 0);
                    return {
                        ...topic,
                        subtopics: newSubtopics,
                        topic_duration_hours: newTotalDuration
                    };
                }
                return topic;
            }));
            setShowDeleteSubtopicConfirmation(null);
        }
    };

    const handleToggleTopic = (topicId: number) => {
        setTopics(topics.map(topic => {
            if (topic.topic_id === topicId) {
                return {
                    ...topic,
                    isExpanded: !topic.isExpanded
                };
            }
            return topic;
        }));
    };

    const handleViewRoadmapDescription = () => {
        setShowRoadmapModal(true);
    };

    const handleViewTopicDetails = (topic: Topic) => {
        setShowTopicModal(topic);
    };

    useEffect(() => {
        fetchMentees();
        
        const checkAssignedRoadmaps = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) return;

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/mentor/get-approved-mentee`, {
                    headers: {
                        'Token': token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                });

                if (response.data && response.data.object) {
                    const menteeList = response.data.object;
                    if (Array.isArray(menteeList) && menteeList.length > 0) {
                        setMentees(menteeList.map(mentee => ({
                            ...mentee,
                            has_roadmap: mentee.has_roadmap || false
                        })));
                    }
                }
            } catch (error) {
                console.error('Error checking assigned roadmaps:', error);
            }
        };

        checkAssignedRoadmaps();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-6 sm:py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Generate Learning Roadmap</h1>
                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg">
                            <label className="block text-sm sm:text-base font-medium text-indigo-700 mb-2">Select Mentee</label>
                            <select
                                value={selectedMentee}
                                onChange={handleMenteeSelect}
                                className="block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base bg-white"
                            >
                                <option value="">Select a mentee</option>
                                {mentees.map((mentee) => (
                                    <option key={mentee.id} value={mentee.id}>
                                        {mentee.name} - {mentee.domain_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedMenteeData?.has_roadmap && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm sm:text-base text-yellow-700">
                                        A roadmap has already been assigned to this mentee. You can view it below.
                                    </p>
                                </div>
                            </div>
                        )}

                        {!selectedMenteeData?.has_roadmap && !viewingAssignedRoadmap && (
                            <button
                                onClick={handleGenerateRoadmap}
                                disabled={loading || !selectedMentee}
                                className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-md text-sm sm:text-base font-medium text-white ${
                                    loading || !selectedMentee
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200'
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating
                                    </div>
                                ) : 'Generate Roadmap'}
                            </button>
                        )}

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm sm:text-base text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {topics.length > 0 && (
                            <div className="mt-6 sm:mt-8 space-y-6">
                                {roadmapDescription && (
                                    <>
                                        <div className="sm:hidden p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                            <h3 className="text-lg font-semibold text-indigo-800 mb-2 sm:mb-4">Roadmap Overview</h3>
                                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{roadmapDescription}</p>
                                            <button
                                                onClick={handleViewRoadmapDescription}
                                                className="mt-2 inline-flex items-center px-2 sm:px-3 py-1 bg-indigo-50 text-blue-600 rounded-md hover:bg-indigo-100 hover:shadow-md hover:scale-105 transition-all duration-200 text-sm"
                                            >
                                                Read More
                                            </button>
                                        </div>
                                        <div className="hidden sm:block p-4 sm:p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                                            <h3 className="text-xl font-semibold text-indigo-800 mb-4">Roadmap Overview</h3>
                                            <p className="text-base text-gray-700 leading-relaxed">{roadmapDescription}</p>
                                        </div>
                                    </>
                                )}

                                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
                                    <h3 className="text-lg sm:text-xl font-semibold text-indigo-800">Learning Topics</h3>
                                    <button
                                        onClick={() => setShowAddTopicModal(true)}
                                        className="flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                                    >
                                        <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                                        Add Topic
                                    </button>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    <div className="sm:hidden space-y-3">
                                        {topics.map((topic) => (
                                            <div
                                                key={topic.topic_id}
                                                className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                                            >
                                                <button
                                                    onClick={() => handleViewTopicDetails(topic)}
                                                    className="w-full text-left"
                                                >
                                                    <div className="flex justify-between items-center min-w-0">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-blue-600 hover:underline truncate">
                                                                {topic.name}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {topic.topic_duration_hours} hours
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="hidden sm:block space-y-6">
                                        {topics.map((topic) => (
                                            <div 
                                                key={topic.topic_id} 
                                                className="border rounded-lg p-4 sm:p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                                                        <button
                                                            onClick={() => handleToggleTopic(topic.topic_id)}
                                                            className="text-indigo-600 hover:text-indigo-800 hover:scale-110 transition-transform duration-200"
                                                        >
                                                            {topic.isExpanded ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                                                        </button>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="font-medium text-base sm:text-lg text-gray-900 truncate">{topic.name}</span>
                                                        </div>
                                                        <span className="ml-2 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                                                            {topic.topic_duration_hours} hours
                                                        </span>
                                                    </div>
                                                    <div className="flex space-x-2 sm:space-x-3">
                                                        <button
                                                            onClick={() => handleEditTopic(topic)}
                                                            className="text-indigo-600 hover:text-indigo-800 hover:scale-110 transition-transform duration-200"
                                                        >
                                                            <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTopic(topic.topic_id)}
                                                            className="text-red-600 hover:text-red-800 hover:scale-110 transition-transform duration-200"
                                                        >
                                                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3 pl-6 sm:pl-8">{topic.description}</p>
                                                
                                                {topic.isExpanded && topic.subtopics.length > 0 && (
                                                    <div className="mt-4 sm:mt-6 pl-6 sm:pl-8 space-y-3 sm:space-y-4">
                                                        {topic.subtopics.map((subtopic, index) => {
                                                            const name = subtopic.replace(/\s*\(\d+\s*hours\)$/, '');
                                                            const durationMatch = subtopic.match(/\((\d+)\s*hours\)/);
                                                            const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
                                                            
                                                            return (
                                                                <div key={index} className="border-l-2 border-indigo-300 pl-3 sm:pl-4 py-2 sm:py-3 bg-indigo-50 rounded-r-lg">
                                                                    <div className="flex justify-between items-center">
                                                                        <div>
                                                                            <span className="font-medium text-sm sm:text-base text-gray-900">{name}</span>
                                                                            <span className="ml-2 text-xs sm:text-sm text-gray-500">
                                                                                ({duration} hours)
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => setShowDeleteSubtopicConfirmation({ show: true, topicId: topic.topic_id, subtopicIndex: index })}
                                                                            className="text-red-600 hover:text-red-800 text-sm sm:text-base"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                <div className="mt-3 sm:mt-4 pl-6 sm:pl-8">
                                                    <div className="bg-indigo-50/50 p-3 sm:p-4 rounded-lg border border-indigo-100/50">
                                                        <h4 className="text-sm sm:text-base font-medium text-indigo-700 mb-2">Importance</h4>
                                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{topic.importance}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleAssignRoadmap}
                                    disabled={loading || isAssigned}
                                    className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-md text-sm sm:text-base font-medium text-white ${
                                        loading || isAssigned
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Assigning...
                                        </div>
                                    ) : isAssigned ? 'Roadmap Assigned' : 'Assign Roadmap'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Roadmap Overview Modal (Mobile) */}
            {showRoadmapModal && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Roadmap Overview</h3>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{roadmapDescription}</p>
                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setShowRoadmapModal(false)}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Topic Details Modal (Mobile) */}
            {showTopicModal && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 max-w-[90vw] sm:max-w-md max-h-[80vh] overflow-y-auto">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 truncate">{showTopicModal.name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm sm:text-base font-medium text-gray-600">Description:</span>
                                <p className="text-sm sm:text-base text-gray-700 mt-1">{showTopicModal.description}</p>
                            </div>
                            <div>
                                <span className="text-sm sm:text-base font-medium text-gray-600">Subtopics:</span>
                                {showTopicModal.subtopics.length > 0 ? (
                                    <ul className="mt-1 space-y-2">
                                        {showTopicModal.subtopics.map((subtopic, index) => {
                                            const name = subtopic.replace(/\s*\(\d+\s*hours\)$/, '');
                                            const durationMatch = subtopic.match(/\((\d+)\s*hours\)/);
                                            const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
                                            return (
                                                <li key={index} className="text-sm sm:text-base text-gray-700">
                                                    {name} ({duration} hours)
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-sm sm:text-base text-gray-700 mt-1">No subtopics available.</p>
                                )}
                            </div>
                            <div>
                                <span className="text-sm sm:text-base font-medium text-gray-600">Importance:</span>
                                <p className="text-sm sm:text-base text-gray-700 mt-1">{showTopicModal.importance}</p>
                            </div>
                            <div>
                                <span className="text-sm sm:text-base font-medium text-gray-600">Duration:</span>
                                <p className="text-sm sm:text-base text-gray-700 mt-1">{showTopicModal.topic_duration_hours} hours</p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowTopicModal(null);
                                    handleEditTopic(showTopicModal);
                                }}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setShowTopicModal(null);
                                    handleDeleteTopic(showTopicModal.topic_id);
                                }}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowTopicModal(null)}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Topic Modal */}
            {showAddTopicModal && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center p-4 z-[1000]">
                    <div className="bg-white rounded-lg w-full max-w-[90vw] sm:max-w-[1000px] max-h-[90vh] flex flex-col">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-lg sm:text-xl font-medium text-indigo-800">Add New Topic</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-8">
                                <div className="space-y-4 sm:space-y-6 sm:border-r sm:border-gray-200 sm:pr-8">
                                    <div className="min-w-0">
                                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                            Topic Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newTopic.name}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setNewTopic(prev => ({ ...prev, name: value }));
                                            }}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base overflow-hidden text-ellipsis whitespace-nowrap"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={newTopic.description}
                                            onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                            rows={5}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                            Importance <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={newTopic.importance}
                                            onChange={(e) => setNewTopic({ ...newTopic, importance: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                            rows={5}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2 sm:mb-4">
                                            <label className="block text-sm sm:text-base font-medium text-gray-700">Subtopics</label>
                                            <button
                                                onClick={() => setShowAddModalSubtopicForm(true)}
                                                className="flex items-center space-x-1 text-sm sm:text-base text-indigo-600 hover:text-indigo-800"
                                            >
                                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                                <span>Add Subtopic</span>
                                            </button>
                                        </div>

                                        {showAddModalSubtopicForm && (
                                            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Subtopic name"
                                                        value={newTopicSubtopicForm.name}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setNewTopicSubtopicForm(prev => ({ ...prev, name: value }));
                                                        }}
                                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="255"
                                                            value={newTopicSubtopicForm.duration}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value) || 0;
                                                                if (value >= 0 && value <= 255) {
                                                                    setNewTopicSubtopicForm({ ...newTopicSubtopicForm, duration: value });
                                                                }
                                                            }}
                                                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                                        />
                                                        <span className="text-sm sm:text-base text-gray-500">hours</span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                if (newTopicSubtopicForm.name.trim()) {
                                                                    setNewTopicSubtopics([...newTopicSubtopics, `${newTopicSubtopicForm.name} (${newTopicSubtopicForm.duration} hours)`]);
                                                                    setNewTopicSubtopicForm({ name: '', duration: 0 });
                                                                    setShowAddModalSubtopicForm(false);
                                                                }
                                                            }}
                                                            className="text-sm sm:text-base text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setShowAddModalSubtopicForm(false);
                                                                setNewTopicSubtopicForm({ name: '', duration: 0 });
                                                            }}
                                                            className="text-sm sm:text-base text-gray-600 hover:text-gray-800"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                            {newTopicSubtopics.map((subtopic, index) => {
                                                const name = subtopic.replace(/\s*\(\d+\s*hours\)$/, '');
                                                const durationMatch = subtopic.match(/\((\d+)\s*hours\)/);
                                                const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
                                                
                                                return (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                                        <div className="flex-1 mr-4">
                                                            <span className="font-medium text-sm sm:text-base text-gray-900">{name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm sm:text-base text-gray-500">{duration} hours</span>
                                                            <button
                                                                onClick={() => setShowAddModalSubtopicDeleteConfirmation({ show: true, subtopicIndex: index })}
                                                                className="text-sm sm:text-base text-red-600 hover:text-red-800"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowAddTopicModal(false);
                                    setNewTopic(newTopicInitialState);
                                    setNewTopicSubtopics([]);
                                }}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTopic}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
                            >
                                Add Topic
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Subtopic Modal */}
            {showAddSubtopicModal && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-[90vw] sm:max-w-md">
                        <h3 className="text-lg sm:text-xl font-medium text-indigo-800 mb-4">Add New Subtopic</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Subtopic Name</label>
                                <input
                                    type="text"
                                    value={newSubtopicForm.name}
                                    onChange={(e) => setNewSubtopicForm({ ...newSubtopicForm, name: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Duration (hours)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={newSubtopicForm.duration}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 0;
                                        if (value >= 0 && value <= 255) {
                                            setNewSubtopicForm({ ...newSubtopicForm, duration: value });
                                        }
                                    }}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    onClick={() => setShowAddSubtopicModal(false)}
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSubtopic}
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
                                >
                                    Add Subtopic
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Topic Modal */}
            {editingTopic && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center p-4 z-[1000]">
                    <div className="bg-white rounded-lg w-full max-w-[90vw] sm:max-w-[1000px] max-h-[90vh] flex flex-col">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-lg sm:text-xl font-medium text-indigo-800">Edit Topic</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-8">
                                <div className="space-y-4 sm:space-y-6 sm:border-r sm:border-gray-200 sm:pr-8">
                                    <div className="min-w-0">
                                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                            Topic Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editingTopic.name}
                                            onChange={(e) => setEditingTopic({ ...editingTopic, name: handleNameInput(e.target.value) })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base overflow-hidden text-ellipsis whitespace-nowrap"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={editingTopic.description}
                                            onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                            rows={5}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                            Importance <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={editingTopic.importance}
                                            onChange={(e) => setEditingTopic({ ...editingTopic, importance: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                            rows={5}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2 sm:mb-4">
                                            <label className="block text-sm sm:text-base font-medium text-gray-700">Subtopics</label>
                                            <button
                                                onClick={() => setShowSubtopicForm(true)}
                                                className="flex items-center space-x-1 text-sm sm:text-base text-indigo-600 hover:text-indigo-800"
                                            >
                                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                                <span>Add Subtopic</span>
                                            </button>
                                        </div>

                                        {showSubtopicForm && (
                                            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Subtopic name"
                                                        value={newSubtopicForm.name}
                                                        onChange={(e) => setNewSubtopicForm({ ...newSubtopicForm, name: handleNameInput(e.target.value) })}
                                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="255"
                                                            value={newSubtopicForm.duration}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value) || 0;
                                                                if (value >= 0 && value <= 255) {
                                                                    setNewSubtopicForm({ ...newSubtopicForm, duration: value });
                                                                }
                                                            }}
                                                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                                        />
                                                        <span className="text-sm sm:text-base text-gray-500">hours</span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                if (newSubtopicForm.name.trim()) {
                                                                    const updatedSubtopics = [...editingTopic.subtopics, `${newSubtopicForm.name} (${newSubtopicForm.duration} hours)`];
                                                                    const newTotalDuration = updatedSubtopics.reduce((sum, s) => {
                                                                        const match = s.match(/\((\d+)\s*hours\)/);
                                                                        return sum + (match ? parseInt(match[1]) : 0);
                                                                    }, 0);
                                                                    setEditingTopic({
                                                                        ...editingTopic,
                                                                        subtopics: updatedSubtopics,
                                                                        topic_duration_hours: newTotalDuration
                                                                    });
                                                                    setNewSubtopicForm({ name: '', duration: 0 });
                                                                    setShowSubtopicForm(false);
                                                                }
                                                            }}
                                                            className="text-sm sm:text-base text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setShowSubtopicForm(false);
                                                                setNewSubtopicForm({ name: '', duration: 0 });
                                                            }}
                                                            className="text-sm sm:text-base text-gray-600 hover:text-gray-800"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                            {editingTopic.subtopics.map((subtopic, index) => {
                                                const name = subtopic.replace(/\s*\(\d+\s*hours\)$/, '');
                                                const durationMatch = subtopic.match(/\((\d+)\s*hours\)/);
                                                const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
                                                
                                                return (
                                                    <div key={index} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 gap-2">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={name}
                                                                onChange={(e) => {
                                                                    const updatedSubtopics = [...editingTopic.subtopics];
                                                                    updatedSubtopics[index] = `${handleNameInput(e.target.value)} (${duration} hours)`;
                                                                    setEditingTopic({
                                                                        ...editingTopic,
                                                                        subtopics: updatedSubtopics
                                                                    });
                                                                }}
                                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                                            />
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="255"
                                                                value={duration}
                                                                onChange={(e) => {
                                                                    const value = parseInt(e.target.value) || 0;
                                                                    if (value >= 0 && value <= 255) {
                                                                        const updatedSubtopics = [...editingTopic.subtopics];
                                                                        updatedSubtopics[index] = `${name} (${value} hours)`;
                                                                        const newTotalDuration = updatedSubtopics.reduce((sum, s) => {
                                                                            const match = s.match(/\((\d+)\s*hours\)/);
                                                                            return sum + (match ? parseInt(match[1]) : 0);
                                                                        }, 0);
                                                                        setEditingTopic({
                                                                            ...editingTopic,
                                                                            subtopics: updatedSubtopics,
                                                                            topic_duration_hours: newTotalDuration
                                                                        });
                                                                    }
                                                                }}
                                                                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm sm:text-base"
                                                            />
                                                            <span className="text-sm sm:text-base text-gray-500">hours</span>
                                                            <button
                                                                onClick={() => setShowEditModalSubtopicDeleteConfirmation({ show: true, subtopicIndex: index })}
                                                                className="text-sm sm:text-base text-red-600 hover:text-red-800"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
                            <button
                                onClick={() => setEditingTopic(null)}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdateTopic(editingTopic)}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal Subtopic Delete Confirmation */}
            {showEditModalSubtopicDeleteConfirmation && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-[90vw] sm:max-w-md">
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">Delete Subtopic</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">Are you sure you want to delete this subtopic? This action cannot be undone.</p>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setShowEditModalSubtopicDeleteConfirmation(null)}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (showEditModalSubtopicDeleteConfirmation && editingTopic) {
                                        const newSubtopics = [...editingTopic.subtopics];
                                        newSubtopics.splice(showEditModalSubtopicDeleteConfirmation.subtopicIndex, 1);
                                        const newTotalDuration = newSubtopics.reduce((sum, s) => {
                                            const match = s.match(/\((\d+)\s*hours\)/);
                                            return sum + (match ? parseInt(match[1]) : 0);
                                        }, 0);
                                        setEditingTopic({
                                            ...editingTopic,
                                            subtopics: newSubtopics,
                                            topic_duration_hours: newTotalDuration
                                        });
                                        setShowEditModalSubtopicDeleteConfirmation(null);
                                    }
                                }}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Topic Confirmation Modal */}
            {showDeleteTopicConfirmation.show && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-[90vw] sm:max-w-md">
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">Delete Topic</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">Are you sure you want to delete this topic? This action cannot be undone.</p>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteTopicConfirmation({ show: false, topicId: null })}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDeleteTopic}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Subtopic Confirmation Modal */}
            {showDeleteSubtopicConfirmation && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-[90vw] sm:max-w-md">
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">Delete Subtopic</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">Are you sure you want to delete this subtopic? This action cannot be undone.</p>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteSubtopicConfirmation(null)}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDeleteSubtopic}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal Subtopic Delete Confirmation */}
            {showAddModalSubtopicDeleteConfirmation && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-[90vw] sm:max-w-md">
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">Delete Subtopic</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">Are you sure you want to delete this subtopic? This action cannot be undone.</p>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setShowAddModalSubtopicDeleteConfirmation(null)}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (showAddModalSubtopicDeleteConfirmation) {
                                        const newSubtopics = [...newTopicSubtopics];
                                        newSubtopics.splice(showAddModalSubtopicDeleteConfirmation.subtopicIndex, 1);
                                        setNewTopicSubtopics(newSubtopics);
                                        setShowAddModalSubtopicDeleteConfirmation(null);
                                    }
                                }}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoadmapGenerator;