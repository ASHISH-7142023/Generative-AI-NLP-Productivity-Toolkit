export type FeatureType = 'eda' | 'visualization' | 'resume' | 'interview' | 'meeting';

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  model_configured: string;
}

export interface SystemMetricsResponse {
  status: string;
  service: string;
  version: string;
  uptime_seconds: number;
  python_version: string;
  configured_model: string;
  active_endpoints: number;
}

export interface UsageMetadata {
  estimated_tokens?: number;
  character_count: number;
}

export interface FeatureResponse {
  success: boolean;
  feature: FeatureType | string;
  result: string;
  usage?: UsageMetadata;
}

export interface ErrorDetail {
  code: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: ErrorDetail;
}

export interface BaseGenerationPayload {
  temperature?: number;
}

export interface EDAPayload extends BaseGenerationPayload {
  dataset_description: string;
  filename?: string;
  analysis_goals?: string;
  eda_mode?: string;
}

export interface VisualizationPayload extends BaseGenerationPayload {
  dataset_description: string;
  dataframe_name?: string;
  visualization_goal?: string;
  columns?: string;
}

export type ResumeStyle = 'concise' | 'standard' | 'detailed';

export interface ResumePayload extends BaseGenerationPayload {
  experience: string;
  target_role?: string;
  style?: ResumeStyle;
}

export type InterviewDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface InterviewPayload extends BaseGenerationPayload {
  language: string;
  difficulty: InterviewDifficulty;
  count: number;
  topic?: string;
  include_answers?: boolean;
}

export type MeetingStyle = 'concise' | 'standard' | 'action-focused';

export interface MeetingPayload extends BaseGenerationPayload {
  notes: string;
  style?: MeetingStyle;
}
