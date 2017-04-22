var ctx = document.getElementById("steeringWheel");

var wheelData = {
  datasets: [{
        data: [
            14,
            5,
            17,
            5
        ],
        backgroundColor: [
            "#888888",
            "#777789",
            "#888888",
            "#777789"
        ],
    }]
};

var wheelOptions = {
    legend:
    {
        display: false
    },
    rotation: 9.9299999
}

var wheelPieChart = new Chart(ctx,
{
    type: "pie",
    data: wheelData,
    options: wheelOptions
});

addCallback(function()
{
    var currentSecond = getSimulationSecond();
    var wheel = getSteeringWheelAngle(currentSecond);
    if(!isNaN(wheel))
    wheelPieChart.options.rotation = (wheel*2) * Math.PI / 180 +9.92999999;
    wheelPieChart.update();
});