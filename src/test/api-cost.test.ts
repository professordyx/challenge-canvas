import { describe, expect, it } from 'vitest';
import { estimateCost } from '@/lib/api-monitoring';
const claude = { model: 'c', input_per_mtok: 3, output_per_mtok: 15, per_image: 0 };
const image = { model: 'g', input_per_mtok: 2, output_per_mtok: 0, per_image: 0.134 };
describe('estimateCost', () => {
  it('multiplies tokens by per-million prices', () => expect(estimateCost({ success: true, input_tokens: 1_000_000, output_tokens: 100_000 }, claude)).toBeCloseTo(4.5));
  it('charges per image plus input tokens', () => expect(estimateCost({ success: true, input_tokens: 500_000, output_tokens: 1290 }, image)).toBeCloseTo(1.134));
  it('failed calls cost zero', () => expect(estimateCost({ success: false, input_tokens: 1000, output_tokens: 1000 }, claude)).toBe(0));
  it('unknown model has no estimate', () => expect(estimateCost({ success: true, input_tokens: 1, output_tokens: 1 }, null)).toBeNull());
});
