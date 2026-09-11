/**
 * @fileoverview Form component for converting Decimal Degrees to DMS coordinates.
 */

import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { convertDDToDms, formatDMS } from '../../utils/coordinateConverter';
import { DDCoordinate, DMSCoordinate } from '../../types/coordinate';

interface DdToDmsFormProps {
  /** Initial coordinate values (e.g. from map click or marker click) */
  initialCoordinate?: DDCoordinate | null;
  /** Called when user clicks Add To Maps / Update */
  onAddToMap: (coordinate: DDCoordinate) => void;
  /** Called when coordinate input changes (for preview marker) */
  onPreviewChange: (coordinate: DDCoordinate | null) => void;
  /** Whether we are editing an existing marker */
  isEditMode?: boolean;
}

/**
 * Form for inputting DD coordinates and converting them to DMS.
 * @param props - DdToDmsFormProps
 */
const DdToDmsForm: React.FC<DdToDmsFormProps> = ({
  initialCoordinate,
  onAddToMap,
  onPreviewChange,
  isEditMode = false,
}) => {
  const [latitude, setLatitude] = useState(initialCoordinate?.latitude.toFixed(6) ?? '');
  const [longitude, setLongitude] = useState(initialCoordinate?.longitude.toFixed(6) ?? '');
  const [result, setResult] = useState<DMSCoordinate | null>(null);

  useEffect(() => {
    if (initialCoordinate) {
      setLatitude(initialCoordinate.latitude.toFixed(6));
      setLongitude(initialCoordinate.longitude.toFixed(6));
      setResult(null);
    }
  }, [initialCoordinate]);

  /** @description Update preview marker whenever lat/lon input changes */
  useEffect(() => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      onPreviewChange({ latitude: lat, longitude: lon });
    } else {
      onPreviewChange(null);
    }
  }, [latitude, longitude, onPreviewChange]);

  /** @description Performs DD to DMS conversion and updates result state */
  const handleConvert = () => {
    const dd: DDCoordinate = { latitude: +latitude, longitude: +longitude };
    setResult(convertDDToDms(dd));
  };

  const handleAdd = () => {
    onAddToMap({ latitude: +latitude, longitude: +longitude });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-slate-500 font-medium">Convert Coordinate DD to DMS</p>

      <div className="flex flex-col gap-2">
        <Input
          id="dd-lat"
          label="Latitude"
          placeholder="e.g. 90.000000"
          value={latitude}
          onChange={e => setLatitude(e.target.value)}
          type="number"
          unit="deg"
        />
        <Input
          id="dd-lon"
          label="Longitude"
          placeholder="e.g. 33.230000"
          value={longitude}
          onChange={e => setLongitude(e.target.value)}
          type="number"
          unit="deg"
        />
      </div>

      <Button size="sm" onClick={handleConvert} disabled={!latitude || !longitude} className="self-end">Convert</Button>

      {result && (
        <div className="bg-slate-50 rounded-lg p-3 flex flex-col gap-1 border border-slate-100">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Latitude</span>
            <span className="font-mono text-slate-800">{formatDMS(result.latitude)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Longitude</span>
            <span className="font-mono text-slate-800">{formatDMS(result.longitude)}</span>
          </div>
        </div>
      )}

      <Button onClick={handleAdd} disabled={!latitude || !longitude} className="w-full mt-1">
        {isEditMode ? 'Update' : 'Add To Maps'}
      </Button>
    </div>
  );
};

export default DdToDmsForm;
