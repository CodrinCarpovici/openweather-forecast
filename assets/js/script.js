// Api key
const apiKey = "d7b53c91bdd2abe33da074c99abbbe36";

// Variables
let lat, lon;

// Document Elements
const historyDiv = $("#history");

const displayHistory = () => {
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
        // TO IMPLEMENT DISPLAY FUNCTION
      });
    historyDiv.prepend(historyButton);
  }
};

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

      // Current day forecast
      const currentDay = $("#today");

      // Celar previous content
      currentDay.empty();

      // Get todays date in a basic format
      const dateToday = dayjs().format("DD/MM/YYYY");

      // Create a title for the box
      const boxTitle = $("<h2>").text(`${cityName} (${dateToday})`);

      // Get a corresponding Icon from the response
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const iconImage = $("<img>").attr({
        src: iconUrl,
        alt: "Weather Icon",
        class: "weather-icon",
      });

      // Container to flex title and icons
      const headerDiv = $("<div>").addClass("d-flex align-items-center");

      // Appending title and icon to the container
      headerDiv.append(boxTitle, iconImage);
      // Appending the header container to the box
      currentDay.append(headerDiv);

      // Display temperature wind humidity
      const temperature = $("<p>").text(`Temperature: ${data.main.temp} °C`);
      const wind = $("<p>").text(`Wind: ${data.wind.speed} KPH`);
      const humidity = $("<p>").text(`Humidity: ${data.main.humidity}%`);

      // Append the lines to the current day forecast
      currentDay.append(temperature, wind, humidity);

      // Fectching the data using the URL
      fetch(queryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);

          // 5-day Forecast
          const forecast = $("#forecast").addClass("d-flex");
          // Clear previous forecast
          forecast.empty();

          // Filtering response for a specific set of weather info as the API returns multiple
          const filteredData = data.list.filter((element) => {
            return element.dt_txt.includes("12:00:00");
          });

          // Looping through the first 5 entries of the filtered array and generating a suitable box for each one
          for (let dayElement of filteredData.slice(0, 5)) {
            const box = $("<div>").addClass("forecast-box");
            // Getting the date
            const date = dayjs(dayElement.dt_txt).format("DD/MM/YYYY");
            
            const dateHeader = $('<h5>').text(date)
            // Get a corresponding Icon from the response
            const iconCode = dayElement.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            // Creating Weather Icon for each box
            const iconImage = $("<img>").attr({
              src: iconUrl,
              alt: "Weather Icon",
              class: "weather-icon",
            });

            // Retrieving temperature wind humidity
            const temperature = $("<p>").text(
              `Temperature: ${dayElement.main.temp} °C`
            );
            const wind = $("<p>").text(`Wind: ${dayElement.wind.speed} KPH`);
            const humidity = $("<p>").text(
              `Humidity: ${dayElement.main.humidity}%`
            );

            // Appending everything to the box and then to the forecast section
            box.append(dateHeader, iconImage);
            box.append(temperature, wind, humidity);

            forecast.append(box);
          }

          // Refreshing display history
          displayHistory();
        });
    });
});

displayHistory();
