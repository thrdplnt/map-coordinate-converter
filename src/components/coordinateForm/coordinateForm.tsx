/**
 * @fileoverview Main coordinate form popup with tab switching between DMS↔DD conversion modes.
 */

import React, { useState } from 'react';
import { Tabs } from '../ui/tabs';
import DmsToDdForm from './dmsToDdForm';
import DdToDmsForm from './ddToDmsForm';
import { ConversionMode, DDCoordinate } from '../../types/coordinate';

interface CoordinateFormProps {
  /** Whether the form popup is visible */
  isOpen: boolean;
  /** Coordinate pre-filled from map click or marker click */
  coordinate?: DDCoordinate | null;
  /** Called when user adds/updates a coordinate to the map */
  onAddToMap: (coordinate: DDCoordinate) => void;
  /** Called to update an existing marker */
  onUpdateCoordinate: (coordinate: DDCoordinate) => void;
  /** Called when coordinate changes in form (for preview marker) */
  onPreviewChange: (coordinate: DDCoordinate | null) => void;
  /** Whether we're in edit (update) mode */
  isEditMode?: boolean;
  /** Called to close the form */
  onClose: () => void;
}

const TABS = [
  { id: 'DMS_TO_DD', label: 'DMS to DD' },
  { id: 'DD_TO_DMS', label: 'DD to DMS' },
];

/**
 * Popup form for coordinate conversion, supports both DMS→DD and DD→DMS modes.
 * @param props - CoordinateFormProps
 */
const CoordinateForm: React.FC<CoordinateFormProps> = ({
  isOpen,
  coordinate,
  onAddToMap,
  onUpdateCoordinate,
  onPreviewChange,
  isEditMode = false,
  onClose,
}) => {
  const [mode, setMode] = useState<ConversionMode>('DMS_TO_DD');

  if (!isOpen) return null;

  /** @description Selects conversion mode tab */
  const selectMode = (id: string) => setMode(id as ConversionMode);

  const handleAdd = (coord: DDCoordinate) => {
    if (isEditMode) {
      onUpdateCoordinate(coord);
    } else {
      onAddToMap(coord);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:pr-6 sm:pb-6 pointer-events-none">
      <div
        className="pointer-events-auto w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-slide-up"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-slate-800">
            {isEditMode ? 'Update Coordinate' : 'Add Coordinate'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-2">
          <Tabs tabs={TABS} activeTab={mode} onTabChange={selectMode} />
        </div>

        {/* Form body */}
        <div className="px-4 pb-4 overflow-y-auto flex-1">
          {mode === 'DMS_TO_DD' ? (
            <DmsToDdForm initialCoordinate={coordinate} onAddToMap={handleAdd} onPreviewChange={onPreviewChange} isEditMode={isEditMode} />
          ) : (
            <DdToDmsForm initialCoordinate={coordinate} onAddToMap={handleAdd} onPreviewChange={onPreviewChange} isEditMode={isEditMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordinateForm;
