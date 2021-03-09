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

  let darkToggle = document.getElementsByClassName("darkToggle");
  for (var i = 0; i < darkToggle.length; i++) {
    darkToggle[i].style.fill = "#2d3142";
  }
}

let markerList = [];
let circleList = [];
let markerToggle = "available_bikes";
fetch("/stations")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let stationData = data;
    // const bikeLayer = new google.maps.BicyclingLayer();
    // bikeLayer.setMap(map);
    data.forEach((station) => {
      let Circle = new google.maps.Circle({
        strokeColor: changeCircleColour(station[markerToggle]),
        strokeOpacity: "0.8",
        strokeWeight: 2,
        fillColor: changeCircleColour(station[markerToggle]),
        fillOpacity: 0.35,
        map: map,
        center: { lat: station.pos_lat, lng: station.pos_lng },
        radius: 60,
        clickable: true,
        available_bikes: station.available_bikes,
        available_bike_stands: station.available_bike_stands,
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
        if (station[markerToggle] == 0) {
          Circle.setOptions({ fillColor: "#d72800", strokeColor: "#d72800" });
        }
        if (station[markerToggle] < 5) {
          Circle.setOptions({ fillColor: "#ff9441", strokeColor: "#ff9441" });
        } else {
          Circle.setOptions({ fillColor: "#6eafff", strokeColor: "#6eafff" });
        }
      });
      Circle.addListener("mouseout", () => {
        if (station[markerToggle] == 0) {
          Circle.setOptions({ fillColor: "#8b1a00", strokeColor: "#8b1a00" });
        }
        if (station[markerToggle] < 5) {
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
        available_bikes: station.available_bikes,
        available_bike_stands: station.available_bike_stands,
      });
      markerList.push(Marker);
      circleList.push(Circle);
    });
  })

  .catch((err) => {
    console.log("Error!", err);
  });

var darkToggle = false;

function toggleDarkMode() {
  var element = document.body;
  darkToggle = !darkToggle;
  element.classList.toggle("dark-mode");
  if (darkToggle) {
    if (!document.getElementById("bikeButton").style.height) {
      document.getElementById("bikeButton").style.backgroundColor === "gray";
      document.getElementById("bikeButton").style.borderColor === "gray";
    }
    if (!document.getElementById("parkingButton").disabled) {
      document.getElementById("parkingButton").style.backgroundColor === "gray";
      document.getElementById("parkingButton").style.borderColor === "gray";
    }
    let darkToggle = document.getElementsByClassName("darkToggle");
    for (var i = 0; i < darkToggle.length; i++) {
      darkToggle[i].style.fill = "#ffffff";
    }
    let darkToggleButton = document.getElementsByClassName("darkToggleButton");
    for (var i = 0; i < darkToggleButton.length; i++) {
      if (darkToggleButton[i].style.backgroundColor !== "gray") {
        darkToggleButton[i].style.backgroundColor = "#2d3142";
        darkToggleButton[i].style.borderColor = "#2d3142";
      }
    }

    var mapOptions = { styles: lightMap };
  } else {
    var mapOptions = { styles: darkMap };
    let darkToggle = document.getElementsByClassName("darkToggle");
    for (var i = 0; i < darkToggle.length; i++) {
      darkToggle[i].style.fill = "#2d3142";
    }
    let darkToggleButton = document.getElementsByClassName("darkToggleButton");
    for (var i = 0; i < darkToggleButton.length; i++) {
      if (darkToggleButton[i].style.backgroundColor !== "gray") {
        darkToggleButton[i].style.backgroundColor = "#ffffff";
        darkToggleButton[i].style.borderColor = "#ffffff";
      }
    }
  }
  map.setOptions(mapOptions);
}

showBikes = () => {
  document.getElementById("parkingButton").disabled = false;
  document.getElementById("bikeButton").disabled = true;
  if (darkToggle) {
    document.getElementById("parkingButton").style.borderColor = "gray";
    document.getElementById("parkingButton").style.backgroundColor = "gray";
    document.getElementById("parkingButton").style.height = "50px";
    document.getElementById("parkingButton").style.marginTop = "10px";
    document.getElementById("bikeButton").style.borderColor = "#2d3142";
    document.getElementById("bikeButton").style.backgroundColor = "#2d3142";
    document.getElementById("bikeButton").style.height = "60px";
    document.getElementById("bikeButton").style.marginTop = "5px";
  }
  if (!darkToggle) {
    document.getElementById("parkingButton").style.borderColor = "gray";
    document.getElementById("parkingButton").style.backgroundColor = "gray";
    document.getElementById("parkingButton").style.height = "50px";
    document.getElementById("parkingButton").style.marginTop = "10px";
    document.getElementById("bikeButton").style.borderColor = "#ffffff";
    document.getElementById("bikeButton").style.backgroundColor = "#ffffff";
    document.getElementById("bikeButton").style.height = "60px";
    document.getElementById("bikeButton").style.marginTop = "5px";
  }
  markerToggle = "available_bikes";
  circleList.forEach((Circle) => {
    Circle.setOptions({
      strokeColor: changeCircleColour(Circle.available_bikes),
      fillColor: changeCircleColour(Circle.available_bikes),
    });
  });
  markerList.forEach((Marker) => {
    Marker.setOptions({
      label: {
        text: Marker.available_bikes.toString(),
        color: "white",
      },
    });
  });
};

showParking = () => {
  document.getElementById("parkingButton").disabled = true;
  document.getElementById("bikeButton").disabled = false;
  if (darkToggle) {
    document.getElementById("parkingButton").style.borderColor = "#2d3142";
    document.getElementById("parkingButton").style.backgroundColor = "#2d3142";
    document.getElementById("parkingButton").style.height = "60px";
    document.getElementById("parkingButton").style.marginTop = "5px";
    document.getElementById("bikeButton").style.borderColor = "gray";
    document.getElementById("bikeButton").style.backgroundColor = "gray";
    document.getElementById("bikeButton").style.height = "50px";
    document.getElementById("bikeButton").style.marginTop = "10px";
  }
  if (!darkToggle) {
    document.getElementById("parkingButton").style.borderColor = "#ffffff";
    document.getElementById("parkingButton").style.backgroundColor = "#ffffff";
    document.getElementById("parkingButton").style.height = "60px";
    document.getElementById("parkingButton").style.marginTop = "5px";
    document.getElementById("bikeButton").style.borderColor = "gray";
    document.getElementById("bikeButton").style.backgroundColor = "gray";
    document.getElementById("bikeButton").style.height = "50px";
    document.getElementById("bikeButton").style.marginTop = "10px";
  }
  markerToggle = "available_bike_stands";
  circleList.forEach((Circle) => {
    Circle.setOptions({
      strokeColor: changeCircleColour(Circle.available_bike_stands),
      fillColor: changeCircleColour(Circle.available_bike_stands),
    });
  });
  markerList.forEach((Marker) => {
    Marker.setOptions({
      label: {
        text: Marker.available_bike_stands.toString(),
        color: "white",
      },
    });
  });
};

darkToggleMouseOver = (button) => {
  document.getElementById(button).style.backgroundColor = "#a2d2ff";
  document.getElementById(button).style.borderColor = "#a2d2ff";
};

darkToggleMouseLeave = (button) => {
  if (darkToggle) {
    document.getElementById(button).style.backgroundColor = "#2d3142";
    document.getElementById(button).style.borderColor = "#2d3142";
  }
  if (!darkToggle) {
    document.getElementById(button).style.backgroundColor = "#ffffff";
    document.getElementById(button).style.borderColor = "#ffffff";
  }
};

bikeParkingMouseOver = (button) => {
  if (document.getElementById(button).style.backgroundColor === "gray") {
    document.getElementById(button).style.backgroundColor = "#a2d2ff";
    document.getElementById(button).style.borderColor = "#a2d2ff";
  }
};

bikeParkingMouseLeave = (button) => {
  if (document.getElementById(button).style.backgroundColor !== "#ffffff") {
    document.getElementById(button).style.backgroundColor = "gray";
    document.getElementById(button).style.borderColor = "gray";
  }
};
