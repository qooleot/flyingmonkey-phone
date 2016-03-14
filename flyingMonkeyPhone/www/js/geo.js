// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function(position) {
    var gpsInfo = '<table>'+
      '<tr><td>Latitude: </td><td>'+position.coords.latitude +'</td></tr>' +
      '<tr><td>Longitude:</td><td>'+position.coords.longitude +'</td></tr>' +
      '<tr><td>Altitude: </td><td>'+position.coords.altitude +'</td></tr>' +
      '<tr><td>Accuracy: </td><td>'+position.coords.accuracy +'</td></tr>' +
      '<tr><td>Altitude Accuracy:</td><td>'+position.coords.altitude +'</td></tr>' +
      '<tr><td>Heading: </td><td>'+position.coords.heading  +'</td></tr>' +
      '<tr><td>Speed:  </td><td>'+position.coords.speed    +'</td></tr>' +
      '<tr><td>Timestamp:</td><td>'+position.timestamp       +'</td></tr>';
    '</table>';

    $('#gps').html(gpsInfo);

    //var ip = '192.168.0.245';
    var ip = '10.1.1.10';

    console.log('position.coords.longitude', position.coords.longitude);
    $.ajax({
      url: 'http://'+ip+':3000/log_gps', 
      method: 'POST',
      data: {
        device: JSON.stringify({ deviceId: 'taras', deviceName:'taras' }),
        date: position.timestamp,
        lat: position.coords.latitude,
        long: position.coords.longitude,
        alt: position.coords.altitude
      },
      success: function() {
        console.log('success');
      },
      error: function(req, statusCode, err) {
        console.log('error', err, statusCode);
      }
    });
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

app.geoStart = function() {
  setInterval(function() {
    doHighAccuracy = true;
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: doHighAccuracy});
    //console.log('here -----!!')
  }, 375);
}

