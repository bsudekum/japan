L.mapbox.accessToken = 'pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig';
var map = L.mapbox.map('map', 'bobbysud.023d9591')

var popupCounter = -1;
var popups = L.geoJson(data, {
    onEachFeature: function(feature, layer) {
        popupCounter++;

        layer.bindPopup('<div class="image-container"><a href="' + feature.properties.url + '" target="_blank"><img src="img/expand.png" class="expand"/></a><img src="' + feature.properties.url.split('.jpg')[0] + '.thumb.jpg' + '" alt="" width="250px"/></div>', {
            minWidth: 250,
            autoPanPadding: [0, 200],
            closeButton: false,
            className: 'popup' + popupCounter
        });

        if (feature.properties.type === 'video') {
            layer.bindPopup('<div class="image-container"><a href="' + feature.properties.url + '" target="_blank"><img src="img/expand.png" class="expand"/></a><video width="320" height="240" autoplay loop><source src=' + feature.properties.url + ' type="video/mp4">Your browser does not support the video tag.</video></div>', {
                minWidth: 320,
                autoPanPadding: [0, 200],
                closeButton: false,
                className: 'popup' + popupCounter
            });
        }
    },
    pointToLayer: function(feature, latlng) {
        var markerIcon = L.divIcon({
            className: 'markerIcon',
            iconSize: [40, 40],
            html: '<img src="' + feature.properties.url.split('.jpg')[0] + '.thumb.jpg' + '"/>'
        });

        return new L.marker(latlng, {
            icon: markerIcon
        }).addTo(map);
    }
}).addTo(map);

var routeFeature = L.featureGroup();
L.geoJson(day1, {
    style: {
        'color': '#e7857f',
        'weight': 5,
        'opacity': .95
    }
}).addTo(routeFeature);
L.geoJson(day2, {
    style: {
        'color': '#63b6e5',
        'weight': 5,
        'opacity': .95
    }
}).addTo(routeFeature);
L.geoJson(day3, {
    style: {
        'color': '#e7857f',
        'weight': 5,
        'opacity': .95
    }
}).addTo(routeFeature);
L.geoJson(day4, {
    style: {
        'color': '#63b6e5',
        'weight': 5,
        'opacity': .95
    }
}).addTo(routeFeature);
L.geoJson(day5, {
    style: {
        'color': '#e7857f',
        'weight': 5,
        'opacity': .95
    }
}).addTo(routeFeature);
L.geoJson(day6, {
    style: {
        'color': '#63b6e5',
        'weight': 5,
        'opacity': .95
    }
}).addTo(routeFeature);
L.geoJson(day7, {
    style: {
        'color': '#e7857f',
        'weight': 5,
        'opacity': .95
    }
}).addTo(routeFeature);

L.geoJson(train, {
    style: {
        'color': '#000',
        'weight': 3,
        'dashArray': [10, 15],
        'opacity': .6
    }
}).addTo(routeFeature);

map.addLayer(routeFeature);
map.fitBounds(routeFeature.getBounds());

var overAllCounter = parseInt(window.location.hash.split('#')[1]) || '';
updateHash(overAllCounter)

function openPopup(number, counter) {
    var count = counter || -1;
    popups.eachLayer(function(marker) {
        count++;

        if (count == number) {
            map.panTo(marker.getLatLng());
            marker.openPopup();
        }
    });
};

popups.on('popupopen', function(e) {
    var number = e.popup.options.className.split('popup')[1];
    overAllCounter = number;
    updateHash(number);
});

function updateHash(number) {
    openPopup(number);
    return window.location.hash = number;
};

$('.next').click(function() {
    overAllCounter++;
    updateHash(overAllCounter);
});

$('.previous').click(function() {
    overAllCounter--;
    updateHash(overAllCounter);
});


$('img').each(function() {
    $(this).error(function() {
        $(this).attr("src", 'img/play.png');
    });
});
