// https://openweathermap.org/current
// https://openweathermap.org/weather-data

import { colorUvi } from "./global.js";
import { parseDate } from "./global.js";
import { onecallUrl } from "./global.js";

const todaySection = document.querySelector(".today");
const forecastElements = document.querySelector(".forecast");
const searchedElement = document.querySelector(".searchCity");
const submitButton = document.querySelector(".submit");
const main = document.querySelector("main");
const clearElement = document.querySelector(".clear");
const historyContainer = document.querySelector(".history-container");
const apiKey = "8fcf15f1446775617fe9577e790f0250";
const pathName = "https://api.openweathermap.org/data/2.5/";

let searchHistory = [];

const displayCities = () => {
  searchHistory.forEach((e) => {
    const searchedElement = document.createElement("button");
    searchedElement.textContent = e;
    searchedElement.addEventListener("click", submitHistoryItem);
    historyContainer.appendChild(searchedElement);
  });
};

const getWeather = function (city) {
  var apiUrl = `${pathName}weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response
          .json()
          .then(function (data) {
            console.log(data);
            const lon = data.coord.lon;
            const lat = data.coord.lat;
            const cityName = data.name;
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
            const forecastUrl = `${pathName}${onecallUrl(
              lat,
              lon
            )}&units=imperial&appid=${apiKey}`;
            return fetch(forecastUrl);
          })
          .then((response) =>
            response.json().then(function (data2) {
              console.log(data2);
              console.log("results", data2.daily);
              const uvi = data2.daily[0].uvi;
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
        searchHistory.shift();
        localStorage.setItem("storedHistory", JSON.stringify(searchHistory));
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
  const selectedElement = event.target;
  const searchedCity = selectedElement.textContent;
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

clearElement.addEventListener("click", function () {
  window.localStorage.removeItem("storedHistory");
});

renderLocalCities();

submitButton.addEventListener("click", submitFunction);
