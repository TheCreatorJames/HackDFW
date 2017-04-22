var speed = [];
var acceleration = [];
var steeringWheel = [];
var lat = [];
var lon = [];
var callbacks = [];
var brakes = [];

var arrayOffsets = {};
var lastSpeed = 0;

var simulationSpeed = 10;
var simSpeedSkips = 1;

// simulation variables
var simulationStartIndex = 0;
var simulationSecondIndex = simulationStartIndex;

var speedSum = 0;
var maxSpeed = null;
var minSpeed = null;

var unloaded = 0;

var DATA_COUNT = 0;
var accelerationSum = 0;
var minAcceleration = 0;
var maxAcceleration = 0;

function init()
{





    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e)
    {
        speed = [];
        acceleration = [];
        steeringWheel = [];
        lat = [];
        lon = [];
        brakes = [];

        arrayOffsets = {};
        lastSpeed = 0;

        
        // simulation variables
        simulationStartIndex = 0;
        simulationSecondIndex = simulationStartIndex;

        speedSum = 0;
        maxSpeed = null;
        minSpeed = null;

        unloaded = 0;

        accelerationSum = 0;
        minAcceleration = 0;
        maxAcceleration = 0;

        var file = fileInput.files[0];
        var textType = "vnd.ms-excel";

        if (file.type.match(textType) || file.type.match("text/csv"))
        {
            clearMap();
            var reader = new FileReader();

            reader.onload = function(e)
            {
                var fileText = reader.result;
                var lines = fileText.split('\n');

                var MAX_COUNT = 1530;

                DATA_COUNT = lines.length;
                var i = 1;

                var lineVals = lines[0].split(",");

                for (var k = 0; k < lineVals.length; k++)
                {
                    if (lineVals[k] == "Steering_Angle_Degree")
                    {
                        arrayOffsets["angle"] = k;
                    }
                    if (lineVals[k] == "Vehicle_Speed")
                    {
                        arrayOffsets["speed"] = k;
                    }
                    if (lineVals[k] == "latitude")
                    {
                        arrayOffsets['latitude'] = k;
                    }
                    if (lineVals[k] == 'longitude')
                    {
                        arrayOffsets['longitude'] = k;
                    }

                    if (lineVals[k] == 'Brake_Control_Volume')
                    {
                        arrayOffsets['brake'] = k;
                    }
                }

                function asyncRead()
                {
                    var count = 0;
                    var j = i;
                    // discard first line of input
                    for (i = i; i < DATA_COUNT; i++)
                    {
                        var line = lines[getPosition(i)];
                        parseLine(line);

                        if (count++ == MAX_COUNT)
                        {
                            setTimeout(asyncRead, 100);
                            break;
                        }
                    }

                    count = 0;

                    // calculate acceleration
                    for (j = j; j < DATA_COUNT; j++)
                    {
                        acceleration.push(speed[getPosition(j)] - speed[getPosition(j - 1)]);

                        if (count++ == MAX_COUNT)
                        {
                            break;
                        }
                    }

                    if (minSpeed == null)
                    {
                        minSpeed = speed[0];
                        maxSpeed = speed[0];
                        minAcceleration = acceleration[0];
                        maxAcceleration = acceleration[0];
                    }
                }

                asyncRead();

                // after parsing data, start simulation
                simulate();
            }
            reader.readAsText(file);
        }
        else
        {
            alert("File type not supported.");
        }

    });
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

function getPosition(i)
{
    return i - unloaded;
}

function unload()
{
    if (getPosition(getSimulationSecond()) > 5500)
    {
        speed.splice(0, 5490);
        brakes.splice(0, 5490);
        acceleration.splice(0, 5490);
        steeringWheel.splice(0, 5490);
        lat.splice(0, 5490);
        lon.splice(0, 5490);

        unloaded += 5490;
    }
}

function getSimulationSecond()
{
    return simulationSecondIndex;
}

function getSteeringWheelAngle(second)
{
    return steeringWheel[getPosition(second)];
}

function getAcceleration(secondIndex)
{
    return acceleration[getPosition(secondIndex)];
}

function getAverageAcceleration()
{
    return accelerationSum / (simulationSecondIndex - simulationStartIndex);
}

function getMinAcceleration()
{
    return minAcceleration;
}

function getBrake(second)
{
    return brakes[getPosition(second)];
}

function getLongitude(second)
{
    return lon[getPosition(second)];
}

function getLatitude(second)
{
    return lat[getPosition(second)];
}

function getMaxAcceleration()
{
    return maxAcceleration;
}

function getSpeed(secondIndex)
{
    return speed[getPosition(secondIndex)];
}

function getAverageSpeed()
{
    return speedSum / (simulationSecondIndex - simulationStartIndex);
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

    if (tokens[arrayOffsets["speed"]].length != 0)
        lastSpeed = parseFloat(tokens[arrayOffsets["speed"]]);

    speed.push(lastSpeed);
    steeringWheel.push(parseFloat(tokens[arrayOffsets["angle"]]));
    lat.push(parseFloat(tokens[arrayOffsets['latitude']]));
    lon.push(parseFloat(tokens[arrayOffsets['longitude']]));
    brakes.push(parseFloat(tokens[arrayOffsets['brake']]));
}

var mut = 0;

function simulate(q)
{
    var q = q || null;

    if (q > 1) return;

    var speed = getSpeed(simulationSecondIndex);
    var acceleration = getAcceleration(simulationSecondIndex);

    if (speed < minSpeed)
        minSpeed = speed;
    if (speed > maxSpeed)
        maxSpeed = speed;
    speedSum += speed;

    if (acceleration < minAcceleration)
        minAcceleration = acceleration;
    if (acceleration > maxAcceleration)
        maxAcceleration = acceleration;
    accelerationSum += acceleration;

    simulationSecondIndex++;
    unload();

    var qr = 0;
    if (q != 1)
    {
        mut++;
        qr = mut;
    }

    if( !(unloaded >= DATA_COUNT - 5500 && speed.length == 0) ) 
    setTimeout(function()
    {
        for (var m = 0; m < simSpeedSkips; m++) simulate(qr);
        mut--;
    }, Math.max(1000 / simulationSpeed, 10));

    executeCallbacks();

}