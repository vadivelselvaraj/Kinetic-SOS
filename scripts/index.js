new gnMenu( document.getElementById( 'gn-menu' ) );
/*
* Socket communication
*/

var accelerometerData = {},
    gpsData = {},
    accelerometerDataCount = 0
    gpsDataCount = 0,
    socket = null,
    clearSocketInterval = null;

function openSocketAndSendMessage() {
    if(socket == null)
        return;
    var datenow = new Date().getTime();
    var msg = {};
    if(accelerometerData != null && Object.keys(accelerometerData).length > 0)
        msg = $.extend(msg, accelerometerData);
    if(gpsData != null && Object.keys(gpsData).length > 0)
        msg = $.extend(msg, gpsData);

    // Send the msg object as a JSON-formatted string(if there is at least one key in it) and clear the accelerometer buffer
    if(Object.keys(msg).length > 0) {
        socket.send(JSON.stringify(msg));
    }

    accelerometerData = {};
    gpsData = {};

    // Also write the count of data to the page.
    $('#accelpollingrate').html(accelerometerDataCount);
    $('#gpspollingrate').html(gpsDataCount);
}

function InitSocket() {
    // If socket is already initialized, skip processing further.
    if(socket != null)
        return;
    socket = new WebSocket('wss://run-east.att.io/74424ad1f0bab/3dcd5b89d66d/220da12746eb8cc/in/flow/ws/kinetic');
    socket.onopen = function(event) {
        console.log('Socket opened on client side',event);
        // Listen for messages
        socket.onmessage = function(event) {
            console.log('Client received a message',event);
        };

        // Listen for socket closes
        // socket.onclose = function(event) {
        //    console.log('Client notified socket has closed',event);
        // };
        */
    };
    clearSocketInterval = setInterval(openSocketAndSendMessage, 1000);
}

function StopSendingData() {
    if(socket != null) {
        socket = null;
        clearInterval(clearSocketInterval);
    }
}

function getDateTime() {
    return new Date();
}

document.addEventListener('deviceready', function() {
    document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br/>device ready";
    InitSocket();
    InitDeviceMonitoring();
});

function InitDeviceMonitoring() {
    if (!('ondevicemotion' in window)) {
      document.getElementById('dm-unsupported').classList.remove('hidden');
    } else {
      window.addEventListener('devicemotion', function(event) {
             document.getElementById('acceleration-x').innerHTML = Math.round(event.acceleration.x);
             document.getElementById('acceleration-y').innerHTML = Math.round(event.acceleration.y);
             document.getElementById('acceleration-z').innerHTML = Math.round(event.acceleration.z);

             document.getElementById('interval').innerHTML = event.interval;
             var timenow = getDateTime();

             if(!accelerometerData.hasOwnProperty('accX')) {
                accelerometerData['accX'] = [];
                accelerometerData['accY'] = [];
                accelerometerData['accZ'] = [];
             }

             accelerometerData['accX'].push({
                'timestamp' : timenow,
                'value' : Math.round(event.acceleration.x)
             });
             accelerometerData['accY'].push({
                'timestamp' : timenow,
                'value' : Math.round(event.acceleration.y)
             });
             accelerometerData['accZ'].push({
                'timestamp' : timenow,
                'value' : Math.round(event.acceleration.z)
             });
             accelerometerDataCount++;
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
         var timenow = getDateTime();
         if(!gpsData.hasOwnProperty('lat')) {
             gpsData['lat'] = [];
             gpsData['long'] = [];
         }

         gpsData['lat'].push({
             'timestamp' : timenow,
             'value' : position.coords.latitude
         });
        gpsData['long'].push({
             'timestamp' : timenow,
             'value' : position.coords.longitude
         });

         gpsDataCount++;
      }

      function Error(positionError) {
          document.getElementById('error').classList.remove('hidden');
          document.getElementById('error').innerHTML = 'Error: ' + positionError.message + '<br />'
      }

      navigator.geolocation.watchPosition(success, Error, positionOptions);
    }

    /*
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
     */
}