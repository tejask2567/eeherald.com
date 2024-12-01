/*
* Notify Bar - jQuery plugin
*
* Copyright (c) 2009-2010 Dmitri Smirnov
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*
* Version: 1.2.2
*
* Project home:
* http://www.dmitri.me/blog/notify-bar
*/
 
/**
* param Object
*/

//alert("nnotifyBar")
jQuery.notifyBar = function(settings) {
  
  (function($) {
    
    var bar = notifyBarNS = {};
    notifyBarNS.shown = false;
     
    if( !settings) {
    settings = {};
    }
    // HTML inside bar
    notifyBarNS.html = settings.html || "Something went wrong. Please recheck the details provided.";
     
    //How long bar will be delayed, doesn't count animation time.
    notifyBarNS.delay = settings.delay || 2000;
     
    //How long notifyBarNS bar will be slided up and down
    notifyBarNS.animationSpeed = settings.animationSpeed || 200;
     
    //Use own jquery object usually DIV, or use default
    notifyBarNS.jqObject = settings.jqObject;
     
    //Set up own class
    notifyBarNS.cls = settings.cls || "";
    
    //close button
    notifyBarNS.close = settings.close || false;
    
    if( notifyBarNS.jqObject) {
      bar = notifyBarNS.jqObject;
      notifyBarNS.html = bar.find('.notify-msg').html();
    } else {
      bar = jQuery("<div></div>")
      .addClass("jquery-notify-bar")
      .addClass(notifyBarNS.cls)
      .attr("id", "__notifyBar");
      bar.append("<div class='notify-container'><span class='fa fa-check-circle-o'></span><span class='notify-msg'></span></div>").hide();      
    }
         
    bar.find('.notify-msg').html(notifyBarNS.html).hide();
    var id = bar.attr("id");
    switch (notifyBarNS.animationSpeed) {
      case "slow":
      asTime = 600;
      break;
      case "normal":
      asTime = 400;
      break;
      case "fast":
      asTime = 200;
      break;
      default:
      asTime = notifyBarNS.animationSpeed;
    }
    if( bar != 'object'); {
      jQuery("body").prepend(bar);
    }
    
    // Style close button in CSS file
    if( notifyBarNS.close) {
      bar.find('.notify-container').append(jQuery("<span class='notify-bar-close fa fa-times-circle'></span>"));
      jQuery(".notify-bar-close").click(function() {
        if( bar.attr("id") == "__notifyBar") {
          jQuery("#" + id).slideUp(asTime, function() { jQuery("#" + id).remove() });
        } else {
          jQuery("#" + id).slideUp(asTime);
        }
        return false;
      });
    }
    
  // Check if we've got any visible bars and if we have, slide them up before showing the new one
  if($('.jquery-notify-bar:visible').length > 0) {
    $('.jquery-notify-bar:visible').stop().slideUp(asTime, function() {
      bar.stop().slideDown(asTime);
      bar.find('.notify-msg').slideDown(asTime);
    });
  } else {
    bar.slideDown(asTime);
    bar.find('.notify-msg').slideDown(asTime);
  }
  
  // Allow the user to click on the bar to close it
  bar.click(function() {
    $(this).slideUp(asTime);
    bar.find('.notify-msg').slideUp(asTime);
  })
     
  // If taken from DOM dot not remove just hide
  if( bar.attr("id") == "__notifyBar") {
    setTimeout("jQuery('#" + id + "').stop().slideUp(" + asTime +", function() {jQuery('#" + id + "').remove()});", notifyBarNS.delay + asTime);
  } else {
    setTimeout("jQuery('#" + id + "').stop().slideUp(" + asTime +", function() {jQuery('#" + id + "')});", notifyBarNS.delay + asTime);
  }

})(jQuery) };