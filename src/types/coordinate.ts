/**
 * @fileoverview TypeScript types for coordinate data structures.
 */

/** Decimal Degrees coordinate format */
export interface DDCoordinate {
  latitude: number;
  longitude: number;
}

/** Degrees Minutes Seconds coordinate format */
export interface DMSValue {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

export interface DMSCoordinate {
  latitude: DMSValue;
  longitude: DMSValue;
}

/** Conversion mode selection */
export type ConversionMode = 'DMS_TO_DD' | 'DD_TO_DMS';

/** Marker stored on the map */
export interface MapMarker {
  id: string;
  coordinate: DDCoordinate;
}
