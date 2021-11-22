// Current weather app
//IMPORTANT DOCS ===============
// https://openweathermap.org/weather-data

const tempElement = document.querySelector(".temp");
const windElement = document.querySelector(".wind");
const humiditiyElement = document.querySelector(".humidity");
const uviElement = document.querySelector(".uvi");
const todayElement = document.querySelector(".todayWeather");

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
          currentWind = "Wind: " + variable.wind.speed + " MPH";
          currentHumidity = "Humditity: " + variable.main.humidity + " %";
          cityName = variable.name;
          currentDate = variable.dt;
          currentDate = moment.unix(currentDate).format("MM/DD/YYYY");
          currentTemp = "Temp: " + variable.main.temp + "°F";
          tempElement.textContent = currentTemp;
          windElement.textContent = currentWind;
          humiditiyElement.textContent = currentHumidity;
          // uviElement.textContent = currentTemp
          todayElement.textContent = cityName + " " + "(" + currentDate + ")";
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
