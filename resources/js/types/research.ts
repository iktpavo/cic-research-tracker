export type ResearchType = 'study' | 'program' | 'project';
export type ResearchStatus = 'ongoing' | 'completed' | 'terminated';
export type ResearchProgram = 'BSIT' | 'BLIS' | 'BSCS';

// Enum for Member Rank
export type MemberRank =
    | 'Professor'
    | 'Assistant Professor'
    | 'Associate Professor'
    | 'Instructor'
    | 'Technical Staff'
    | 'Administrative Aide'
    | 'Technician'
    | 'Student'
    | 'Alumnus'
    | 'Alumna'
    | 'Other';
export type MemberProgram = 'BSIT' | 'BLIS' | 'BSCS';

// Research Interface

export interface Research {
    id: number;
    research_title: string;
    funding_source: string | null;
    collaborating_agency: string | null;
    type: ResearchType;
    status: ResearchStatus;
    program: ResearchProgram;
    // Proposal Fields
    start_date: string | null;
    duration: string | null;
    estimated_budget: number | null;
    special_order: string | null; // file path
    // Monitoring Fields
    budget_utilized: number | null;
    completion_percentage: number | null;
    terminal_report: string | null; // file path
    year_completed: string | null;
    // DOST6ps
    publication: string | null;
    patent: string | null;
    product: string | null;
    people_service: string | null;
    place_and_partnership: string | null;
    policy: string | null;
    // Relationships
    members?: Member[];
    utilization?: Utilization | null; // for utilization relationship
}

export interface ResearchFormData {
    research_title: string;
    funding_source: string;
    collaborating_agency: string;
    type: string;
    status: string;
    program: string;
    // Proposal Fields
    start_date: string;
    duration: string;
    estimated_budget: string;
    special_order: File | null;
    // Monitoring Fields
    budget_utilized: string;
    completion_percentage: string;
    terminal_report: File | null;
    year_completed: string;
    //DOST6ps 
    publication: string;
    patent: string;
    product: string;
    people_service: string;
    place_and_partnership: string;
    policy: string;
    // Team Members
    member_ids: number[];
}

// Member Interface

export interface Member {
    id: number;
    full_name: string;
    rank: MemberRank;
    designation: string | null;
    member_program: MemberProgram;
    member_email: string | null;
    orcid: string | null;
    telephone: string | null;
    educational_attainment: string | null;
    specialization: string | null;
    research_interest: string | null;
    profile_photo: string | null;
    created_at: string;
    updated_at: string;
    teaches_grad_school: boolean;
    ongoing: number;
    completed: number;
    publication_count: number;
}

// Interface for MemberFormData

export interface MemberFormData {
    full_name: string;
    rank: string;
    designation: string;
    member_program: string;
    member_email: string;
    orcid: string;
    telephone: string;
    educational_attainment: string;
    specialization: string;
    research_interest: string;
    profile_photo: File | null; // File path
    teaches_grad_school: boolean;
    ongoing: number;
    completed: number;
    publication_count: number;
}

export interface Team {
    id: number;
    research_id: number;
    member_id: number;
    role: string | null;
    created_at: string;
    updated_at: string;
}

export interface Utilization {
    id: number;
    research_id: number;
    research_title: string | null;
    beneficiary: string;
    cert_date: string;
    certificate_of_utilization: string;
}
