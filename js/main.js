// Global Variables
var map, currDesc, currTitle;

function ViewModel() {
  var self = this;

  this.locationSearch = ko.observable("");
  this.markers = [];

  // Fills the infowindow when marker is clicked.
  // Information generated is based on marker title search.
  this.fillInfoWindow = function(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
      $.ajax({
        // Wiki API url reference: https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
          format: "json",
          action: "opensearch",
          search: marker.title,
        },
        dataType: 'jsonp',
        headers: {
          'Api-User-Agent': 'MyCoolTool/1.1 '
        },
        // Function determing which data is selected and used
      }).done(function(data) {
        self.currTitle = data[0];
        self.currDesc = data[2][0];
        self.contentDisplay =
          '<h6 class="title">' + self.currTitle + '</h6>' + '<div>' + '<p class="desc">' + self.currDesc + '</p>' + '</div>';
        infowindow.setContent(self.contentDisplay);
        // Error reporting failure of Wikipedia API
      }).fail(function(err) {
        alert("Failed to retrieve data from wikipedia.");
      });
      this.htmlContent = '<div>' + '<h4 class="iw_title">' + currTitle +
        '</h4>' + currDesc + '</div>';
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  };
  this.fillAndBounceMarker = function() {
    self.fillInfoWindow(this, self.largeInfoWindow);
    // Marker animation and time limit on bounce
    this.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout((function() {
      this.setAnimation(null);
    }).bind(this), 900);
  };
  // Google maps init
  this.initMap = function() {
    var place = document.getElementById('map');
    // Controls the beggining location and range of the map
    var mapSettings = {
      center: new google.maps.LatLng(47.6456, -122.3344),
      zoom: 12.2,
    };

    // Constructor used to create a new map
    map = new google.maps.Map(place, mapSettings);

    // Set InfoWindow and size
    this.largeInfoWindow = new google.maps.InfoWindow({
      maxWidth: 200
    });
    // Places array
    for (var i = 0; i < mapLocations.length; i++) {
      this.markerTitle = mapLocations[i].title;
      this.markerLat = mapLocations[i].lat;
      this.markerLng = mapLocations[i].lng;
      // Marker setup
      this.marker = new google.maps.Marker({
        position: {
          lat: this.markerLat,
          lng: this.markerLng
        },
        title: this.markerTitle,
        animation: google.maps.Animation.DROP,
        id: i,
        icon: makeMarkerIcon('FF0000')
      });
      this.marker.setMap(map);
      this.markers.push(this.marker);
      // Marker onlick event for animation
      this.marker.addListener('click', self.fillAndBounceMarker);
      // Mouseover function and marker color after being highlighted
      this.marker.addListener('mouseover', function() {
        this.setIcon(makeMarkerIcon('DBCBD8'));
      });
      // Mouseout function
      this.marker.addListener('mouseout', function() {
        this.setIcon(makeMarkerIcon('FF0000'));
      });
    }
  };

  this.initMap();

  // Attaches/pushes locations to a list and filters
  this.mapFilter = ko.computed(function() {
    var result = [];
    for (var i = 0; i < this.markers.length; i++) {
      var setLocation = this.markers[i];
      if (setLocation.title.toLowerCase().includes(this.locationSearch()
          .toLowerCase())) {
        result.push(setLocation);
        this.markers[i].setVisible(true);
      } else {
        this.markers[i].setVisible(false)
      }
    }
    return result;
  }, this);
}

// Error for Google Maps
googleError = function googleError() {
  alert('Google Maps was unable to load.');
};

function initMap() {
  ko.applyBindings(new ViewModel());
}

// Marker icon size and image
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}
