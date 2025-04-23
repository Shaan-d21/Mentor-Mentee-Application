export interface RoadmapResponse {
    status_code: number;
    message: string;
    roadmap_id: number;
    roadmap_explanation: string;
    topics: RoadmapTopic[];
}

export interface RoadmapTopic {
    topic_id: number;
    name: string;
    description: string;
    subtopics: string[];
    importance: string;
    topic_status: string;
    topic_duration_days: number;

}



export function roadmapResponseFromJson(json: any): RoadmapResponse {
    return { ...json };
}

export function roadmapResponseToJson(response: RoadmapResponse): any {
    return { ...response };
}
