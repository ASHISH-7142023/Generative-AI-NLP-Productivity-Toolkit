import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient, ApiClientError } from '../client';

describe('ApiClient & ApiClientError', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('correctly constructs ApiClientError instance', () => {
    const error = new ApiClientError('Test error message', 'VALIDATION_FAILED', 422);
    expect(error.name).toBe('ApiClientError');
    expect(error.message).toBe('Test error message');
    expect(error.code).toBe('VALIDATION_FAILED');
    expect(error.statusCode).toBe(422);
  });

  it('successfully fetches health status', async () => {
    const mockHealth = {
      status: 'ok',
      service: 'nlp-productivity-toolkit',
      version: '1.0.0',
      model_configured: 'gpt-4o-mini',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockHealth,
    } as Response);

    const res = await apiClient.getHealth();
    expect(res.status).toBe('ok');
    expect(res.model_configured).toBe('gpt-4o-mini');
  });

  it('translates network failure into helpful error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    await expect(apiClient.getHealth()).rejects.toThrow(
      /Cannot connect to backend server/
    );
  });
});
