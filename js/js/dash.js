
function replaceDash2(offset)
{
    offset *= 6;

    var arr = $(".mobile-scrolling-things div tbody tr td h4");
    var arr2 = $(".mobile-scrolling-things div tbody tr td h3");
    var arr3 = $(".mobile-scrolling-things div tbody tr td p");

    for(var i = 0; i < 6; i++)
    {
        if(i + offset < shortener.length)
        {

            
            $(arr[i]).show();
            $(arr2[i]).show();
            $(arr3[i]).show();

            $(arr[i]).text(shortener[offset+i][2]);
        }
        else
        {
            $(arr[i]).hide();
            $(arr2[i]).hide();
            $(arr3[i]).hide();
        }
    }

}

function replaceDash3(offset)
{
    replaceDash(offset);
    replaceDash2(offset);
}


var rot = 0;
function replaceDash4()
{
    rot++;
    if(rot*6 > shortener.length) rot = 0;
    replaceDash3(rot); 
}

function replaceDash(offset)
{
    offset *= 6;

    var arr = $(".scrolling-things div tbody tr td h4");
    var arr2 = $(".scrolling-things div tbody tr td h3");
    var arr3 = $(".scrolling-things div tbody tr td p");

    for(var i = 0; i < 6; i++)
    {
        if(i + offset < shortener.length)
        {

            
            $(arr[i]).show();
            $(arr2[i]).show();
            $(arr3[i]).show();

            $(arr[i]).text(shortener[offset+i][2]);
        }
        else
        {
            $(arr[i]).hide();
            $(arr2[i]).hide();
            $(arr3[i]).hide();
        }
    }
}

addCallback(function()
{
    var s= getSimulationSecond();
    var e = getEverything(s);
    offset = rot * 6;
    var arr3 = $(".scrolling-things div tbody tr td p");

    for(var i = 0; i < 6; i++)
    {
        if(i + offset < shortener.length)
        {
            var res = nullFixer(e[offset+i], shortener[offset+i][3]);
            $(arr3[i]).text(res);
        }
        else
        {

        }
    }




});