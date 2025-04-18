import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    id: number;
    name: string;
    status: string;
}

const RoadmapGenerator: React.FC = () => {
    const [mentees, setMentees] = useState<Mentee[]>([]);
    const [selectedMentee, setSelectedMentee] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isAssigned, setIsAssigned] = useState(false);
    const [currentRoadmapId, setCurrentRoadmapId] = useState<number | null>(null);

    const fetchMentees = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('No authentication token found. Please log in again.');
                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://mm-be.shaandewang.publicvm.com'}/mentor/get-approved-mentee`, {
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
                    // Set mentees without checking roadmaps
                    setMentees(menteeList.map(mentee => ({
                        ...mentee,
                        has_roadmap: false // Default to false since we're not checking
                    })));
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
                console.error('Error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
                if (error.response?.status === 401) {
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                } else if (error.response?.status === 403) {
                    setError('Access forbidden. Please check your permissions.');
                } else if (error.response?.status === 404) {
                    setError('API endpoint not found. Please contact support.');
                } else {
                    setError(`Failed to fetch mentees: ${error.message}`);
                }
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    const handleGenerateRoadmap = async () => {
        if (!selectedMentee) {
            setError('Please select a mentee first');
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

            const response = await axios.post('http://181.214.44.15:8080/roadmaps/generate', {
                mentee_id: selectedMenteeData.id,
                domain_id: selectedMenteeData.domain_id
            }, {
                headers: {
                    'Token': token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            });

            if (response.data) {
                if (response.data.topics && Array.isArray(response.data.topics)) {
                    setTopics(response.data.topics);
                    setCurrentRoadmapId(response.data.roadmap_id);
                }
                setError(null);
            } else {
                setError('No roadmap data received');
            }
        } catch (error) {
            console.error('Error generating roadmap:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                } else if (error.response?.status === 403) {
                    setError('Access forbidden. Please check your permissions.');
                } else if (error.response?.status === 404) {
                    setError('API endpoint not found. Please contact support.');
                } else {
                    setError(`Failed to generate roadmap: ${error.response?.data?.detail || error.message}`);
                }
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

            const response = await axios.post(
                'http://181.214.44.15:8080/mentor/assign-roadmap',
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

    const isButtonDisabled = () => {
        if (!selectedMentee || loading) return true;
        const selectedMenteeData = mentees.find(m => m.id.toString() === selectedMentee);
        return selectedMenteeData?.has_roadmap || false;
    };

    useEffect(() => {
        fetchMentees();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Generate Learning Roadmap</h1>
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Mentee</label>
                            <select
                                value={selectedMentee}
                                onChange={(e) => setSelectedMentee(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                            >
                                <option value="">Select a mentee</option>
                                {mentees.map((mentee) => (
                                    <option key={mentee.id} value={mentee.id}>
                                        {mentee.name} - {mentee.domain_name}
                                        {mentee.has_roadmap ? ' (Roadmap Assigned)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleGenerateRoadmap}
                            disabled={isButtonDisabled()}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                isButtonDisabled()
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {loading ? 'Generating...' : 'Generate Roadmap'}
                        </button>

                        {error && (
                            <div className="text-red-500 text-sm mt-2">{error}</div>
                        )}

                        {topics.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Generated Roadmap</h3>
                                <ol className="list-decimal pl-6 space-y-2">
                                    {topics.map((topic, index) => (
                                        <li key={index} className="text-gray-700">
                                            {topic.name}
                                        </li>
                                    ))}
                                </ol>
                                <button
                                    onClick={handleAssignRoadmap}
                                    disabled={loading || isAssigned}
                                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {loading ? 'Assigning...' : isAssigned ? 'Roadmap Assigned' : 'Assign Roadmap'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapGenerator; 