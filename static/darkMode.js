var darkToggle = false;

function toggleDarkMode() {
  console.log("darkToggleMode");
  var element = document.body;
  darkToggle = !darkToggle;
  element.classList.toggle("dark-mode");
  if (darkToggle) {
    let darkToggle = document.getElementsByClassName("darkToggle");
    for (var i = 0; i < darkToggle.length; i++) {
      darkToggle[i].style.fill = "#ffffff";
    }
    let darkToggleButton = document.getElementsByClassName("darkToggleButton");
    for (var i = 0; i < darkToggleButton.length; i++) {
      if (darkToggleButton[i].style.height == "60px") {
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
      if (darkToggleButton[i].style.height == "60px") {
        darkToggleButton[i].style.backgroundColor = "#ffffff";
        darkToggleButton[i].style.borderColor = "#ffffff";
      }
    }
  }
  map.setOptions(mapOptions);
}

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
