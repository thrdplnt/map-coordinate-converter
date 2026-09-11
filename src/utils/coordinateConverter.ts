/**
 * @fileoverview Utility functions for converting between DMS and DD coordinate formats.
 */

import { DDCoordinate, DMSCoordinate, DMSValue } from '../types/coordinate';

/**
 * Converts a single DMS value to Decimal Degrees.
 * @param dms - The DMS value to convert
 * @returns Decimal degrees as a number (negative for S or W)
 */
export function dmsToDd(dms: DMSValue): number {
  const dd = dms.degrees + dms.minutes / 60 + dms.seconds / 3600;
  return dms.direction === 'S' || dms.direction === 'W' ? -dd : dd;
}

/**
 * Converts a decimal degrees number to DMS format.
 * @param dd - Decimal degrees value
 * @param isLatitude - Whether this is a latitude (true) or longitude (false)
 * @returns DMSValue object
 */
export function ddToDms(dd: number, isLatitude: boolean): DMSValue {
  const absolute = Math.abs(dd);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = parseFloat(((minutesFloat - minutes) * 60).toFixed(2));

  let direction: DMSValue['direction'];
  if (isLatitude) {
    direction = dd >= 0 ? 'N' : 'S';
  } else {
    direction = dd >= 0 ? 'E' : 'W';
  }

  return { degrees, minutes, seconds, direction };
}

/**
 * Converts a full DMS coordinate to DD coordinate.
 * @param dms - The DMS coordinate
 * @returns DD coordinate
 */
export function convertDmsToDD(dms: DMSCoordinate): DDCoordinate {
  return {
    latitude: dmsToDd(dms.latitude),
    longitude: dmsToDd(dms.longitude),
  };
}

/**
 * Converts a full DD coordinate to DMS coordinate.
 * @param dd - The DD coordinate
 * @returns DMS coordinate
 */
export function convertDDToDms(dd: DDCoordinate): DMSCoordinate {
  return {
    latitude: ddToDms(dd.latitude, true),
    longitude: ddToDms(dd.longitude, false),
  };
}

/**
 * Formats a DMSValue to a readable string.
 * @param dms - DMSValue to format
 * @returns Formatted string e.g. "49° 30' 10" N"
 */
export function formatDMS(dms: DMSValue): string {
  return `${dms.degrees}° ${dms.minutes}' ${dms.seconds}" ${dms.direction}`;
}
