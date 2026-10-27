import { describe, expect, it } from 'vitest';
import { classifyApiError, tokenCount } from '../../supabase/functions/_shared/telemetry-data';
import { successRate } from '../lib/api-monitoring';

describe('API monitoring', () => {
  it('distinguishes exhausted Gemini credits from temporary rate limits', () => {
    expect(classifyApiError(429, 'Your prepayment credits are depleted').code).toBe('credits_exhausted');
    expect(classifyApiError(429, 'Rate limit exceeded').code).toBe('rate_limit');
  });
  it('never exposes raw provider errors or credentials', () => {
    expect(classifyApiError(401, 'private-api-key-do-not-return').message).not.toContain('private-api-key-do-not-return');
    expect(classifyApiError(401, 'private-api-key-do-not-return').code).toBe('authentication_error');
  });
  it('does not report unknown token usage as zero', () => {
    expect(tokenCount(undefined)).toBeNull();
    expect(tokenCount(0)).toBe(0);
    expect(tokenCount(125)).toBe(125);
  });
  it('counts failed API attempts in success rate', () => {
    expect(successRate(10, 2)).toBe(80);
    expect(successRate(0, 0)).toBeNull();
  });
});