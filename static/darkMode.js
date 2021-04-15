var darkToggle = false;

// Called when dark/light mode is toggled
function toggleDarkMode() {
  // Toggles default background/text
  var element = document.body;
  darkToggle = !darkToggle;
  element.classList.toggle("dark-mode");
  // If darkmode
  if (darkToggle) {
    // Style info info SVG on bottom part of page
    let darkToggleInfo = document.getElementById("inverse-darkToggle");
    darkToggleInfo.style.fill = "#2d3142";
    // Text of chart buttons styling by class name
    let darkToggleText = document.getElementsByClassName("chartButtonsText");
    for (var i = 0; i < darkToggleText.length; i++) {
      darkToggleText[i].style.color = "#ffffff";
    }
    // Chart buttons styling by class name
    let darkToggleChartButtons = document.getElementsByClassName(
      "chartButtons"
    );
    for (var i = 0; i < darkToggleChartButtons.length; i++) {
      if (darkToggleChartButtons[i].style.width === "100%") {
        darkToggleChartButtons[i].style.backgroundColor = "#2d3142";
        darkToggleChartButtons[i].style.borderColor = "#2d3142";
      }
    }
    // SVG styling by class name
    let darkToggle = document.getElementsByClassName("darkToggle");
    for (var i = 0; i < darkToggle.length; i++) {
      darkToggle[i].style.fill = "#ffffff";
    }
    // Top buttons styling by class name
    let darkToggleButton = document.getElementsByClassName("darkToggleButton");
    for (var i = 0; i < darkToggleButton.length; i++) {
      darkToggleButton[0].style.height = "60px";
      if (darkToggleButton[i].style.height == "60px") {
        darkToggleButton[i].style.backgroundColor = "#2d3142";
        darkToggleButton[i].style.borderColor = "#2d3142";
      }
    }

    // Swap map to light mode
    var mapOptions = { styles: lightMap };
    // Swap chart to light mode
    chartOptions = lightChart;
  } else {
    let darkToggleInfo = document.getElementById("inverse-darkToggle");
    darkToggleInfo.style.fill = "#ffffff";
    let darkToggleText = document.getElementsByClassName("chartButtonsText");
    for (var i = 0; i < darkToggleText.length; i++) {
      darkToggleText[i].style.color = "#2d3142";
    }
    let darkToggleChartButtons = document.getElementsByClassName(
      "chartButtons"
    );
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
  // initialise map again with dark/light mode
  map.setOptions(mapOptions);
  // If a station is selected, re-build chart with new parameters
  if (activeStation) {
    drawOccupancyWeekly(activeStation, chartOptions);
  }
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
