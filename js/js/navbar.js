

//add border left on hover for deskotp
  $(".icon").mouseenter(
    function(){
      $(this).removeClass("inactive")
      .toggleClass("active")
      }
  )
  $(".icon").mouseleave(
    function(){
      $(this).removeClass("active")
      .toggleClass("inactive")
  })


//change icon color for mobile
  var windowSize = $(window).width();
  if(windowSize < 767){
    $(".icon-img").mouseenter(
      function(){
        var src = $(this).attr('src');
        $(this).attr('src', src.replace(".svg", "-red.svg"));
    });
      $(".icon-img").mouseleave(
        function(){
          var src = $(this).attr('src');
          $(this).attr('src', src.replace("-red.svg", ".svg" ));
      });
  }
  else{}
