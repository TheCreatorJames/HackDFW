var ctx = document.getElementById("display");
var initialData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
            label: 'Trip',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: "rgba(153,255,51,0.4)"
        }]
};

var myLineChart = Chart.Line(ctx, {data: initialData, scaleOverride: true, scaleSteps: 10, scaleSteps: 100});

addCallback(function()
{
    var currentSecond = getSimulationSecond();
    //for(var i = currentSecond; i >=  && i >= currentSecond - 10; i--)
    var speed = getSpeed(currentSecond);

    initialData.datasets[0].data = initialData.datasets[0].data.reverse();
    initialData.datasets[0].data.pop();
    initialData.datasets[0].data = initialData.datasets[0].data.reverse();
    initialData.datasets[0].data.push(speed);
    
    myLineChart.update();
});