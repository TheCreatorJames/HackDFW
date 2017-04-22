var velocityCtx = document.getElementById("velocityDisplay");
var accelerationCtx = document.getElementById("accelerationDisplay");

var velocityData = 
{
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
    {
        label: 'Velocity',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(0,255,0,0.4)"
    }]
};
var accelerationData = 
{
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [{
        label: 'Acceleration',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(255,0,0,0.4)"
    }]
}

var velocityOptions = {
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                min: 0,   
                max: 120,
            }
        }]
    }
};

var accelerationOptions = {
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                min: -2,    // minimum will be 0, unless there is a lower value.
                max: 2,
            }
        }]
    }
};

var velocityChart = Chart.Line(velocityCtx, {data: velocityData, options: velocityOptions});
var accelerationChart = Chart.Line(accelerationCtx, {data: accelerationData, options: accelerationOptions});

addCallback(function()
{
    var currentSecond = getSimulationSecond();
    var speed = getSpeed(currentSecond);
    var acceleration = getAcceleration(currentSecond);

    console.log(speed);

    velocityData.datasets[0].data = velocityData.datasets[0].data.reverse();
    velocityData.datasets[0].data.pop();
    velocityData.datasets[0].data = velocityData.datasets[0].data.reverse();
    velocityData.datasets[0].data.push(speed);

    accelerationData.datasets[0].data =  accelerationData.datasets[0].data.reverse();
    accelerationData.datasets[0].data.pop();
    accelerationData.datasets[0].data = accelerationData.datasets[0].data.reverse();
    accelerationData.datasets[0].data.push(acceleration);
    
    velocityChart.update();
    accelerationChart.update();
});