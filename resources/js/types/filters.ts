export interface ResearchFilterData {
  type: "any" | "program" | "project" | "study";
  year_completed?: string; 
  status?: "ongoing" | "completed" | "terminated" | "";
  program?: "BSIT" | "BLIS" | "BSCS" | "any";
}

export interface MemberFilterData {
  rank: "any" | "Professor" | "Assistant Professor" | "Associate Professor" | "Instructor" | "Technical Staff" | "Administrative Aide" | "Technician" | "Student" | "Alumnus" | "Alumna" | "Other" | string;
  member_program: "any" | "BSIT" | "BLIS" | "BSCS" | string;
  sort?: "default" | "asc" | "desc";
  //id?: "default" | "asc" | "desc";
  teaches_grad_school?: "1" | "0";
}

export interface PublicationFiltersData {
  search?: string;
  publication_program?: string;
  year_from?: string;
  year_to?: string;
  sort?: "default" | "asc" | "desc";
}

export interface UtilizationFiltersData {
  search?: string;
  date_from?: string;
  date_to?: string;
  sort?: "default" | "asc" | "desc";
}
export interface ProposalFiltersData {
  program: string | "any";
  year_completed: string | "any";
  sort: "default" | "asc" | "desc";
  search?: string;
}

export interface UserFiltersData {
  role?: "any" | "admin" | "user";
  sort?: "asc" | "desc"; // remove "default"
  search?: string;
}


