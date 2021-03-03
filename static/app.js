let map;

function initMap() {
  fetch("/stations")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 53.349804, lng: -6.26031 },
        zoom: 13,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ],
      });

      data.forEach((station) => {
        const Circle = new google.maps.Circle({
          strokeColor: "#4965c1",
          strokeOpacity: "0.8",
          strokeWeight: 2,
          fillColor: "#3256cc",
          fillOpacity: 0.35,
          map: map,
          center: { lat: station.pos_lat, lng: station.pos_lng },
          radius: station.available_bikes * 5,
          clickable: true,
        });
        Circle.addListener("click", () => {
          console.log("hi,", station.name);
          // const infowindow = new google.maps.InfoWindow({
          //   content:
          //     "<h1>" + station.name + "</h1><b>" + station.bike_stands + "</b>",
          // });
          // infowindow.open(map, Circle);
        });
      });
    })

    .catch((err) => {
      console.log("Error!", err);
    });
}
