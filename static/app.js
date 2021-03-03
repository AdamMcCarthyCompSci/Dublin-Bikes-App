let map;

function initMap() {
  fetch("/stations")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 53.349804, lng: -6.26031 },
        zoom: 5,
      });

      data.forEach((station) => {
        const circle = new google.maps.Circle({
          strokeColor: "FF0000",
          strokeOpacity: "0.8",
          strokeWeight: 2,
          fillColor: "ff0000",
          fillOpacity: 0.35,
          map: map,
          center: { lat: station.pos_lat, lng: station.pos_lng },
          radius: 100,
        });
        circle.addListener("click", () => {
          const infowindow = new google.maps.InfoWindow({
            content:
              "<h1>" + station.name + "</h1><b>" + station.bike_stands + "</b>",
          });
          infowindow.open(map, circle);
        });
      });
    })

    .catch((err) => {
      console.log("Error!", err);
    });
}
