import { colorUvi } from "./global.js"; // Imports global functions from global.js
import { parseDate } from "./global.js";
import { onecallUrl } from "./global.js";

const todaySection = document.querySelector(".today"); // Define DOM elements
const forecastElements = document.querySelector(".forecast");
const searchedElement = document.querySelector(".searchCity");
const submitButton = document.querySelector(".submit");
const main = document.querySelector("main");
const clearElement = document.querySelector(".clear");
const historyContainer = document.querySelector(".history-container");

const apiKey = "8fcf15f1446775617fe9577e790f0250"; // My OpenWeather's API key
const pathName = "https://api.openweathermap.org/data/2.5/"; // standard OpenWeather's path

let searchHistory = []; // array to store cities searched

// function to render DOM button elements for searched cities
const displayCities = () => {
  searchHistory.forEach((e) => {
    const searchedElement = document.createElement("button");
    searchedElement.textContent = e;
    searchedElement.addEventListener("click", submitHistoryItem); // adds event listener for each button
    historyContainer.appendChild(searchedElement);
  });
};

// Fetches both the current api and onecall api from the OpenWeather API
const getWeather = function (city) {
  var apiUrl = `${pathName}weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response
          .json()
          .then(function (data) {
            // data is what has been retreived through the first current api call
            const lon = data.coord.lon; // store longitude of searched city
            const lat = data.coord.lat; // store latitude of searched city
            const cityName = data.name; // store cityName
            // Renders html using template string and the map method and populates current date, cityname, humidity, temperature and speed using the current api data
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
            // defines forecastUrl to retreieve data from the OneCall API which requires lon and lat as inputs
            const forecastUrl = `${pathName}${onecallUrl(
              lat,
              lon
            )}&units=imperial&appid=${apiKey}`;
            return fetch(forecastUrl);
          })
          .then((response) =>
            response.json().then(function (data2) {
              // data2 is the second dataset obtained through the second api call from the OneCall API
              const uvi = data2.daily[0].uvi; // retreives current uvi which is available in the second call data
              document.querySelector(".uvi-color").innerHTML = uvi; // rpopulates uvi in the current weather section rendered above
              colorUvi(uvi); // colors uvi based on value using imported function from global.js
              //filters daily array for the required forecasted days (i.e. forecasted days 1-5)
              const cardResults = [1, 2, 3, 4, 5].map(
                (item) => data2.daily[item]
              );
              historyContainer.innerHTML = ""; // empties history container before rendering updated list
              displayCities(); // renders searched cities from local storage
              // Using template string and the map method populates forecast dates, weather icons, humidity, temperature and speed using forecasted data from the OneCall API
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
        // removes last pushed element (via unshift) if city does not exist or any other error
        searchHistory.shift();
        localStorage.setItem("storedHistory", JSON.stringify(searchHistory));
        main.classList.add("hidden");
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeathermap");
    });
};
// form button event listener function
const submitFunction = function (event) {
  event.preventDefault();
  let searchedCity = searchedElement.value;
  main.classList.remove("hidden");
  // push to first element of array using unshift and save to local storage
  if (!searchHistory.includes(searchedCity)) {
    searchHistory.unshift(searchedCity);
  }
  localStorage.setItem("storedHistory", JSON.stringify(searchHistory));
  getWeather(searchedCity);
};
// event listener function corresponding to the searched city buttons
const submitHistoryItem = function (event) {
  event.preventDefault();
  const selectedElement = event.target;
  const searchedCity = selectedElement.textContent;
  forecastElements.textContent = "";
  historyContainer.innerHTML = "";
  main.classList.remove("hidden");
  getWeather(searchedCity);
};

const renderLocalCities = function () {
  const localSchedule = JSON.parse(localStorage.getItem("storedHistory")) || []; //if user already has memories in local, else set empty
  searchHistory = localSchedule; // and add the memory.
  displayCities();
};

// clears searched city elements from local storage upon the "clear history" click
clearElement.addEventListener("click", function () {
  window.localStorage.removeItem("storedHistory");
});

renderLocalCities();

submitButton.addEventListener("click", submitFunction);
