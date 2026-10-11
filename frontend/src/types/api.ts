export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  model_configured: string;
}

export interface FeatureResponse {
  success: boolean;
  feature: string;
  result: string;
}

export interface ErrorDetail {
  code: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: ErrorDetail;
}

export interface EDAPayload {
  dataset_description: string;
  filename?: string;
  analysis_goals?: string;
}

export interface VisualizationPayload {
  dataset_description: string;
  dataframe_name?: string;
  visualization_goal?: string;
  columns?: string;
}

export type ResumeStyle = 'concise' | 'standard' | 'detailed';

export interface ResumePayload {
  experience: string;
  target_role?: string;
  style?: ResumeStyle;
}

export type InterviewDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface InterviewPayload {
  language: string;
  difficulty: InterviewDifficulty;
  count: number;
  topic?: string;
  include_answers?: boolean;
}

export type MeetingStyle = 'concise' | 'standard' | 'action-focused';

export interface MeetingPayload {
  notes: string;
  style?: MeetingStyle;
}
