import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TripData } from '../types/trip';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showTripInsights, setShowTripInsights] = useState(false);

  const getPolylinePoints = (geojson: { coordinates?: [number, number][] }) => {
    if (!geojson?.coordinates?.length) return [];
    return geojson.coordinates.map((coord) => [coord[1], coord[0]] as [number, number]);
  };

  const mapContent = useMemo(() => {
    if (!tripData) return null;

    const pickupPoints = getPolylinePoints(tripData.route.to_pickup);
    const dropoffPoints = getPolylinePoints(tripData.route.to_dropoff);
    const allPoints = [...pickupPoints, ...dropoffPoints];
    if (!allPoints.length) return null;
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

  const tripInsights = useMemo(() => {
    if (!tripData) return null;
    const allEvents = tripData.daily_logs.flatMap((log) => log.events);
    const fuelStops = allEvents.filter((event) => event.desc === 'Fueling').length;
    const restBreaks = allEvents.filter((event) => event.desc === '30-minute Rest Break').length;
    const mandatoryRests = allEvents.filter((event) => event.desc === 'Mandatory 10-hour Rest').length;

    return { fuelStops, restBreaks, mandatoryRests };
  }, [tripData]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-[550px] relative group">
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

      {tripInsights && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[420px] bg-white/95 backdrop-blur border border-slate-200 rounded-2xl z-[500] shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setShowTripInsights((prev) => !prev)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Route Stops & Rest Info</p>
            {showTripInsights ? (
              <ChevronDown size={16} className="text-slate-500" />
            ) : (
              <ChevronUp size={16} className="text-slate-500" />
            )}
          </button>
          <div className={`transition-all duration-300 ${showTripInsights ? 'max-h-48 opacity-100 p-4 pt-0' : 'max-h-0 opacity-0 p-0'}`}>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 border border-slate-100 py-3">
                <p className="text-[10px] font-black text-slate-400 uppercase">Fuel Stops</p>
                <p className="text-lg font-black text-slate-700">{tripInsights.fuelStops}</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 py-3">
                <p className="text-[10px] font-black text-slate-400 uppercase">30m Breaks</p>
                <p className="text-lg font-black text-slate-700">{tripInsights.restBreaks}</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 py-3">
                <p className="text-[10px] font-black text-slate-400 uppercase">10h Rests</p>
                <p className="text-lg font-black text-slate-700">{tripInsights.mandatoryRests}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MapView);
