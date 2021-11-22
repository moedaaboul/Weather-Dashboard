// Current weather app
//IMPORTANT DOCS ===============
// https://openweathermap.org/weather-data

const tempElement = document.querySelector(".temp");
const windElement = document.querySelector(".wind");
const humiditiyElement = document.querySelector(".humidity");
const uviElement = document.querySelector(".uvi");
const todayElement = document.querySelector(".todayWeather");
const cardElements = document.querySelector(".cards");

const apiKey = "8fcf15f1446775617fe9577e790f0250";
const pathName = "https://api.openweathermap.org/data/2.5/";
// const url =
//   "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";

("https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}");

const onecallUrl = (latitude, longitude) => {
  return `onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly`;
};
const currentUrl = "weather?q=";

// https://openweathermap.org/current
const unitsImperial = "&units=imperial";

const parseDate = (unixDate) => moment.unix(unixDate).format("MM/DD/YYYY");

let variable = [];
let lon;
let lat;
let searchHistory = [];
let currentWind;
let currentHumidity;
let cityName;
let currentDate;
let currentTemp;
let variable2;
let results = [];

const allowed = ["dt", "humidity", "temp", "uvi", "wind_speed"];

var getWeather = function (city, typeofUrl) {
  var apiUrl = pathName + typeofUrl + city + unitsImperial + "&appid=" + apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        searchHistory.push(city);
        response
          .json()
          .then(function (data) {
            console.log(data);
            variable = data;
            lon = variable.coord.lon;
            lat = variable.coord.lat;
            currentWind = "Wind: " + variable.wind.speed + " MPH";
            currentHumidity = "Humidity: " + variable.main.humidity + " %";
            cityName = variable.name;
            currentDateUnix = variable.dt;
            console.log(currentDateUnix);
            currentDate = parseDate(currentDateUnix);
            console.log(currentDate);
            currentTemp = "Temp: " + variable.main.temp + "°F";
            tempElement.textContent = currentTemp;
            windElement.textContent = currentWind;
            humiditiyElement.textContent = currentHumidity;
            todayElement.textContent = cityName + " " + "(" + currentDate + ")";
            forecastUrl =
              pathName +
              onecallUrl(lat, lon) +
              unitsImperial +
              "&appid=" +
              apiKey;
            return fetch(forecastUrl);
          })
          .then((response) =>
            response.json().then(function (data2) {
              console.log(data2);
              variable2 = data2.daily;
              variable2.forEach((e, i) => {
                results.push(
                  Object.keys(e)
                    .filter((key) => allowed.includes(key))
                    .reduce((obj, key) => {
                      obj[key] = e[key];
                      return obj;
                    }, {})
                );
              });
              console.log("results", results);
              uviElement.textContent = results[0].uvi;
              const cardResults = [1, 2, 3, 4, 5].map((item) => results[item]);
              console.log(cardResults);
              cardResults.forEach((obj) => {
                const datefcstElement = document.createElement("p");
                const tempfcstElement = document.createElement("p");
                const windfcstElement = document.createElement("p");
                const humidityfcstElement = document.createElement("p");
                const cardElement = document.createElement("div");
                // rank.setAttribute("scope", "row");
                datefcstElement.innerHTML = "Date: " + parseDate(obj.dt);
                tempfcstElement.innerHTML = "Temp: " + obj.temp.day + "°F";
                windfcstElement.innerHTML = "Wind: " + obj.wind_speed + " MPH";
                humidityfcstElement.innerHTML =
                  "Humidity: " + obj.humidity + " %";
                cardElement.classList.add("card");
                cardElement.appendChild(datefcstElement);
                cardElement.appendChild(tempfcstElement);
                cardElement.appendChild(windfcstElement);
                cardElement.appendChild(humidityfcstElement);
                cardElements.appendChild(cardElement);
              });
            })
          );
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeathermap");
    });
};

getWeather("Manchester", currentUrl);
