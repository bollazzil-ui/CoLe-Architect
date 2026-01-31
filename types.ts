
export type ApplicationStatus = 'Draft' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface ApplicationRecord {
  id: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  dateCreated: string;
  coverLetter: string;
  touchpoints: string[];
  jobLink?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  skills: string[];
  documents: ProfileDocument[];
}

export interface ProfileDocument {
  id: string;
  name: string;
  content: string;
  uploadDate: string;
}

export interface JobDetails {
  title: string;
  company: string;
  requirements: string[];
  culture: string;
  summary: string;
  rawText?: string;
}

export interface CoverLetterResponse {
  content: string;
  touchpoints: string[];
  suggestions: string[];
}
