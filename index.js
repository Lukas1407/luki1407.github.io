function initialize() {
    const location = { lat: 42.345573, lng: -71.098326 };
    const map = new google.maps.Map(document.getElementById("map"), {
      center: location,
      zoom: 14,
    });
    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano"),
      {
        position: location,
      }
    );
  
    map.setStreetView(panorama);
}