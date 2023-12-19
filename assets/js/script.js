// Api key
const apiKey = "d7b53c91bdd2abe33da074c99abbbe36";

// Variables
let lat, lon;

// Document Elements
const historyDiv = $("#history");

// On input submit, modify the cityName stored in the variable
$("#search-form").on("submit", function (e) {
  // Preventing Default
  e.preventDefault();
  // Storing input value
  const cityValue = $("#search-input").val().trim();
  // Capitalizing first letter of input value
  const cityName = cityValue.charAt(0).toUpperCase() + cityValue.slice(1);
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

      // When the data has been fetched we will save the search in the history
      const updateHistory = (city) => {
        let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

        // Checking if search is not in history already
        if (!history.includes(city)) {
          history.push(city);
          localStorage.setItem("searchHistory", JSON.stringify(history));
        }
      };

      // Calling history update
      updateHistory(cityName);

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

// Display the search History
let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Clear History to prepare for updated array
historyDiv.empty();

// For each element of the history array, generate a button
for (let city of history) {
  const historyButton = $("<button>")
    .addClass("btn btn-secondary mb-3")
    .text(city)
    .on("click", function () {
      // TO IMPLEMENT DISPLAY FUCNTION
    });
  historyDiv.prepend(historyButton);
}
