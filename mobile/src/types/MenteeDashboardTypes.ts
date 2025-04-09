

export interface Mentor {
    name: string;
    id: number;
    mail: string;
    designation: string;
    domain: string;
    score: number;
    reason: string;
  }
  export interface MentorResponseDTO {
    domain_mentors: Mentor[];
    other_domain_mentors: Mentor[];
  }