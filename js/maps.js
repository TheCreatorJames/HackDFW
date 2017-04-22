 var lastCoord = null;
 var countMap = 0;
 var clearMap = null;
 var markerPlaced = false;

 function initMap()
 {
     var local_lines = [];
     var uluru = {
         lat: 40,
         lng: -98
     };
     var map = new google.maps.Map(document.getElementById('map'),
     {
         zoom: 5,
         center: uluru
     });

     var marker = null;

     clearMap = function()
     {
         local_lines.forEach(function(x)
         {
             x.setMap(null);
             lastCoord = null;
         });
         local_lines = [];
     }
     addCallback(function()
     {
         if (!markerPlaced)
         {
             marker = new google.maps.Marker(
             {
                 position: uluru,
                 map: map
             });
             markerPlaced = true;
         }

         var currentSecond = getSimulationSecond();
         uluru.lng = getLongitude(currentSecond);
         uluru.lat = getLatitude(currentSecond);

         if (countMap++ % 120 == 0)
         {
             if (lastCoord != null)
             {

                 var flightPlanCoordinates = [
                     lastCoord,
                     uluru
                 ];


                 var flightPath = new google.maps.Polyline(
                 {
                     path: flightPlanCoordinates,
                     geodesic: true,
                     strokeColor: '#FF0000',
                     strokeOpacity: 1.0,
                     strokeWeight: 2
                 });

                 flightPath.setMap(map);
                 local_lines.push(flightPath);
             }


             lastCoord = JSON.parse(JSON.stringify(uluru));
         }
         try
         {
             marker.setPosition(uluru);
         }
         catch (ex)
         {}
     });
 };