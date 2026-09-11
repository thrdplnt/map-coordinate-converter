/**
 * @fileoverview Map component using OpenLayers to display OSM tiles, markers, and handle click events.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { MapBrowserEvent } from 'ol';
import 'ol/ol.css';

import { DDCoordinate, MapMarker } from '../../types/coordinate';

interface MapProps {
  /** Current permanent markers to display */
  markers: MapMarker[];
  /** Temporary preview coordinate (before Add To Maps) */
  previewCoordinate?: DDCoordinate | null;
  /** Called when user clicks an empty spot on the map */
  onMapClick: (coordinate: DDCoordinate) => void;
  /** Called when user clicks an existing marker */
  onMarkerClick: (marker: MapMarker) => void;
}

/** Style for permanent markers */
const markerStyle = new Style({
  image: new CircleStyle({
    radius: 10,
    fill: new Fill({ color: '#f59e0b' }),
    stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
  }),
});

/** Style for temporary preview marker (dashed/semi-transparent) */
const previewStyle = new Style({
  image: new CircleStyle({
    radius: 10,
    fill: new Fill({ color: 'rgba(245, 158, 11, 0.35)' }),
    stroke: new Stroke({ color: '#f59e0b', width: 2.5, lineDash: [4, 4] }),
  }),
});

/**
 * OpenLayers map component with marker rendering and click interaction.
 * @param props - MapProps
 */
const Map: React.FC<MapProps> = ({ markers, previewCoordinate, onMapClick, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const olMapRef = useRef<OlMap | null>(null);
  const vectorSourceRef = useRef(new VectorSource());
  const previewSourceRef = useRef(new VectorSource());

  /** @description Initializes the OpenLayers map instance */
  useEffect(() => {
    if (!mapRef.current || olMapRef.current) return;

    const map = new OlMap({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: vectorSourceRef.current, style: markerStyle }),
        new VectorLayer({ source: previewSourceRef.current, style: previewStyle }),
      ],
      view: new View({
        center: fromLonLat([118, 0]),
        zoom: 5,
      }),
    });

    olMapRef.current = map;

    return () => {
      map.setTarget(undefined);
      olMapRef.current = null;
    };
  }, []);

  /** @description Centers map to a given coordinate */
  const centerMap = useCallback((coordinate: DDCoordinate) => {
    olMapRef.current?.getView().animate({
      center: fromLonLat([coordinate.longitude, coordinate.latitude]),
      zoom: 10,
      duration: 600,
    });
  }, []);

  /** @description Syncs permanent markers with vector source */
  useEffect(() => {
    const source = vectorSourceRef.current;
    source.clear();

    markers.forEach((marker) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([marker.coordinate.longitude, marker.coordinate.latitude])),
        markerId: marker.id,
      });
      source.addFeature(feature);
    });

    if (markers.length > 0) {
      centerMap(markers[markers.length - 1].coordinate);
    }
  }, [markers, centerMap]);

  /** @description Shows or hides the temporary preview marker and centers map on it */
  useEffect(() => {
    const source = previewSourceRef.current;
    source.clear();

    if (previewCoordinate) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([previewCoordinate.longitude, previewCoordinate.latitude])),
      });
      source.addFeature(feature);
      centerMap(previewCoordinate);
    }
  }, [previewCoordinate, centerMap]);

  /** @description Handles click events on the map */
  const handleMapClick = useCallback(
    (event: MapBrowserEvent<UIEvent>) => {
      const map = olMapRef.current;
      if (!map) return;

      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);

      if (feature && feature.get('markerId')) {
        const markerId = feature.get('markerId') as string;
        const marker = markers.find((m) => m.id === markerId);
        if (marker) {
          onMarkerClick(marker);
          centerMap(marker.coordinate);
        }
      } else {
        const [lon, lat] = toLonLat(event.coordinate);
        onMapClick({ latitude: lat, longitude: lon });
      }
    },
    [markers, onMapClick, onMarkerClick, centerMap]
  );

  useEffect(() => {
    const map = olMapRef.current;
    if (!map) return;
    map.on('click', handleMapClick);
    return () => map.un('click', handleMapClick);
  }, [handleMapClick]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default Map;
