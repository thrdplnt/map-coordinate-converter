/**
 * @fileoverview Unit tests for CoordinateConverter utility functions.
 */

import {
  dmsToDd,
  ddToDms,
  convertDmsToDD,
  convertDDToDms,
  formatDMS,
} from '../utils/coordinateConverter';
import { DMSValue } from '../types/coordinate';

describe('dmsToDd', () => {
  it('converts North DMS to positive DD', () => {
    const dms: DMSValue = { degrees: 49, minutes: 30, seconds: 10, direction: 'N' };
    expect(dmsToDd(dms)).toBeCloseTo(49.5028, 3);
  });

  it('converts South DMS to negative DD', () => {
    const dms: DMSValue = { degrees: 49, minutes: 30, seconds: 10, direction: 'S' };
    expect(dmsToDd(dms)).toBeCloseTo(-49.5028, 3);
  });

  it('converts East DMS to positive DD', () => {
    const dms: DMSValue = { degrees: 123, minutes: 30, seconds: 20, direction: 'E' };
    expect(dmsToDd(dms)).toBeCloseTo(123.5056, 3);
  });

  it('converts West DMS to negative DD', () => {
    const dms: DMSValue = { degrees: 123, minutes: 30, seconds: 20, direction: 'W' };
    expect(dmsToDd(dms)).toBeCloseTo(-123.5056, 3);
  });

  it('handles zero values', () => {
    const dms: DMSValue = { degrees: 0, minutes: 0, seconds: 0, direction: 'N' };
    expect(dmsToDd(dms)).toBe(0);
  });
});

describe('ddToDms', () => {
  it('converts positive DD to North DMS', () => {
    const result = ddToDms(49.5028, true);
    expect(result.direction).toBe('N');
    expect(result.degrees).toBe(49);
    expect(result.minutes).toBe(30);
  });

  it('converts negative DD to South DMS', () => {
    const result = ddToDms(-49.5028, true);
    expect(result.direction).toBe('S');
    expect(result.degrees).toBe(49);
  });

  it('converts positive DD to East DMS', () => {
    const result = ddToDms(123.5056, false);
    expect(result.direction).toBe('E');
    expect(result.degrees).toBe(123);
  });

  it('converts negative DD to West DMS', () => {
    const result = ddToDms(-123.5056, false);
    expect(result.direction).toBe('W');
  });
});

describe('convertDmsToDD', () => {
  it('converts full DMS coordinate to DD', () => {
    const result = convertDmsToDD({
      latitude: { degrees: 90, minutes: 0, seconds: 0, direction: 'N' },
      longitude: { degrees: 33, minutes: 13, seconds: 48, direction: 'E' },
    });
    expect(result.latitude).toBeCloseTo(90, 4);
    expect(result.longitude).toBeCloseTo(33.23, 2);
  });
});

describe('convertDDToDms', () => {
  it('converts full DD coordinate to DMS', () => {
    const result = convertDDToDms({ latitude: 90, longitude: 33.23 });
    expect(result.latitude.degrees).toBe(90);
    expect(result.latitude.direction).toBe('N');
    expect(result.longitude.degrees).toBe(33);
    expect(result.longitude.direction).toBe('E');
  });
});

describe('formatDMS', () => {
  it('formats DMS value to readable string', () => {
    const dms: DMSValue = { degrees: 49, minutes: 30, seconds: 10, direction: 'N' };
    expect(formatDMS(dms)).toBe("49° 30' 10\" N");
  });
});
