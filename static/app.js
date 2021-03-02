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
      });

      data.forEach((station) => {
        const marker = new google.maps.Marker({
          position: { lat: station.pos_lat, lng: station.pos_lng },
          map: map,
        });
        marker.addListener("click", () => {
          const infowindow = new google.maps.InfoWindow({
            content:
              "<h1>" + station.name + "</h1><b>" + station.bike_stands + "</b>",
          });
          infowindow.open(map, marker);
        });
      });
    })

    .catch((err) => {
      console.log("Error!", err);
    });
}
