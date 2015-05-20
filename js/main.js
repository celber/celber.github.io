var map, marker;

var latitudeField = $("[name=latitude]");
var longitudeField = $("[name=longitude]");

function initialize() {
  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(52.187405, 18.896484)
  };
  map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);
      
  google.maps.event.addDomListener(map, 'click', handleMapClick);
}

function initGapi() {
        gapi.client.setApiKey('AIzaSyBd-Z6vj3mGSxpmRUqGf4oSJptv8VbDyW0');
		gapi.client.load('urlshortener', 'v1').then(function () {
        });
      }

google.maps.event.addDomListener(window, 'load', initialize);

$("#form_submit").on('click', generate);
$("#shorten").on('click', shorten);
$("#sendSMS").on('click', sendSMS);

function handleMapClick(evt) {
	var lat = evt.latLng.lat(),
		lng = evt.latLng.lng();
	
	if (!marker) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: map,
			draggable: true
		})
		google.maps.event.addDomListener(marker, 'dragend', updatePosition);
	} else {
		marker.setPosition(evt.latLng);
	}
	
	updatePosition(evt);
}

function updatePosition(evt) {
	var lat = evt.latLng.lat(),
		lng = evt.latLng.lng();
		
	latitudeField.val(lat);
	longitudeField.val(lng);
}

function generate(evt) {
	var host = "http://celber.github.io/app/arrow/dist/themes/";
	var lat = $("[name=latitude]").val();
	var lng = $("[name=longitude]").val();
	var alt = $("[name=altitude]").val();
	var theme = $("[name=theme]").val();
	var highAccuracy = $("[name=highAccuracy]").val();
	var link = "";
	
	link += host;
	link += theme+"/";
	link += theme+".html";
	link += "?";
	link += "lat="+lat+"&";
	link += "lng="+lng+"&";
	if (alt) {
		link += "alt="+alt+"&";	
	}
	link += "highAccuracy="+highAccuracy+"&";
	
	$("#linkField").val(link);
	
	$("[name=message]").val("This is your tracker link: "+link+" Have fun!");
	
}

function shorten() {
	var request = gapi.client.urlshortener.url.insert({
      'resource': {
      'longUrl': $("#linkField").val()
    }
    });
        request.then(function(response) {
          $("#linkField").val(response.result.id);
		  $("[name=message]").val("This is your tracker link: "+response.result.id+" Have fun!");
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        });
}

function sendSMS() {
	var phone = $("[name=phone]").val();
	var message = $("[name=message]").val();
	
	$.ajax({
		url: "https://smsmega.pl/api/?send=1&format=json",
		method: "POST",
		data: {
			recipient_number: phone,
			message: message
		}
	}).always(function(response) {
		$("#sendViaSMS").foundation( "reveal", 'close' );
		if (response.info.type=="error") {
			$("#smsErrorMessage").text(response.info.description);
			$("#sentFailed").foundation( "reveal", 'open' );	
		}
	  })
}