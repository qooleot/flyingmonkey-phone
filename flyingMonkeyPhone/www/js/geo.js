
// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
var serialCounter = 0;
var userDirectionSet = false;
var onSuccess = function (position) {
  var gpsInfo = '<table>' +
    '<tr><td>Latitude: </td><td>' + position.coords.latitude + '</td></tr>' +
    '<tr><td>Longitude:</td><td>' + position.coords.longitude + '</td></tr>' +
    '<tr><td>Altitude: </td><td>' + position.coords.altitude + '</td></tr>' +
    '<tr><td>Accuracy: </td><td>' + position.coords.accuracy + '</td></tr>' +
    '<tr><td>Heading: </td><td>' + position.coords.heading + '</td></tr>' +
    '<tr><td>Speed:  </td><td>' + position.coords.speed + '</td></tr>' +
  '</table>';

  $('#gps').html(gpsInfo);

  var ip = $('#ip_addr').val();

  serialCounter++;

  $.ajax({
    url: 'http://' + ip + ':3000/log_gps',
    method: 'POST',
    dataType: 'json',
    data: {
      device: getDeviceID(),
      date: position.timestamp,
      lat: position.coords.latitude,
      long: position.coords.longitude,
      alt: position.coords.altitude,
      serial: serialCounter,
      azmuth: $('#requested_direction').val()
    },
    success: function (res) {
      //console.log(JSON.stringify(res));
      $('#actual_direction').val(parseInt(res.azmuth)).trigger('change');
      if (!userDirectionSet) {
        $('#requested_direction').val(parseInt(res.azmuth)).trigger('change');
        userDirectionSet = true;
      }
    },
    error: function (req, statusCode, err) {
      console.log('error', err, statusCode);
    }
  });
};

// onError Callback receives a PositionError object
function onError(error) {
  alert('code: ' + error.code + '\n' +
    'message: ' + error.message + '\n');
}

var getDeviceID = function() {
  return JSON.stringify({deviceId: 'taras', deviceName: 'taras'});
};

var firstTrack = true;
var trackChange = function(isChecked) {
  console.log('track change', isChecked, firstTrack);

  var ip = $('#ip_addr').val();
  if (firstTrack) {
    $.ajax({
      url: 'http://' + ip + ':3000/nav/parallel',
      data: {
        device: getDeviceID()
      },
      method: 'POST',
      success: function () {
        $.ajax({
          url: 'http://' + ip + ':3000/nav/track',
          data: {
            device: getDeviceID()
          },
          method: 'POST'
        });
      }
    });
  } else {
    if (isChecked) {
      $.ajax({
        url: 'http://' + ip + ':3000/nav/track',
        data: {
          device: getDeviceID()
        },
        method: 'POST'
      });
    } else {
      $.ajax({
        url: 'http://' + ip + ':3000/nav/untrack',
        data: {
          device: getDeviceID()
        },
        method: 'POST'
      });
    }
  }
  firstTrack = false;

};

app.geoStart = function () {
  setInterval(function () {
    doHighAccuracy = true;
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: doHighAccuracy});
  }, 375);
};

