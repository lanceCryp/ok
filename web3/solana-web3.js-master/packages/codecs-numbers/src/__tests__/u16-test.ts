import { Endian } from '../common';
import { getU16Codec } from '../u16';
import { assertRangeError, assertValid, assertValidEncode } from './__setup__';

const MIN = 0;
const MAX = Number('0xffff');
const HALF = Number('0xff');
const u16 = getU16Codec;
const rangeErrorValues = {
    codecDescription: 'u16',
    max: MAX,
    min: MIN,
};

describe('getU16Codec', () => {
    it('encodes and decodes u16 numbers', () => {
        expect.hasAssertions();
        const u16LE = u16();
        const u16BE = u16({ endian: Endian.Big });

        assertValid(u16LE, 1, '0100');
        assertValid(u16BE, 1, '0001');
        assertValid(u16LE, 42, '2a00');
        assertValid(u16BE, 42, '002a');
        assertValidEncode(u16LE, 1n, '0100');
        assertValidEncode(u16BE, 1n, '0001');
        assertValidEncode(u16LE, 42n, '2a00');
        assertValidEncode(u16BE, 42n, '002a');

        // Half bytes.
        assertValid(u16LE, HALF, 'ff00');
        assertValid(u16BE, HALF, '00ff');
        assertValidEncode(u16LE, BigInt(HALF), 'ff00');
        assertValidEncode(u16BE, BigInt(HALF), '00ff');

        // Pre-boundaries.
        assertValid(u16LE, MIN + 1, '0100');
        assertValid(u16BE, MIN + 1, '0001');
        assertValid(u16LE, MAX - 1, 'feff');
        assertValid(u16BE, MAX - 1, 'fffe');
        assertValidEncode(u16LE, BigInt(MIN + 1), '0100');
        assertValidEncode(u16BE, BigInt(MIN + 1), '0001');
        assertValidEncode(u16LE, BigInt(MAX - 1), 'feff');
        assertValidEncode(u16BE, BigInt(MAX - 1), 'fffe');

        // Boundaries.
        assertValid(u16LE, MIN, '0000');
        assertValid(u16BE, MIN, '0000');
        assertValid(u16LE, MAX, 'ffff');
        assertValid(u16BE, MAX, 'ffff');
        assertValidEncode(u16LE, BigInt(MIN), '0000');
        assertValidEncode(u16BE, BigInt(MIN), '0000');
        assertValidEncode(u16LE, BigInt(MAX), 'ffff');
        assertValidEncode(u16BE, BigInt(MAX), 'ffff');

        // Out of range.
        assertRangeError(rangeErrorValues, u16LE, MIN - 1);
        assertRangeError(rangeErrorValues, u16BE, MIN - 1);
        assertRangeError(rangeErrorValues, u16LE, MAX + 1);
        assertRangeError(rangeErrorValues, u16BE, MAX + 1);
        assertRangeError(rangeErrorValues, u16LE, BigInt(MIN - 1));
        assertRangeError(rangeErrorValues, u16BE, BigInt(MIN - 1));
        assertRangeError(rangeErrorValues, u16LE, BigInt(MAX + 1));
        assertRangeError(rangeErrorValues, u16BE, BigInt(MAX + 1));
    });

    it('has the right size', () => {
        expect(u16().fixedSize).toBe(2);
    });
});
