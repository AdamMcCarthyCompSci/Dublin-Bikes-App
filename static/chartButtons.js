showHourly = () => {
    hourlyChart = true;
    dailyChart = false;

    if (typeof chartOptions == 'undefined') {
        drawOccupancyWeekly(activeStation);
        }
    else {
          drawOccupancyWeekly(activeStation, chartOptions)
        }
}

showDaily = () => {
    hourlyChart = false;
    dailyChart = true;
    if (typeof chartOptions == 'undefined') {
        drawOccupancyWeekly(activeStation);
        }
    else {
          drawOccupancyWeekly(activeStation, chartOptions)
        }
}

showPrediction = () => {
    hourlyChart = false;
    dailyChart = false;
    // show Prediction data
}