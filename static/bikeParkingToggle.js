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
  