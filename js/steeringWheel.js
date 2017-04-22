var ctx = document.getElementById("steeringWheel");

var wheelData = {
  datasets: [{
        data: [
            14,
            4,
            17,
            4
        ],
        backgroundColor: [
            "#FF6384",
            "#4BC0C0",
            "#FF6384",
            "#4BC0C0"
        ],
    }],
    labels: [
        "Red",
        "Green",
        "Yellow",
        "Grey",
        "Blue"
    ]
};

var wheelOptions = {
    elements: {
            arc: {
            }
    },
    rotation: 9.881
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
    

    console.log(wheel);

    wheelPieChart.options.rotation = (wheel*2) * Math.PI / 180 + 9.881;
    wheelPieChart.update();
});