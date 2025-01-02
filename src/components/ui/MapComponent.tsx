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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(10);

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

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0]; // Get the first result
        const newPosition: LatLngExpression = [lat, lon];
        setPosition(newPosition); // Update the position state
        onLocationSelect(newPosition); // Notify parent form of the new location
        setZoom(13); // Set zoom level
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Error fetching location');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a location"
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <button onClick={handleSearch} type='button' className="mb-4 p-2 bg-blue-500 text-white rounded">
        Search
      </button>
      <MapContainer center={position} zoom={zoom} style={{ width: '100%', height: '400px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* Use the custom icon for the marker */}
        <Marker position={position} icon={customIcon}>
          <Popup>
            A location marker.
          </Popup>
        </Marker>
        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default MapComponent;