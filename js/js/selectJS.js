function selectFileM()
{
    var el = document.getElementById("selM");
    if (el.value == "Upload")
    {
        var input = $(document.createElement('input'));
        input.attr("type", "file");
        input.change(fileReadFunction);
        input.trigger('click'); // opening dialog
    }
    el.selectedIndex = "0";
}

function selectFileD()
{
    var el = document.getElementById("selD");
    if (el.value == "Upload")
    {
        var input = $(document.createElement('input'));
        input.attr("type", "file");
        input.change(fileReadFunction);
        input.trigger('click'); // opening dialog

    }

    el.selectedIndex = "0";
}