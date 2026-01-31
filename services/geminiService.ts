import { UserProfile, JobDetails, CoverLetterResponse } from "../types";

/**
 * Uses the backend API to find details about a job from a link.
 */
export async function analyzeJobLink(link: string): Promise<JobDetails> {
  const response = await fetch('/api/analyze-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ link }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze job link');
  }

  return response.json();
}

/**
 * Uses the backend API to generate a cover letter.
 */
export async function generateCoverLetter(
  job: JobDetails, 
  profile: UserProfile
): Promise<CoverLetterResponse> {
  const response = await fetch('/api/generate-cover-letter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ job, profile }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate cover letter');
  }

  return response.json();
}
