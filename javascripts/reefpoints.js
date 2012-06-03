$(function(){
  $('input, textarea').inFieldLabel();
  $('h2.hire-us').click(function() {
    $(this).toggleClass('active');
    $('section#form-container').slideToggle(1000);
    return false;
  });
  $('.mobile-nav').toggle(function(){
    $('header ul').slideDown();
    return false;
  }, function(){
    $('header ul').slideUp();
    return false;
  });
});
