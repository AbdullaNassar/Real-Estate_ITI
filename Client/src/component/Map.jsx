import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MyMap({ lat = 30.0444, lng = 31.2357 }) {
  const center = [lat, lng]; // Cairo
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}>
        <Popup>Cairo, Egypt</Popup>
      </Marker>
    </MapContainer>
  );
}
