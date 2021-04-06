var darkToggle = false;

function toggleDarkMode() {
  var element = document.body;
  darkToggle = !darkToggle;
  element.classList.toggle("dark-mode");
  if (darkToggle) {
    let darkToggleText = document.getElementsByClassName("chartButtonsText");
    for (var i = 0; i < darkToggleText.length; i++) {
      darkToggleText[i].style.color = "#ffffff";
    }
    let darkToggleChartButtons = document.getElementsByClassName("chartButtons");
    for (var i = 0; i < darkToggleChartButtons.length; i++) {
      if (darkToggleChartButtons[i].style.width === "100%") {
        darkToggleChartButtons[i].style.backgroundColor = "#2d3142";
        darkToggleChartButtons[i].style.borderColor = "#2d3142";
      }
    }
    let darkToggle = document.getElementsByClassName("darkToggle");
    for (var i = 0; i < darkToggle.length; i++) {
      darkToggle[i].style.fill = "#ffffff";
    }
    let darkToggleButton = document.getElementsByClassName("darkToggleButton");
    for (var i = 0; i < darkToggleButton.length; i++) {
      darkToggleButton[0].style.height = "60px";
      if (darkToggleButton[i].style.height == "60px") {
        darkToggleButton[i].style.backgroundColor = "#2d3142";
        darkToggleButton[i].style.borderColor = "#2d3142";
      }
    }

    var mapOptions = { styles: lightMap };
    chartOptions = lightChart;
  } else {
    let darkToggleText = document.getElementsByClassName("chartButtonsText");
    for (var i = 0; i < darkToggleText.length; i++) {
      darkToggleText[i].style.color = "#2d3142";
    }
    let darkToggleChartButtons = document.getElementsByClassName("chartButtons");
    for (var i = 0; i < darkToggleChartButtons.length; i++) {
      if (darkToggleChartButtons[i].style.width === "100%") {
        darkToggleChartButtons[i].style.backgroundColor = "#ffffff";
        darkToggleChartButtons[i].style.borderColor = "#ffffff";
      }
    }
    var mapOptions = { styles: darkMap };
    chartOptions = darkChart;
    let darkToggle = document.getElementsByClassName("darkToggle");
    for (var i = 0; i < darkToggle.length; i++) {
      darkToggle[i].style.fill = "#2d3142";
    }
    let darkToggleButton = document.getElementsByClassName("darkToggleButton");
    for (var i = 0; i < darkToggleButton.length; i++) {
      darkToggleButton[0].style.height = "60px";
      if (darkToggleButton[i].style.height == "60px") {
        darkToggleButton[i].style.backgroundColor = "#ffffff";
        darkToggleButton[i].style.borderColor = "#ffffff";
      }
    }
  }
  map.setOptions(mapOptions);
  if (activeStation) {
  drawOccupancyWeekly(activeStation, chartOptions);
  };
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
