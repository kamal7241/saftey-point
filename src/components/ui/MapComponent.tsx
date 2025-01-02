import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvent,
  ZoomControl,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import React, { useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapComponentProps {
  onLocationSelect: (location: LatLngExpression) => void;
  initialLocation: LatLngExpression;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const [position, setPosition] = useState<LatLngExpression>(initialLocation);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zoom, setZoom] = useState<number>(10);
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input

  const customIcon = new L.Icon({
    iconUrl: "/images/icons/custom-marker.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const MapClickHandler = () => {
    useMapEvent("click", (e) => {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    });
    return null;
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
  
        const newPosition: LatLngExpression = [lat, lon];
        console.log('newPosition',newPosition)
        setPosition(newPosition);
        onLocationSelect(newPosition);
        setZoom(13);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Error fetching location");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default form submission
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Add key down event
        placeholder="Search for a location"
        className="absolute left-6 right-6 top-4 z-10 block rounded border border-gray-300 p-2"
      />
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ width: "100%", height: "234px" }}
        className="z-[1]"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={customIcon} />
        <ZoomControl position="bottomright"/>
        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default MapComponent;