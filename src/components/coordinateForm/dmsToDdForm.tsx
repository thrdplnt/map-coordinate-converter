/**
 * @fileoverview Form component for converting DMS coordinates to Decimal Degrees.
 */

import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { convertDmsToDD, ddToDms } from '../../utils/coordinateConverter';
import { DDCoordinate, DMSCoordinate } from '../../types/coordinate';

interface DmsToDdFormProps {
  /** Initial coordinate values (e.g. from map click) */
  initialCoordinate?: DDCoordinate | null;
  /** Called when user clicks Add To Maps */
  onAddToMap: (coordinate: DDCoordinate) => void;
  /** Called when coordinate input changes (for preview marker) */
  onPreviewChange: (coordinate: DDCoordinate | null) => void;
}

/**
 * Form for inputting DMS coordinates and converting them to DD.
 * @param props - DmsToDdFormProps
 */
const DmsToDdForm: React.FC<DmsToDdFormProps> = ({ initialCoordinate, onAddToMap, onPreviewChange }) => {
  const [latDeg, setLatDeg] = useState('');
  const [latMin, setLatMin] = useState('');
  const [latSec, setLatSec] = useState('');
  const [latDir, setLatDir] = useState<'N' | 'S'>('N');

  const [lonDeg, setLonDeg] = useState('');
  const [lonMin, setLonMin] = useState('');
  const [lonSec, setLonSec] = useState('');
  const [lonDir, setLonDir] = useState<'E' | 'W'>('E');

  const [result, setResult] = useState<DDCoordinate | null>(null);

  /** @description Sync fields when coordinate changes from outside (map click) */
  useEffect(() => {
    if (!initialCoordinate) return;
    const latDms = ddToDms(initialCoordinate.latitude, true);
    const lonDms = ddToDms(initialCoordinate.longitude, false);
    setLatDeg(latDms.degrees.toString());
    setLatMin(latDms.minutes.toString());
    setLatSec(latDms.seconds.toString());
    setLatDir(latDms.direction as 'N' | 'S');
    setLonDeg(lonDms.degrees.toString());
    setLonMin(lonDms.minutes.toString());
    setLonSec(lonDms.seconds.toString());
    setLonDir(lonDms.direction as 'E' | 'W');
    setResult(null);
  }, [initialCoordinate]);

  /** @description Update preview marker whenever DMS fields change */
  useEffect(() => {
    const deg = parseFloat(latDeg);
    const lonD = parseFloat(lonDeg);
    if (!isNaN(deg) && !isNaN(lonD)) {
      const dms: DMSCoordinate = {
        latitude: { degrees: +latDeg, minutes: +(latMin || 0), seconds: +(latSec || 0), direction: latDir },
        longitude: { degrees: +lonDeg, minutes: +(lonMin || 0), seconds: +(lonSec || 0), direction: lonDir },
      };
      onPreviewChange(convertDmsToDD(dms));
    } else {
      onPreviewChange(null);
    }
  }, [latDeg, latMin, latSec, latDir, lonDeg, lonMin, lonSec, lonDir, onPreviewChange]);

  /** @description Performs DMS to DD conversion and updates result state */
  const handleConvert = () => {
    const dms: DMSCoordinate = {
      latitude: { degrees: +latDeg, minutes: +(latMin || 0), seconds: +(latSec || 0), direction: latDir },
      longitude: { degrees: +lonDeg, minutes: +(lonMin || 0), seconds: +(lonSec || 0), direction: lonDir },
    };
    setResult(convertDmsToDD(dms));
  };

  const handleAdd = () => {
    const dms: DMSCoordinate = {
      latitude: { degrees: +latDeg, minutes: +(latMin || 0), seconds: +(latSec || 0), direction: latDir },
      longitude: { degrees: +lonDeg, minutes: +(lonMin || 0), seconds: +(lonSec || 0), direction: lonDir },
    };
    const converted = result ?? convertDmsToDD(dms);
    onAddToMap(converted);
  };

  const canAdd = latDeg !== '' && lonDeg !== '';

  const dirBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-xs font-bold rounded transition-all ${active ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-slate-500 font-medium">Convert Coordinate DMS to DD</p>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-600">Latitude</span>
        <div className="grid grid-cols-3 gap-2">
          <Input id="lat-deg" placeholder="0" value={latDeg} onChange={e => { setLatDeg(e.target.value); setResult(null); }} type="number" unit="°" />
          <Input id="lat-min" placeholder="0" value={latMin} onChange={e => { setLatMin(e.target.value); setResult(null); }} type="number" unit="'" />
          <Input id="lat-sec" placeholder="0" value={latSec} onChange={e => { setLatSec(e.target.value); setResult(null); }} type="number" unit='"' />
        </div>
        <div className="flex gap-1">
          {dirBtn('N', latDir === 'N', () => { setLatDir('N'); setResult(null); })}
          {dirBtn('S', latDir === 'S', () => { setLatDir('S'); setResult(null); })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-600">Longitude</span>
        <div className="grid grid-cols-3 gap-2">
          <Input id="lon-deg" placeholder="0" value={lonDeg} onChange={e => { setLonDeg(e.target.value); setResult(null); }} type="number" unit="°" />
          <Input id="lon-min" placeholder="0" value={lonMin} onChange={e => { setLonMin(e.target.value); setResult(null); }} type="number" unit="'" />
          <Input id="lon-sec" placeholder="0" value={lonSec} onChange={e => { setLonSec(e.target.value); setResult(null); }} type="number" unit='"' />
        </div>
        <div className="flex gap-1">
          {dirBtn('E', lonDir === 'E', () => { setLonDir('E'); setResult(null); })}
          {dirBtn('W', lonDir === 'W', () => { setLonDir('W'); setResult(null); })}
        </div>
      </div>

      <Button size="sm" onClick={handleConvert} disabled={!canAdd} className="self-end">Convert</Button>

      {result && (
        <div className="bg-slate-50 rounded-lg p-3 flex flex-col gap-1 border border-slate-100">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Latitude</span>
            <span className="font-mono text-slate-800">{result.latitude.toFixed(6)} {result.latitude >= 0 ? 'N' : 'S'}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Longitude</span>
            <span className="font-mono text-slate-800">{result.longitude.toFixed(6)} {result.longitude >= 0 ? 'E' : 'W'}</span>
          </div>
        </div>
      )}

      <Button onClick={handleAdd} disabled={!canAdd} className="w-full mt-1">
        Add To Maps
      </Button>
    </div>
  );
};

export default DmsToDdForm;
