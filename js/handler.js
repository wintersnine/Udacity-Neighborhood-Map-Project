$(document).ready(function() {
  $('.nav flex-column a').click(function(e){
      $(".nav flex-column a").removeClass('selected');
      $(this).addClass('selected');
  });
  function setHeight() {
    windowHeight = $(window).innerHeight();
    $('#map').css('min-height', windowHeight);
    $('#sidebar').css('min-height', windowHeight);
  };
  setHeight();

  $(window).resize(function() {
    setHeight();
  });


});
