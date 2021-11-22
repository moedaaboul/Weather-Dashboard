// Current weather app
const apiKey = "8fcf15f1446775617fe9577e790f0250";
const pathName = "https://api.openweathermap.org/data/2.5/";
// const url =
//   "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";

const forecastUrl = "forecast?q=";
const currentUrl = "weather?q=";

let variable = [];

var getUserRepos = function (city, typeofUrl) {
  var apiUrl = pathName + typeofUrl + city + "&appid=" + apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          variable = data;
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
