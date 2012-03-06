$(function(){
  $('input, textarea').inFieldLabel();
  $('h2.hire-us').click(function() {
    $(this).toggleClass('active');
    $('section#form-container').slideToggle(1000);
    return false;
  });
});
