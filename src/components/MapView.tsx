import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TripData } from '../types/trip';

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  React.useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

interface MapViewProps {
  tripData: TripData | null;
}

const MapView = ({ tripData }: MapViewProps) => {
  const getPolylinePoints = (geojson: any) => {
    return geojson.coordinates.map((coord: any) => [coord[1], coord[0]] as [number, number]);
  };

  const mapContent = useMemo(() => {
    if (!tripData) return null;

    const pickupPoints = getPolylinePoints(tripData.route.to_pickup);
    const dropoffPoints = getPolylinePoints(tripData.route.to_dropoff);
    const allPoints = [...pickupPoints, ...dropoffPoints];
    const bounds = L.latLngBounds(allPoints);

    return {
      pickupPoints,
      dropoffPoints,
      bounds,
      start: pickupPoints[0],
      pickup: pickupPoints[pickupPoints.length - 1],
      dropoff: dropoffPoints[dropoffPoints.length - 1]
    };
  }, [tripData]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-[500px] relative group">
      <MapContainer 
        center={[39.8283, -98.5795]} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mapContent && (
          <>
            <Polyline 
              positions={mapContent.pickupPoints} 
              color="#94a3b8" 
              dashArray="10, 15"
              weight={4}
            />
            <Polyline 
              positions={mapContent.dropoffPoints} 
              color="#2563eb" 
              weight={6}
            />
            <Marker position={mapContent.start}>
              <Popup className="font-semibold text-gray-700">Starting Location</Popup>
            </Marker>
            <Marker position={mapContent.pickup}>
              <Popup className="font-semibold text-blue-600">Pickup Location</Popup>
            </Marker>
            <Marker position={mapContent.dropoff}>
              <Popup className="font-semibold text-green-600">Dropoff Location</Popup>
            </Marker>
            <ChangeView bounds={mapContent.bounds} />
          </>
        )}
      </MapContainer>
      
      {!tripData && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10 backdrop-blur-sm pointer-events-none">
          <p className="text-gray-400 font-medium text-lg flex flex-col items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">🗺️</span>
            Your route will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(MapView);
