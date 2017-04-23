var speed = [];
var acceleration = [];
var steeringWheel = [];
var lat = [];
var lon = [];
var callbacks = [];
var brakes = [];

var everything = [];

var arrayOffsets = {};
var lastSpeed = 0;
var lastAccel = 0;

var simulationSpeed = 10;
var simSpeedSkips = 1;

// simulation variables
var simulationStartIndex = 0;
var simulationSecondIndex = simulationStartIndex;

var speedSum = 0;
var maxSpeed = null;
var minSpeed = null;
var asyncRead = null;
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

        delete speed;
        delete acceleration;
        delete steeringWheel;
        delete lat;
        delete lon;
        delete brakes;

        speed = [];
        acceleration = [];
        steeringWheel = [];
        lat = [];
        lon = [];
        brakes = [];

        arrayOffsets = {};
        lastSpeed = 0;
        lastAccel = 0;

        mut = 0;


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

                var MAX_COUNT = 2530;

                DATA_COUNT = lines.length;
                var i = 1;

                var lineVals = lines[0].split(",");

                for (var k = 0; k < lineVals.length; k++)
                {
                    lineVals[k] = lineVals[k].replace(/\n/g, "").replace(/\r/g, "");
                    if (lineVals[k] == "AccelLR")
                    {
                        arrayOffsets["accel"] = k;
                    }
                    if (lineVals[k] == "Steering_Angle_Degree" || lineVals[k] == "Streering_Angle_Degree")
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

                    [["Fuel_Consum", "fcon"], ["GD_Engine_Temp", "gdt"], ["Steering_Angle_Speed","sat"], ["Hood_Courtesy", "hc"], ["Passenger_AC_Value", "pav"], ["Driver_AC_Value", "dav"], ["Fuel_Guage", "fg"], ["Rear_Fog_Light", "rfl"], ["Lounge_Illum_Light", "lil"], ["Slide_Roof", "sr"], ["Passenger_Window_State", "pws"], ["RR_Window_State", "rrws"], ["RL_Window_State", "rlws"], ["AccelFB", "afb"], ["Inlet_Switch_Indicator", "isi"], ["AC_Blower_Level", "abl"], ["WhilteLine_Left", "wl"], ["LKA_Steering_Support", "lss"], ["WhilteLine_Right", "wr"]].forEach(function(x)
                    {
                        if(lineVals[k] == x[0])
                        {
                            arrayOffsets[x[1]] = k;
                        }
                    });

                    if (lineVals[k] == 'Brake_Control_Volume')
                    {
                        arrayOffsets['brake'] = k;
                    }
                }

                asyncRead = function(f)
                {
                    var f = f || true;
                    var count = 0;
                    var j = i;
                    // discard first line of input
                    for (i = i; i < DATA_COUNT; i++)
                    {
                        var line = lines[getPosition(i)];
                        try
                        {
                            parseLine(line);
                        }
                        catch (ex)
                        {}
                        if (count++ == MAX_COUNT)
                        {
                            if (f)
                                setTimeout(asyncRead, 100);
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

                asyncRead(true);

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

    if(tokens.length == 1)
    {
        speed.push(lastSpeed);
        accel.push(lastAccel);
    }

    if (tokens[arrayOffsets["speed"]].length != 0)
        lastSpeed = parseFloat(tokens[arrayOffsets["speed"]]);

    if (tokens[arrayOffsets["accel"]].length != 0)
        lastAccel = parseFloat(tokens[arrayOffsets["accel"]]);

    acceleration.push(lastAccel);

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


    var speedy = getSpeed(simulationSecondIndex);
    var accelerationy = getAcceleration(simulationSecondIndex);

    if (speedy < minSpeed)
        minSpeed = speedy;
    if (speedy > maxSpeed)
        maxSpeed = speedy;
    speedSum += speedy;

    if (accelerationy < minAcceleration)
        minAcceleration = accelerationy;
    if (accelerationy > maxAcceleration)
        maxAcceleration = accelerationy;
    accelerationSum += accelerationy;


    simulationSecondIndex++;
    unload();

    var qr = 0;
    mut++;
    qr = mut;
    if (simulationSecondIndex >= DATA_COUNT)
    {

    }
    else
    {

        if (qr == 1)
            setTimeout(function()
            {
                for (var m = 0; m < simSpeedSkips; m++) simulate(0);

                /*
                setTimeout(function()
                {
                    if (qr == 1)
                    {
                        mut = 0;
                        simulate(0);
                    }
                }, Math.max(1000 / simulationSpeed, 5));
                */

                if (qr == 1)
                {
                    mut = 0;
                    simulate(0);
                }
            }, Math.max(1000 / simulationSpeed, 8));

        executeCallbacks();
    }
}

/*
 * Chris's Tone Generation Stuff
 */
// setInterval(console.log(getSimulationSecond()),1000)
setInterval(function()
{
    speedFunc(getSpeed(getSimulationSecond()))
    bassFunc(getSpeed(getSimulationSecond()))
    chordstabs(getSpeed(getSimulationSecond()))
}, 1000);
/*END TONE GENERATION BUH BYE*/