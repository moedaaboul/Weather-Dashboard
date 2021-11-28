// Current weather app
//IMPORTANT DOCS ===============
// https://openweathermap.org/weather-data

const tempElement = document.querySelector(".temp");
const windElement = document.querySelector(".wind");
const humiditiyElement = document.querySelector(".humidity");
const uviElement = document.querySelector(".uvi");
const todayElement = document.querySelector(".todayWeather");
const cardElements = document.querySelector(".cards");
const searchedElement = document.querySelector(".searchCity");
const submitButton = document.querySelector(".submit");
const main = document.querySelector("main");
const historyContainer = document.querySelector(".history-container");

const apiKey = "8fcf15f1446775617fe9577e790f0250";
const pathName = "https://api.openweathermap.org/data/2.5/";

const onecallUrl = (latitude, longitude) => {
  return `onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly`;
};
const currentUrl = "weather?q=";

// https://openweathermap.org/current
// const unitsImperial = "&units=imperial";

let displayCities = () => {
  searchHistory.forEach((e) => {
    const searchedElement = document.createElement("button");
    searchedElement.textContent = e;
    searchedElement.addEventListener("click", submitHistoryItem);
    historyContainer.appendChild(searchedElement);
  });
};

const parseDate = (unixDate) => moment.unix(unixDate).format("MM/DD/YYYY");

let variable = [];
let searchHistory = [];

const allowed = ["dt", "humidity", "temp", "uvi", "wind_speed", "weather"];

var getWeather = function (city) {
  var apiUrl =
    pathName + "weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;
  // var apiUrl = `${pathName}${typeofUrl}${city}${unitsImperial}&appid=${apiKey}`

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        // searchHistory.push(city);
        response
          .json()
          .then(function (data) {
            console.log(data);
            let lon = data.coord.lon;
            let lat = data.coord.lat;
            let currentWind = "Wind: " + data.wind.speed + " MPH";
            let currentHumidity = "Humidity: " + data.main.humidity + " %";
            let cityName = data.name;
            currentDateUnix = data.dt;
            console.log(currentDateUnix);
            let currentDate = parseDate(currentDateUnix);
            console.log(currentDate);
            let currentTemp = "Temp: " + data.main.temp + "°F";
            tempElement.textContent = currentTemp;
            windElement.textContent = currentWind;
            humiditiyElement.textContent = currentHumidity;
            todayElement.textContent = cityName + " " + "(" + currentDate + ")";
            forecastUrl =
              pathName +
              onecallUrl(lat, lon) +
              "&units=imperial" +
              "&appid=" +
              apiKey;
            return fetch(forecastUrl);
          })
          .then((response) =>
            response.json().then(function (data2) {
              console.log(data2);
              let results = [];
              data2.daily.forEach((e, i) => {
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
              // const uviSpanElement = document.createElement("span");
              let uvi = results[0].uvi;
              uviElement.innerHTML = `UV Index: <span class="uvi-color">${uvi}</span>`;
              const uviColor = document.querySelector(".uvi-color");
              if (uvi < 3) {
                uviColor.style.backgroundColor = "green";
              } else if (uvi >= 3 && uvi < 6) {
                uviColor.style.backgroundColor = "yellow";
                uviColor.style.color = "black";
              } else if (uvi >= 6 && uvi < 8) {
                uviColor.style.backgroundColor = "brown";
              } else if (uvi >= 8 && uvi < 11) {
                uviColor.style.backgroundColor = "red";
              } else {
                uviColor.style.backgroundColor = "#8b0000";
              }
              const cardResults = [1, 2, 3, 4, 5].map((item) => results[item]);
              console.log(cardResults);
              historyContainer.innerHTML = "";
              /// add loop here for the elements
              displayCities();
              cardResults.forEach((obj) => {
                const datefcstElement = document.createElement("p");
                const tempfcstElement = document.createElement("p");
                const iconElement = document.createElement("img");
                const windfcstElement = document.createElement("p");
                const humidityfcstElement = document.createElement("p");
                const cardElement = document.createElement("div");
                // rank.setAttribute("scope", "row");
                datefcstElement.innerHTML = parseDate(obj.dt);
                console.log(obj);
                console.log(obj.weather[0].icon);
                iconElement.src = `http://openweathermap.org/img/w/${obj.weather[0].icon}.png`;
                tempfcstElement.innerHTML = "Temp: " + obj.temp.day + "°F";
                windfcstElement.innerHTML = "Wind: " + obj.wind_speed + " MPH";
                humidityfcstElement.innerHTML =
                  "Humidity: " + obj.humidity + " %";
                cardElement.classList.add("card");
                cardElement.appendChild(datefcstElement);
                cardElement.appendChild(iconElement);
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

const submitFunction = function (event) {
  event.preventDefault();
  let searchedCity = searchedElement.value;
  cardElements.textContent = "";
  main.classList.remove("hidden");
  // results = [];
  // push each score object to the array and save to local storage
  if (!searchHistory.includes(searchedCity)) {
    searchHistory.unshift(searchedCity);
  }
  localStorage.setItem("storedHistory", JSON.stringify(searchHistory));
  getWeather(searchedCity, currentUrl);
};

const submitHistoryItem = function (event) {
  let selectedElement = event.target;
  let searchedCity = selectedElement.textContent;
  cardElements.textContent = "";
  historyContainer.innerHTML = "";
  main.classList.remove("hidden");
  // push each score object to the array and save to local storage
  getWeather(searchedCity, currentUrl);
};

const renderLocalCities = function () {
  //if user already has memories in local, get that array and push into it.
  //else create a blank array and add the memory.
  const localSchedule = JSON.parse(localStorage.getItem("storedHistory")) || [];
  searchHistory = localSchedule;
  // push each score object to the array and save to local storage
  displayCities();
};

renderLocalCities();

submitButton.addEventListener("click", submitFunction);
