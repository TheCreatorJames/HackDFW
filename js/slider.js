function RGB()
{
    $("#meh").text("" + r.getValue());
    simulationSpeed = r.getValue();

    if (1000 / simulationSpeed < 10)
    {
        simSpeedSkips = Math.floor(10 / (1000 / simulationSpeed));
    }
    else
    {
        simSpeedSkips = 1;
    }

}

var r = $("#lol").slider(
{}).on('slide', RGB).data('slider');