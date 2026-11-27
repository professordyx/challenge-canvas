import { describe, expect, it } from 'vitest';
import { PLAN_RULES, PREMIUM_MONTHLY_USD } from '@/lib/plans';

describe('approved monthly plan rules', () => {
  it('allows one free canvas per month', () => expect(PLAN_RULES.free.canvases).toBe(1));
  it('allows one free evaluation per month', () => expect(PLAN_RULES.free.evaluations).toBe(1));
  it('allows one free infographic per month', () => expect(PLAN_RULES.free.infographics).toBe(1));
  it('reserves recording for Premium', () => expect(PLAN_RULES.free.recording).toBe(false));
  it('reserves the assistant for Premium', () => expect(PLAN_RULES.free.assistant).toBe(false));
  it('prices Premium at USD 5 per month', () => expect(PREMIUM_MONTHLY_USD).toBe(5));
  it('allows unlimited Premium canvases', () => expect(PLAN_RULES.premium.canvases).toBe(Infinity));
  it('allows unlimited Premium evaluations', () => expect(PLAN_RULES.premium.evaluations).toBe(Infinity));
  it('allows unlimited Premium infographics', () => expect(PLAN_RULES.premium.infographics).toBe(Infinity));
  it('includes Premium recording', () => expect(PLAN_RULES.premium.recording).toBe(true));
  it('includes the Premium assistant', () => expect(PLAN_RULES.premium.assistant).toBe(true));
});