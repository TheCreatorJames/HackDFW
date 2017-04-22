var speed = [];
var acceleration = [];
var steeringWheel = [];
var callbacks = [];

// simulation variables
var simulationStartIndex = 200;
var simulationSecondIndex = simulationStartIndex;

var speedSum = 0;
var maxSpeed = 0;
var minSpeed = 0;

var accelerationSum = 0;
var minAcceleration = 0;
var maxAcceleration = 0;

function init()
{
    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e)
    {
        var file = fileInput.files[0];
        var textType = "vnd.ms-excel";

        if(file.type.match(textType))
        {
            var reader = new FileReader();

            reader.onload = function(e)
            {
                var fileText = reader.result;
                var lines = fileText.split('\n');

                var DATA_COUNT = 1000;

                // discard first line of input
                for(var i = 1; i < DATA_COUNT; i++)
                {
                    var line = lines[i];
                    parseLine(line);
                }

                // calculate acceleration
                for(var i = 1; i < DATA_COUNT; i++)
                    acceleration[i] = (speed[i] - speed[i-1]);
                minSpeed = speed[0];
                maxSpeed = speed[0];
                minAcceleration = acceleration[0];
                maxAcceleration = acceleration[0];


                // after parsing data, start simulation
                setInterval('simulate()', 100);
            }
            reader.readAsText(file);
        }else
        {
            alert("File type not supported.");
        }

    }
    );
}

function addCallback(callback)
{
    callbacks.push(callback);
}

function executeCallbacks()
{
    callbacks.forEach(function(v) 
    {
        v();
    });
}

function getSimulationSecond()
{
    return simulationSecondIndex;
}

function getSteeringWheelAngle(second)
{
    return steeringWheel[second];
}

function getAcceleration(secondIndex)
{
    return acceleration[secondIndex];
}

function getAverageAcceleration()
{
    return accelerationSum / (simulationSecondIndex - simulationStartIndex);
}

function getMinAcceleration()
{
    return minAcceleration;
}

function getMaxAcceleration()
{
    return maxAcceleration;
}

function getSpeed(secondIndex)
{
    return speed[secondIndex];
}

function getAverageSpeed()
{
    return speedSum / (simulationSecondIndex-simulationStartIndex);
}

function getMaxSpeed()
{
    return maxSpeed;
}

function getMinSpeed()
{
    return minSpeed;
}

function parseLine(data)
{
    var tokens = data.split(',');

    // extract needed data
    speed.push(parseFloat(tokens[8]));
    steeringWheel.push(tokens[12]);
}

function simulate(display)
{
    var speed = getSpeed(simulationSecondIndex);
    var acceleration = getAcceleration(simulationSecondIndex);
    
    if(speed < minSpeed)
        minSpeed = speed;
    if(speed > maxSpeed)
        maxSpeed = speed;
    speedSum += speed;

    if(acceleration < minAcceleration)
        minAcceleration = acceleration;
    if(acceleration > maxAcceleration)
        maxAcceleration = acceleration;
    accelerationSum += acceleration;

    simulationSecondIndex++;

    executeCallbacks();
}