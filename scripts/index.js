new gnMenu( document.getElementById( 'gn-menu' ) );
/*
* Socket communication
*/
var ip = '192.168.1.125', // node server ip
port = ':8080',
io = io.connect(),
current_url = window.location.href;

$.ready(function() {
    var sockjs_url = 'http://192.168.1.125:9999/echo';
    var sockjs = new SockJS(sockjs_url);
    document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br/>device ready and sockjs in action";
    var sockjsdiv  = $('#sockjs');
    var print = function(m, p) {
        p = (p === undefined) ? '' : JSON.stringify(p);
        sockjsdiv.append($("<code>").text(m + ' ' + p));
        sockjsdiv.append($("<br>"));
    };

    sockjs.onopen    = function()  {print('[*] open', sockjs.protocol);};
    sockjs.onmessage = function(e) {print('[.] message', e.data);};
    sockjs.onclose   = function()  {print('[*] close');};
    setInterval(function() {
        sockjs.send( "i'm the client!!!!" );
    }, 2000);
});


if (!('ondevicemotion' in window)) {
  document.getElementById('dm-unsupported').classList.remove('hidden');
} else {
  window.addEventListener('devicemotion', function(event) {
         document.getElementById('acceleration-x').innerHTML = Math.round(event.acceleration.x);
         document.getElementById('acceleration-y').innerHTML = Math.round(event.acceleration.y);
         document.getElementById('acceleration-z').innerHTML = Math.round(event.acceleration.z);

         document.getElementById('interval').innerHTML = event.interval;
  });
}

if (!(window.navigator && window.navigator.geolocation)) {
  document.getElementById('g-unsupported').classList.remove('hidden');
  document.getElementById('debug').innerHTML = "<br/>geolocation api not supported";
}
else {
  document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br/>geolocation supported";

  var positionOptions = {
     enableHighAccuracy: true,
     timeout: 10 * 1000, // 10 seconds
     maximumAge: 5 * 1000 // data can be 2 seconds old from cache
  };

  function success(position) {
     document.getElementById('latitude').innerHTML = position.coords.latitude;
     document.getElementById('longitude').innerHTML = position.coords.longitude;
     document.getElementById('position-accuracy').innerHTML = position.coords.accuracy;

     document.getElementById('timestamp').innerHTML = (new Date(position.timestamp)).toString();
  }
  function Error(positionError) {
      document.getElementById('error').classList.remove('hidden');
      document.getElementById('error').innerHTML = 'Error: ' + positionError.message + '<br />'
  }
  setInterval(function() {
      navigator.geolocation.getCurrentPosition(success, Error, positionOptions);
  }, 3000);
}

// Initialize cordova.js so that cordova native plugins like speech synthesizer and vibrate can be used.
app.initialize();

 if (navigator.TTS === undefined) {
      document.getElementById('ss-unsupported').classList.remove('hidden');
      document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br/>speech synthesis not supported";
 }
 else {
      document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br/>speech synthesis supported";

      function InitiateSpeaking() {
         navigator.TTS.speak({
          text : "Please turn off the notification",
          locale: 'en-GB',
          rate: 0.75
         }, function() {
              document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br/>speech synthesis success";
         }, function (){
              document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br/>speech synthesis failed";
         });
      }
      setInterval(InitiateSpeaking, 5000);
 }
 if (navigator.vibrate === undefined) {
      document.getElementById('v-unsupported').classList.remove('hidden');
      document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "Vibrator not supported";
 }
 else {
       document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br/>vibrator api supported";
      setInterval( function() {
          navigator.vibrate(3000);
      }, 10000);
 }


document.addEventListener('deviceready', function() {
});