addCallback(function()
{
    var x = getBrake(getSimulationSecond()) * 10;
    var brake = document.getElementById("brake");
    brake.style.color = 'rgba(' + Math.floor(x*255) + ",0,0," + x  + ")";
    
});