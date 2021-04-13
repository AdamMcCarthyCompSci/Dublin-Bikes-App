// These buttons have similar functionality to bikeParkingToggle.js
showHourly = () => {
    document.getElementById("hourlyButton").disabled = true;
    document.getElementById("dailyButton").disabled = false;
    document.getElementById("predictionButton").disabled = false;

    document.getElementById("dailyButton").style.borderColor = "gray";
    document.getElementById("dailyButton").style.backgroundColor = "gray";
    document.getElementById("dailyButton").style.marginLeft = "5%";
    document.getElementById("dailyButton").style.width = "90%";
    document.getElementById("predictionButton").style.borderColor = "gray";
    document.getElementById("predictionButton").style.backgroundColor = "gray";
    document.getElementById("predictionButton").style.marginLeft = "5%";
    document.getElementById("predictionButton").style.width = "90%";

    if (darkToggle) {
        document.getElementById("hourlyButton").style.borderColor = "#2d3142";
        document.getElementById("hourlyButton").style.backgroundColor = "#2d3142";
        document.getElementById("hourlyButton").style.marginLeft = "0%";
        document.getElementById("hourlyButton").style.width = "100%";
    }
    if (!darkToggle) {
        document.getElementById("hourlyButton").style.borderColor = "#ffffff";
        document.getElementById("hourlyButton").style.backgroundColor = "#ffffff";
        document.getElementById("hourlyButton").style.marginLeft = "0%";
        document.getElementById("hourlyButton").style.width = "100%";
    }
    
    // Toggle which chart is being displayed
    hourlyChart = true;
    dailyChart = false;
    predictionChart = false;

    // If chart options have not been selected yet, use default parameters
    if (typeof chartOptions == 'undefined') {
        drawOccupancyWeekly(activeStation);
        }
    else {
          drawOccupancyWeekly(activeStation, chartOptions)
        }
}

showDaily = () => {
    document.getElementById("hourlyButton").disabled = false;
    document.getElementById("dailyButton").disabled = true;
    document.getElementById("predictionButton").disabled = false;

    document.getElementById("predictionButton").style.borderColor = "gray";
    document.getElementById("predictionButton").style.backgroundColor = "gray";
    document.getElementById("predictionButton").style.marginLeft = "5%";
    document.getElementById("predictionButton").style.width = "90%";
    document.getElementById("hourlyButton").style.borderColor = "gray";
    document.getElementById("hourlyButton").style.backgroundColor = "gray";
    document.getElementById("hourlyButton").style.marginLeft = "5%";
    document.getElementById("hourlyButton").style.width = "90%";

    if (darkToggle) {
        document.getElementById("dailyButton").style.borderColor = "#2d3142";
        document.getElementById("dailyButton").style.backgroundColor = "#2d3142";
        document.getElementById("dailyButton").style.marginLeft = "0%";
        document.getElementById("dailyButton").style.width = "100%";
    }
    if (!darkToggle) {
        document.getElementById("dailyButton").style.borderColor = "#ffffff";
        document.getElementById("dailyButton").style.backgroundColor = "#ffffff";
        document.getElementById("dailyButton").style.marginLeft = "0%";
        document.getElementById("dailyButton").style.width = "100%";
    };

    hourlyChart = false;
    dailyChart = true;
    predictionChart = false;

    if (typeof chartOptions == 'undefined') {
        drawOccupancyWeekly(activeStation);
        }
    else {
          drawOccupancyWeekly(activeStation, chartOptions)
        }
}

showPrediction = () => {
    document.getElementById("hourlyButton").disabled = false;
    document.getElementById("dailyButton").disabled = false;
    document.getElementById("predictionButton").disabled = true;

    document.getElementById("hourlyButton").style.borderColor = "gray";
    document.getElementById("hourlyButton").style.backgroundColor = "gray";
    document.getElementById("hourlyButton").style.marginLeft = "5%";
    document.getElementById("hourlyButton").style.width = "90%";
    document.getElementById("dailyButton").style.borderColor = "gray";
    document.getElementById("dailyButton").style.backgroundColor = "gray";
    document.getElementById("dailyButton").style.marginLeft = "5%";
    document.getElementById("dailyButton").style.width = "90%";

    if (darkToggle) {
        document.getElementById("predictionButton").style.borderColor = "#2d3142";
        document.getElementById("predictionButton").style.backgroundColor = "#2d3142";
        document.getElementById("predictionButton").style.marginLeft = "0%";
        document.getElementById("predictionButton").style.width = "100%";
    }
    if (!darkToggle) {
        document.getElementById("predictionButton").style.borderColor = "#ffffff";
        document.getElementById("predictionButton").style.backgroundColor = "#ffffff";
        document.getElementById("predictionButton").style.marginLeft = "0%";
        document.getElementById("predictionButton").style.width = "100%";
    };

    hourlyChart = false;
    dailyChart = false;
    predictionChart = true;
}

chartButtonsMouseOver = (button) => {
    if (document.getElementById(button).style.width === "90%") {
      document.getElementById(button).style.backgroundColor = "#a2d2ff";
      document.getElementById(button).style.borderColor = "#a2d2ff";
    }
  };
  
chartButtonsMouseLeave = (button) => {
    if (document.getElementById(button).style.width !== "100%") {
        document.getElementById(button).style.backgroundColor = "gray";
        document.getElementById(button).style.borderColor = "gray";
}
};