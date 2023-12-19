// Api key
const apiKey = "d7b53c91bdd2abe33da074c99abbbe36";

// Variables
let lat, lon;

// On input submit, modify the cityName stored in the variable
$("#search-form").on("submit", function (e) {
  e.preventDefault();
  const cityName = $('#search-input').val().trim();
  // City Query URL
  const cityQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  // Fetching data using the city name
  fetch(cityQueryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // Extracting the lan and lon from the response
      lat = data.coord.lat;
      lon = data.coord.lon;

      // Constructing the API call using the lan and lon values
      const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      // Fectching the data using the URL
      fetch(queryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
        });
    });
});
