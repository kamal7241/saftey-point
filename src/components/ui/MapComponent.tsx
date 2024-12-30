import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';  // Import Leaflet to create custom icons

interface MapComponentProps {
  onLocationSelect: (location: LatLngExpression) => void;
  initialLocation: LatLngExpression;  // Default pin location
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, initialLocation }) => {
  const [position, setPosition] = useState<LatLngExpression>(initialLocation);

  // Define custom icon for the marker
  const customIcon = new L.Icon({
    iconUrl: '/images/icons/custom-marker.png', // Path to your custom icon
    iconSize: [32, 32],  // Size of the icon
    iconAnchor: [16, 32],  // Point of the icon which will correspond to the marker's location
    popupAnchor: [0, -32],  // Point from which the popup should open relative to the iconAnchor
  });

  const MapClickHandler = () => {
    useMapEvent('click', (e) => {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);  // Notify parent form of the new location
    });
    return null;
  };

  return (
    <MapContainer center={position} zoom={13} style={{ width: '100%', height: '400px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* Use the custom icon for the marker */}
      <Marker position={position} icon={customIcon}>
        <Popup>
          A location marker.
        </Popup>
      </Marker>
      <MapClickHandler />
    </MapContainer>
  );
};

export default MapComponent;
