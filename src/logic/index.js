import * as c from "../constants.js";

const currentTemperatureElement = document.getElementById(
  "current-temperature"
);

const rowTime = document.querySelectorAll(".row-time");
const rowIcon = document.querySelectorAll(".row-icon");
const rowTemperature = document.querySelectorAll(".row-temperature");
const weatherPhrase = document.querySelector("#weather-phrase");

async function request(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error de red: ${response.statusText}`);
    }
    let data = await response.json();
    let currentTemperature = data.current.temperature_2m;
    currentTemperatureElement.innerText = currentTemperature;

    let currentTime = data.current.time;
    currentTime = data.current.time.split(":")[0] + ":00".trim();

    let hourlyTime = data.hourly.time;
    let hourlyWeatherCode = data.hourly.weather_code;
    let hourlyTemperature = data.hourly.temperature_2m;

    let index = hourlyTime.findIndex((el) => el === currentTime);

    rowTime[0].innerHTML = `
      <span>Ahora</span>
    `;

    let urlImage;

    switch (hourlyWeatherCode[index]) {
      case 0:
        urlImage = "./sun.png"
        break;
      case 1:
      case 2:
      case 3:
        urlImage = "./cloudy.png"
        break;
      case 61:
      case 63:
      case 65:
        urlImage = "./rainy.png"
        break;
      default:
        urlImage = "./sun.png"
        break;
    }

    rowIcon[0].innerHTML = `
      <img src="${urlImage}"></img>
    `;

    let temperature = Math.round(currentTemperature);

    rowTemperature[0].innerHTML = `
      <span>${temperature}º</span>
  `;

    let counter = 1;
    for (let i = index + 1; i < index + 6; i++) {
      let formatHourlyTime = hourlyTime[i].split("T")[1];
      rowTime[counter].innerHTML = `
      <span>${formatHourlyTime}</span>
      `;

      let urlImage;

      switch (hourlyWeatherCode[index]) {
        case 0:
          urlImage = "./sun.png"
          break;
        case 1:
        case 2:
        case 3:
          urlImage = "./cloudy.png"
          break;
        case 61:
        case 63:
        case 65:
          urlImage = "./rainy.png"
          break;
        default:
          urlImage = "./sun.png"
          break;
      }

      rowIcon[counter].innerHTML = `
        <img src="${urlImage}"></img>
      `;

      rowTemperature[counter].innerHTML = `
      <span>${hourlyTemperature[i]}º</span>
    `;

      counter++;
    }

    let currentWindSpeed = data.current.wind_speed_10m;

    if (currentWindSpeed > c.STRONG_WIND) {
      weatherPhrase.innerText = c.STRONG_WIND_PHRASE;
    } else if (currentTemperature > c.HIGH_TEMPERATURE) {
      weatherPhrase.innerText = c.HIGH_TEMPERATURE_PHRASE;
    } else if (currentTemperature < c.LOW_TEMPERATURE) {
      weatherPhrase.innerText = c.LOW_TEMPERATURE_PHRASE;
    } else {
      let id = getRandomFloatArbitrary(0, c.PHRASES.length);
      weatherPhrase.innerText = c.PHRASES[id];
    }
  } catch (error) {
    console.error("Error en la solicitud:", error.message);
  }
}

function getRandomFloatArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

request(c.API_URL);
