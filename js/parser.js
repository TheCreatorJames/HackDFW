var speed = [];
var acceleration = [];
    
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
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e)
    {
        var file = fileInput.files[0];
        var textType = "vnd.ms-excel";

        if(file.type.match(textType))
        {
            var reader = new FileReader();

            reader.onload = function(e)
            {
                fileDisplayArea.innerText = "File data is parsing...\n";
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


                fileDisplayArea.innerText += "Parsing complete...\n";

                // after parsing data, start simulation
                setInterval('simulate(fileDisplayArea)', 100);
            }
            reader.readAsText(file);
        }else
        {
            fileDisplayArea.innerText = "File type not supported." + file.type;
        }

    }
    );
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
}

function simulate(display)
{
    display.innerText += 'Speed: ' + getSpeed(simulationSecondIndex) + ' Avg speed: ' + getAverageSpeed() + ' Min speed: ' + getMinSpeed() + ' Max speed: ' + getMaxSpeed() + ' Acceleration: ' + getAcceleration(simulationSecondIndex) + '\n';

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
}
