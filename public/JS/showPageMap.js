maptilersdk.config.apiKey = maptilerApiKey;
const mapContainer = document.getElementById("map");
const camp = JSON.parse(decodeURIComponent(mapContainer.dataset.camp));

const map = new maptilersdk.Map({
  container: "map", // container's id
  style: maptilersdk.MapStyle.STREETS,
  center: camp.geometry.coordinates, // Starting position [lng, lat]
  zoom: 14, // Starting zoom
  terrain: true,
  terrainControl: true,
  pitch: 70,
  bearing: -100.86,
  maxPitch: 85,
  maxZoom: 14,
});

const marker = new maptilersdk.Marker()
  .setLngLat(camp.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(`<h3>${camp.title}</h3><p>${camp.location}</p>`)
  )
  .addTo(map);
