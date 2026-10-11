import {
  EDAPayload,
  VisualizationPayload,
  ResumePayload,
  InterviewPayload,
  MeetingPayload,
  FeatureResponse,
  HealthResponse,
  ErrorResponse,
} from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClientError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string = 'API_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (data && (data as ErrorResponse).error) {
        const err = (data as ErrorResponse).error;
        throw new ApiClientError(err.message, err.code, res.status);
      }
      throw new ApiClientError(
        `Request failed with status ${res.status}: ${res.statusText}`,
        'HTTP_ERROR',
        res.status
      );
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof ApiClientError) {
      throw err;
    }
    // Handle network disconnection or server offline
    throw new ApiClientError(
      'Cannot connect to backend server. Please ensure the FastAPI server is running on http://localhost:8000.',
      'NETWORK_ERROR',
      0
    );
  }
}

export const apiClient = {
  async getHealth(): Promise<HealthResponse> {
    return request<HealthResponse>('/api/health', { method: 'GET' });
  },

  async generateEDA(payload: EDAPayload): Promise<FeatureResponse> {
    return request<FeatureResponse>('/api/generate/eda', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async generateVisualization(payload: VisualizationPayload): Promise<FeatureResponse> {
    return request<FeatureResponse>('/api/generate/visualization', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async generateResume(payload: ResumePayload): Promise<FeatureResponse> {
    return request<FeatureResponse>('/api/generate/resume', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async generateInterviewQuestions(payload: InterviewPayload): Promise<FeatureResponse> {
    return request<FeatureResponse>('/api/generate/interview-questions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async summarizeMeeting(payload: MeetingPayload): Promise<FeatureResponse> {
    return request<FeatureResponse>('/api/summarize/meeting', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export { ApiClientError };
