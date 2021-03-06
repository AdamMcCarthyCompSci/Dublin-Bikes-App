let map;

changeCircleColour = (bikes) => {
  if (bikes == 0) {
    return "#8b1a00";
  }
  if (bikes < 5) {
    return "#d25c00";
  } else {
    return "#0877ff";
  }
};

function initMap() {
  fetch("/stations")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 53.345804, lng: -6.26031 },
        restriction: {
          latLngBounds: {
            north: 54.345804,
            south: 52.345804,
            east: -5.26031,
            west: -7.26031,
          },
          strictBounds: false,
        },
        streetViewControl: false,
        mapTypeControl: false,
        zoom: 14,
        styles: darkMap,
      });

      // const bikeLayer = new google.maps.BicyclingLayer();
      // bikeLayer.setMap(map);

      data.forEach((station) => {
        let Circle = new google.maps.Circle({
          strokeColor: changeCircleColour(station.available_bikes),
          strokeOpacity: "0.8",
          strokeWeight: 2,
          fillColor: changeCircleColour(station.available_bikes),
          fillOpacity: 0.35,
          map: map,
          center: { lat: station.pos_lat, lng: station.pos_lng },
          radius: 60,
          clickable: true,
        });
        Circle.addListener("click", () => {
          console.log("hi,", station.name, station.available_bikes, station);
          // const infowindow = new google.maps.InfoWindow({
          //   content:
          //     "<h1>" + station.name + "</h1><b>" + station.bike_stands + "</b>",
          // });
          // infowindow.open(map, Circle);
        });
        Circle.addListener("mouseover", () => {
          if (station.available_bikes == 0) {
            Circle.setOptions({ fillColor: "#d72800", strokeColor: "#d72800" });
          }
          if (station.available_bikes < 5) {
            Circle.setOptions({ fillColor: "#ff9441", strokeColor: "#ff9441" });
          } else {
            Circle.setOptions({ fillColor: "#6eafff", strokeColor: "#6eafff" });
          }
        });
        Circle.addListener("mouseout", () => {
          if (station.available_bikes == 0) {
            Circle.setOptions({ fillColor: "#8b1a00", strokeColor: "#8b1a00" });
          }
          if (station.available_bikes < 5) {
            Circle.setOptions({ fillColor: "#d25c00", strokeColor: "#d25c00" });
          } else {
            Circle.setOptions({ fillColor: "#0877ff", strokeColor: "#0877ff" });
          }
        });

        let Marker = new google.maps.Marker({
          position: { lat: station.pos_lat, lng: station.pos_lng },
          map: map,
          label: {
            text: station.available_bikes.toString(),
            color: "white",
          },
          icon: {
            url:
              "https://icon-library.com/images/circle-icon-png/circle-icon-png-11.jpg",
            size: new google.maps.Size(0, 0),
          },
        });
      });
    })

    .catch((err) => {
      console.log("Error!", err);
    });
}

var darkToggle = false;

function toggleDarkMode() {
  var element = document.body;
  darkToggle = !darkToggle;
  element.classList.toggle("dark-mode");
  if (darkToggle) {
    let darkToggle = document.getElementsByClassName("darkToggle");
    for (var i = 0; i < darkToggle.length; i++) {
      darkToggle[i].style.fill = "#ffffff";
    }
    document.getElementById("darkToggleButton").style.backgroundColor =
      "#2d3142";
    document.getElementById("darkToggleButton").style.borderColor = "#2d3142";
    var mapOptions = { styles: [] };
  } else {
    var mapOptions = { styles: darkMap };
    let darkToggle = document.getElementsByClassName("darkToggle");
    for (var i = 0; i < darkToggle.length; i++) {
      darkToggle[i].style.fill = "#2d3142";
    }
    document.getElementById("darkToggleButton").style.backgroundColor =
      "#ffffff";
    document.getElementById("darkToggleButton").style.borderColor = "#ffffff";
  }
  map.setOptions(mapOptions);
}
