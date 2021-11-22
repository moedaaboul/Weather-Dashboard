// Current weather app
//IMPORTANT DOCS ===============
// https://openweathermap.org/weather-data

const apiKey = "8fcf15f1446775617fe9577e790f0250";
const pathName = "https://api.openweathermap.org/data/2.5/";
// const url =
//   "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";

const forecastUrl = "forecast?q=";
const currentUrl = "weather?q=";

// https://openweathermap.org/current
const unitsImperial = "&units=imperial";

let variable = [];
let lon;
let lat;
let searchHistory = [];
let currentWind;
let currentHumidity;
let cityName;
let currentDate;
let currentTemp;

var getUserRepos = function (city, typeofUrl) {
  var apiUrl = pathName + typeofUrl + city + unitsImperial + "&appid=" + apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        searchHistory.push(city);
        response.json().then(function (data) {
          console.log(data);
          variable = data;
          lon = variable.coord.lon;
          lat = variable.coord.lat;
          currentWind = variable.wind.speed + " MPH";
          currentHumidity = variable.main.humidity + " %";
          cityName = variable.name;
          currentDate = variable.dt;
          // need to add small upper circle for F
          currentTemp = variable.main.temp + "°F";
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeathermap");
    });
};

getUserRepos("Manchester", currentUrl);
