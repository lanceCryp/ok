import { Endian } from '../common';
import { getI16Codec } from '../i16';
import { assertRangeError, assertValid, assertValidEncode } from './__setup__';

const MIN = -Number('0x7fff') - 1;
const MAX = Number('0x7fff');
const i16 = getI16Codec;
const rangeErrorValues = {
    codecDescription: 'i16',
    max: MAX,
    min: MIN,
};

describe('getI16Codec', () => {
    it('encodes and decodes i16 numbers', () => {
        expect.hasAssertions();
        const i16LE = i16();
        const i16BE = i16({ endian: Endian.Big });

        assertValid(i16LE, 0, '0000');
        assertValid(i16BE, 0, '0000');
        assertValid(i16LE, 1, '0100');
        assertValid(i16BE, 1, '0001');
        assertValid(i16LE, 42, '2a00');
        assertValid(i16BE, 42, '002a');
        assertValidEncode(i16LE, 0n, '0000');
        assertValidEncode(i16BE, 0n, '0000');
        assertValidEncode(i16LE, 1n, '0100');
        assertValidEncode(i16BE, 1n, '0001');
        assertValidEncode(i16LE, 42n, '2a00');
        assertValidEncode(i16BE, 42n, '002a');
        assertValid(i16LE, -1, 'ffff');
        assertValid(i16BE, -1, 'ffff');
        assertValid(i16LE, -42, 'd6ff');
        assertValid(i16BE, -42, 'ffd6');

        // Pre-boundaries.
        assertValid(i16LE, MIN + 1, '0180');
        assertValid(i16BE, MIN + 1, '8001');
        assertValid(i16LE, MAX - 1, 'fe7f');
        assertValid(i16BE, MAX - 1, '7ffe');
        assertValidEncode(i16LE, BigInt(MIN + 1), '0180');
        assertValidEncode(i16BE, BigInt(MIN + 1), '8001');
        assertValidEncode(i16LE, BigInt(MAX - 1), 'fe7f');
        assertValidEncode(i16BE, BigInt(MAX - 1), '7ffe');

        // Boundaries.
        assertValid(i16LE, MIN, '0080');
        assertValid(i16BE, MIN, '8000');
        assertValid(i16LE, MAX, 'ff7f');
        assertValid(i16BE, MAX, '7fff');
        assertValidEncode(i16LE, BigInt(MIN), '0080');
        assertValidEncode(i16BE, BigInt(MIN), '8000');
        assertValidEncode(i16LE, BigInt(MAX), 'ff7f');
        assertValidEncode(i16BE, BigInt(MAX), '7fff');

        // Out of range.
        assertRangeError(rangeErrorValues, i16LE, MIN - 1);
        assertRangeError(rangeErrorValues, i16BE, MIN - 1);
        assertRangeError(rangeErrorValues, i16LE, MAX + 1);
        assertRangeError(rangeErrorValues, i16BE, MAX + 1);
        assertRangeError(rangeErrorValues, i16LE, BigInt(MIN - 1));
        assertRangeError(rangeErrorValues, i16BE, BigInt(MIN - 1));
        assertRangeError(rangeErrorValues, i16LE, BigInt(MAX + 1));
        assertRangeError(rangeErrorValues, i16BE, BigInt(MAX + 1));
    });

    it('has the right size', () => {
        expect(i16().fixedSize).toBe(2);
    });
});
