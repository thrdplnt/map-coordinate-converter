/**
 * @fileoverview Root application component. Orchestrates the map, floating button, and coordinate form.
 */

import React, { useState, useCallback } from 'react';
import Map from './components/map/map';
import FloatingButton from './components/map/floatingButton';
import CoordinateForm from './components/coordinateForm/coordinateForm';
import { DDCoordinate, MapMarker } from './types/coordinate';

/**
 * Root App component. Manages global state for markers, form visibility, and edit mode.
 */
const App: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [clickedCoordinate, setClickedCoordinate] = useState<DDCoordinate | null>(null);
  const [previewCoordinate, setPreviewCoordinate] = useState<DDCoordinate | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  /** @description Opens the form via floating button */
  const openForm = useCallback(() => {
    setClickedCoordinate(null);
    setSelectedMarker(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  }, []);

  /** @description Handles map click — pre-fills form and shows preview marker */
  const handleMapClick = useCallback((coordinate: DDCoordinate) => {
    setClickedCoordinate(coordinate);
    setPreviewCoordinate(coordinate);
    setSelectedMarker(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  }, []);

  /** @description Handles existing marker click — opens form in edit mode */
  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
    setClickedCoordinate(marker.coordinate);
    setPreviewCoordinate(null);
    setIsEditMode(true);
    setIsFormOpen(true);
  }, []);

  /** @description Adds a new permanent marker and clears preview */
  const handleAddToMap = useCallback((coordinate: DDCoordinate) => {
    const newMarker: MapMarker = {
      id: `marker-${Date.now()}`,
      coordinate,
    };
    setMarkers((prev) => [...prev, newMarker]);
    setPreviewCoordinate(null);
  }, []);

  /** @description Updates an existing marker position */
  const handleUpdateCoordinate = useCallback((coordinate: DDCoordinate) => {
    if (!selectedMarker) return;
    setMarkers((prev) =>
      prev.map((m) => (m.id === selectedMarker.id ? { ...m, coordinate } : m))
    );
    setPreviewCoordinate(null);
  }, [selectedMarker]);

  /** @description Closes form and clears preview marker */
  const handleClose = useCallback(() => {
    setIsFormOpen(false);
    setPreviewCoordinate(null);
  }, []);

  const activeCoordinate = selectedMarker?.coordinate ?? clickedCoordinate;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <Map
          markers={markers}
          previewCoordinate={previewCoordinate}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {markers.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 shadow text-xs font-medium text-slate-700">
          {markers.length} marker{markers.length !== 1 ? 's' : ''} on map
        </div>
      )}

      <FloatingButton isOpen={isFormOpen} onOpen={openForm} />

      <CoordinateForm
        isOpen={isFormOpen}
        coordinate={activeCoordinate}
        onAddToMap={handleAddToMap}
        onUpdateCoordinate={handleUpdateCoordinate}
        onPreviewChange={setPreviewCoordinate}
        isEditMode={isEditMode}
        onClose={handleClose}
      />
    </div>
  );
};

export default App;
