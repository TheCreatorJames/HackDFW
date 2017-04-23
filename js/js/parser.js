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

var shortener = [
    ["Fuel_Consum", "fcon", "Fuel Consumption", function(x)
    {
        return parseFloat(x);
    }],
    ["GD_Engine_Temp", "gdt", "Engine Temperature", function(x)
    {
        return parseFloat(x);
    }],
    ["Steering_Angle_Speed", "sat", "Steering Angle Speed", function(x)
    {
        return parseFloat(x);
    }],
    ["Hood_Courtesy", "hc", "Hood Courtesy", function(x)
    {
        if (x == "0") return "Closed";
        return "Open";
    }],
    ["Passenger_AC_Value", "pav", "Passenger AC Temperature", function(x)
    {
        return parseFloat(x);
    }],
    ["Driver_AC_Value", "dav", "Driver AC Temperature", function(x)
    {
        return parseFloat(x);
    }],
    ["Driver_Window_State", "dws", "Driver Window State", function(x)
    {
        if (x == "0") return "Unknown";
        if (x == "1") return "Open";
        return "Closed";
    }],
    ["Fuel_Guage", "fg", "Fuel Gauge", function(x)
    {
        return parseInt(x);
    }],
    ["Rear_Fog_Light", "rfl", "Rear Fog Light", function(x)
    {
        if (x == "0") return "Off";
        return "On";
    }],
    ["Lounge_Illum_Light", "lil", "Lounge Illumination Light", function(x)
    {
        if (x == "0") return "Off";
        return "On";
    }],
    ["Front_Fog_Light", "ffl", "Front Fog Light", function(x)
    {
        if (x == "0") return "Off";
        return "On";
    }],
    ["Front_Dome_Light", "fdl", "Front Dome Light", function(x)
    {
        if (x == "0") return "Off";
        return "On";
    }],
    ["Slide_Roof", "sr", "Slide Roof", function(x)
    {
        if (x == "2") return "Closed";
        if (x == "1") return "Open";
        return "Unknown";
    }],
    ["Passenger_Window_State", "pws", "Passenger Window State", function(x)
    {
        if (x == "0") return "Closed";
        if (x == "1") return "Open";
        return "Unknown";
    }],
    ["RR_Window_State", "rrws", "Rear Right Window State", function(x)
    {
        if (x == "0") return "Closed";
        if (x == "1") return "Open";
        return "Unknown";
    }],
    ["RL_Window_State", "rlws", "Read Left Window State", function(x)
    {
        if (x == "0") return "Closed";
        if (x == "1") return "Open";
        return "Unknown";
    }],
    ["AccelFB", "afb", "AccelFB", function(x)
    {
        return parseFloat(x);
    }],
    ["Inlet_Switch_Indicator", "isi", "Inlet Switch Indicator", function(x)
    {
        if (x == "0") return "Off";
        return "On";
    }],
    ["AC_Blower_Level", "abl", "AC Blower Strength", function(x)
    {
        return parseFloat(x);
    }],
    ["WhilteLine_Left", "wl", "Whiteline Left Support", function(x)
    {
        if (x == "0") return "No Lane / Road Edge";
        if (x == "1") return "White Line / Edge Seen";
        return "Unknown";
    }],
    ["LKA_Steering_Support", "lss", "LKA Steering Support", function(x)
    {
        if (x == "0") return "Except During Support";
        return "During Support";
    }],
    ["WhilteLine_Right", "wr", "Whiteline Right Support", function(x)
    {
        if (x == "0") return "No Lane / Road Edge";
        if (x == "1") return "White Line / Edge Seen";
        return "Unknown";
    }],
    ["Latitude", "lat", "Latitude", function(x)
    {
        return parseFloat(x);
    }],
    ["Longitude", "lon", "Longitude", function(x)
    {
        return parseFloat(x);
    }],
    ["Power_Mode", "pm", "Power Mode", function(x)
    {
        if (x == "0") return "Off";
        return "On";
    }],
    ["Vehicle_Speed", "vs", "Speed", function(x)
    {
        return parseFloat(x);
    }],
    ["Streering_Angle_Degree", "sad", "Steering Wheel Angle", function(x)
    {
        return parseFloat(x);
    }],
    ["Radar_Cruise_State", "ras", "Radar Cruise State", function(x)
    {
        if (x == "0") return "Absence of Equipment";
        return "Presence of Equipment";
    }],
    ["Odometer_Reading", "or", "Odometer", function(x)
    {
        return parseInt(x);
    }],
    ["Engine_Speed", "es", "Engine Speed", function(x)
    {
        return parseFloat(x);
    }],
    ["Transmission_Type", "tt", "Transmission Type", function(x)
    {
        if (x == "0") return "Automatic";

        if (x == "1") return "Manual";

        if (x == "2") return "Continuously Variable";

        return "Automatic";
    }],
    ['Brake_Control_Volume', "bcv", "Brake Control Volume", function(x)
    {
        return parseFloat(x);
    }],
    ["AccelLR", "alr", "AccelLR", function(x)
    {
        return parseFloat(x);
    }]
];

function nullFixer(x, a)
{
    var x = x || "";
    return a(x);
}

function init()
{
    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e)
    {
        delete everything;
        delete speed;
        delete acceleration;
        delete steeringWheel;
        delete lat;
        delete lon;
        delete brakes;

        everything = [];
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

                    shortener.forEach(function(x)
                    {
                        if (lineVals[k] == x[0])
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
        everything.splice(0, 5490);
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

    if (tokens.length == 1)
    {
        speed.push(lastSpeed);
        accel.push(lastAccel);
    }


    var ev = [];
    shortener.forEach(function(x)
    {
        ev.push(tokens[arrayOffsets[x[1]]]);


        if (typeof tokens[arrayOffsets[x[1]]] == "undefined")
        {
            ev.pop();
            var z = ev.length;
            if (everything.length > 1)
                ev.push(everything[everything.length - 1][z - 1]);
            else ev.push(undefined);
        }
    });
    everything.push(ev);

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