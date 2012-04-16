---
layout: post
title: "Using Backbone Views With Rails jQuery-ujs"
comments: true
author: Russ Jones
twitter: codeofficer
github: codeofficer
category: javascript
social: true
summary: "Throwing them together in a way that makes sense."
published: false
---

I often meet Rails developers that have unwittingly jumped on the unobtrusive javascript bandwagon. They throw ':remote => true' on a form and benefit from its conventions, but don't know how to make it really work for them. They're probably still inclined to write out procedural jQuery code the same way they were doing it before [jquery-ujs](https://github.com/rails/jquery-ujs
) became popular. There's a helpful [wiki page](https://github.com/rails/jquery-ujs/wiki/ajax
) that describes its custom events and how to use them, but they probably don't know about it.

Maybe they've worked on improving some client side code with Backbone recently, and maybe they're trying to do things the Backbone way but don't know how to tie that together with existing Rails views. Here's a quick example of how Backbone views can listen for jquery-ujs custom events. You can view a working fiddle [here](http://jsfiddle.net/codeofficer/mpyXT/).

{% highlight javascript %}
var FormView = Backbone.View.extend({
  el: '#form',

  events: {
    // Fired automatically when a file-type input is detected with a
    // non-blank value. You can use this hook to implement a handler that
    // will deal with those non-blank file inputs. Returning false will
    // disallow standard form submission.
    'ajax:aborted:file'     : 'ajaxAbortedFile',

    // Fired when there are required inputs which have been left blank.
    // You can use this handler to deal with those blank required inputs.
    // Returning false will submit the form anyway.
    'ajax:aborted:required' : 'ajaxAbortedRequired',

    // First event fired for any remote enabled form. Stopping this event
    // will cancel the ajax request
    'ajax:before'           : 'ajaxBefore',

    // Fired before the ajax request is sent. Stopping this event will
    // cancel the ajax request. Commonly used to customize certain request
    // headers
    'ajax:beforeSend'       : 'ajaxBeforeSend',

    // Fired after completion, if the HTTP response was a success
    'ajax:success'          : 'ajaxSuccess',

    // Fired after completion, if the server returned an error
    'ajax:error'            : 'ajaxError',

    // Fired after the request has been completed, no matter what outcome
    'ajax:complete'         : 'ajaxComplete'
  },

  ajaxAbortedFile: function(e, elements){
  },

  ajaxAbortedRequired: function(e, elements){
  },

  ajaxBefore: function(e){
  },

  ajaxBeforeSend: function(e, xhr, settings){
  },

  ajaxSuccess: function(e, data, status, xhr){
  },

  ajaxError: function(e, xhr, status, error){
  },

  ajaxComplete: function(e, xhr, status){
  }
});

$(function(){
    window.view = new FormView();
});
{% endhighlight %}

{% highlight html %}
<form id="form" action="#" method="POST" data-remote="true">
  <p><input type="text" value="..."></p>
  <p><input type="submit" value="Continue &rarr;"></p>
</form>
{% endhighlight %}

