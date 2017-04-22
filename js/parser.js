var vehicleSpeed = [];
    
// simulation variables
var simulationStartIndex = 200;
var simulationSecondIndex = simulationStartIndex;
var vehicleSpeedSum = 0;


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

                fileDisplayArea.innerText += "Parsing complete...\n";

                // after parsing data, start simulation
                setInterval(simulate, 1000);
            }
            reader.readAsText(file);
        }else
        {
            fileDisplayArea.innerText = "File type not supported." + file.type;
        }

    }
    );
}

function getVehicleSpeed(secondIndex)
{
    return vehicleSpeed[secondIndex];
}

function getAverageVehicleSpeed()
{
    return vehicleSpeedSum / (simulationSecondIndex-simulationStartIndex);
}

function parseLine(data)
{
    var tokens = data.split(',');

    // extract needed data
    vehicleSpeed.push(parseFloat(tokens[8]));
}

function simulate()
{
    fileDisplayArea.innerText += getVehicleSpeed(simulationSecondIndex);
    vehicleSpeedSum += getVehicleSpeed(simulationSecondIndex);

    simulationSecondIndex++;
}
