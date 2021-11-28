// https://openweathermap.org/current
// https://openweathermap.org/weather-data

const todaySection = document.querySelector(".today");
const forecastElements = document.querySelector(".forecast");
const searchedElement = document.querySelector(".searchCity");
const submitButton = document.querySelector(".submit");
const main = document.querySelector("main");
const historyContainer = document.querySelector(".history-container");

const apiKey = "8fcf15f1446775617fe9577e790f0250";
const pathName = "https://api.openweathermap.org/data/2.5/";

const onecallUrl = (latitude, longitude) => {
  return `onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly`;
};

let displayCities = () => {
  searchHistory.forEach((e) => {
    const searchedElement = document.createElement("button");
    searchedElement.textContent = e;
    searchedElement.addEventListener("click", submitHistoryItem);
    historyContainer.appendChild(searchedElement);
  });
};

function colorUvi(uvi) {
  if (uvi < 3) {
    document.querySelector(".uvi-color").style.backgroundColor = "green";
  } else if (uvi >= 3 && uvi < 6) {
    document.querySelector(".uvi-color").style.backgroundColor = "yellow";
    document.querySelector(".uvi-color").style.color = "black";
  } else if (uvi >= 6 && uvi < 8) {
    document.querySelector(".uvi-color").style.backgroundColor = "brown";
  } else if (uvi >= 8 && uvi < 11) {
    document.querySelector(".uvi-color").style.backgroundColor = "red";
  } else {
    document.querySelector(".uvi-color").style.backgroundColor = "#8b0000";
  }
}

const parseDate = (unixDate) => moment.unix(unixDate).format("MM/DD/YYYY"); // translates unixData to standard format

let searchHistory = [];

var getWeather = function (city) {
  var apiUrl = `${pathName}weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response
          .json()
          .then(function (data) {
            console.log(data);
            let lon = data.coord.lon;
            let lat = data.coord.lat;
            let cityName = data.name;
            todaySection.innerHTML = `
            <h2 class="todayWeather">${cityName} (${parseDate(
              data.dt
            )})<span><img src="http://openweathermap.org/img/w/${
              data.weather[0].icon
            }.png"></img></span></h2>
            <p class="temp">Temp: ${data.main.temp} °F</p>
            <p class="wind">Wind: ${data.wind.speed} MPH</p>
            <p class="humidity">Humidity: ${data.main.humidity} %</p>
            <p class="uvi">UVI Index: <span class="uvi-color"></span></p>`;
            forecastUrl = `${pathName}${onecallUrl(
              lat,
              lon
            )}&units=imperial&appid=${apiKey}`;
            return fetch(forecastUrl);
          })
          .then((response) =>
            response.json().then(function (data2) {
              console.log(data2);
              console.log("results", data2.daily);
              let uvi = data2.daily[0].uvi;
              document.querySelector(".uvi-color").innerHTML = uvi;
              colorUvi(uvi); // colors uvi based on value
              //filters fetched data for days 1 - 5 (i.e. forecast days)
              const cardResults = [1, 2, 3, 4, 5].map(
                (item) => data2.daily[item]
              );
              console.log(cardResults);
              historyContainer.innerHTML = ""; // empties history container before rendering updated list
              displayCities(); // renders searched cities from local storage
              forecastElements.innerHTML = `<h3>5-Day Forecast</h3><section class="cards">${cardResults
                .map((obj) => {
                  return `<div class="card">
                    <p>${parseDate(obj.dt)}</p>
                    <p>Temp: ${obj.temp.day} °F</p>
                    <img src="http://openweathermap.org/img/w/${
                      obj.weather[0].icon
                    }.png"></img>
                    <p>Wind: ${obj.wind_speed} MPH</p>
                    <p>Humidity: ${obj.humidity} %</p>
                  </div>`;
                })
                .join("")}</section>`;
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

const submitFunction = function (event) {
  event.preventDefault();
  let searchedCity = searchedElement.value;
  main.classList.remove("hidden"); // push each score object to the array using unshift and save to local storage
  if (!searchHistory.includes(searchedCity)) {
    searchHistory.unshift(searchedCity);
  }
  localStorage.setItem("storedHistory", JSON.stringify(searchHistory));
  getWeather(searchedCity);
};

const submitHistoryItem = function (event) {
  event.preventDefault();
  let selectedElement = event.target;
  let searchedCity = selectedElement.textContent;
  forecastElements.textContent = "";
  historyContainer.innerHTML = "";
  main.classList.remove("hidden");
  getWeather(searchedCity);
};

const renderLocalCities = function () {
  //if user already has memories in local, else set empty
  const localSchedule = JSON.parse(localStorage.getItem("storedHistory")) || [];
  searchHistory = localSchedule; // and add the memory.
  displayCities();
};

renderLocalCities();

submitButton.addEventListener("click", submitFunction);
