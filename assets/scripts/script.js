$(document).ready(function () {
  // Test jQuery
  PopAlert("Document Loaded Successfully!", "success", 2000);
  SearchCity("atlanta");
  $("#Input-Button").on("click", SearchCity);
});
let geoData;

function Submit(event) {
  event.preventDefault(event);
  let city = $("#Input-City").val();
  SearchCity(city);
}
function SearchCity(city) {
  let key = `5ceff8d977d5d19c7bead1274202f97a`;
  let url_Geo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}`;
  let ourOptions = {
    method: "GET",
    cache: "reload",
  };

  GetApiJson(url_Geo, ourOptions).then((jsonData) => {
    if (jsonData) {
      if (jsonData.length == 0) {
        console.log("Unknown City");
      } else {
        console.log(jsonData); // Print the JSON data to the console
        let geoData = jsonData[0];
        let lat = jsonData[0].lat;
        let lon = jsonData[0].lon;
        let url_weather = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

        GetApiJson(url_weather, ourOptions).then((jsonData) => {
          if (jsonData) {
            if (jsonData.length == 0) {
              console.log("Unknown City");
            } else {
              console.log(jsonData); // Print the JSON data to the console
              PopAlert(`Loaded ${city} Successfully!`, "success", 2000);
              LoadPage(jsonData, geoData);
            }
          }
        });
      }
    }
  });
}

function LoadPage(data, geo) {
  console.log(data);
  $(`#City-Name`).text(`${geo.name}, ${StateToAbbr(geo.state)}`);
  $(`#Current-Temp`).html(`${Math.round(data.current.temp)}°`);
  let date = UnixToDate(data.current.dt);
  let formattedDate = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  $(`#Feels-Like`).text(
    `Feels Like : ${Math.round(data.current.feels_like) + "°"}`
  );
  $(`#Humidity`).text(`Humidity : ${Math.round(data.current.humidity)}%`);
  $(`#Wind`).text(`Wind Speed : ${Math.round(data.current.wind_speed)} mph`);
  $(`#Current-Status`).text(
    `${CapitalizeStringWords(
      data.current.weather[0].description
    )} - ${formattedDate}`
  );

  let iconUrl = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;
  $(`#Weather-Icon`).attr("src", iconUrl);
  LoadCards(data);
}

function LoadCards(data) {
  let weeklyForecast = $("#Forecast").children("div");
  for (let i = 0; i < 6; i++) {
    let cardData = data.daily[i + 1];
    //Load Date
    let card = weeklyForecast[i];
    let date = UnixToDate(cardData.dt);
    let formattedDate = date.toLocaleString("default", {
      month: "short",
      day: "numeric",
    });
    $(card).children().eq(0).text(formattedDate);

    //Load Icon
    let iconUrl = `https://openweathermap.org/img/w/${cardData.weather[0].icon}.png`;
    $(card).children().eq(1).attr("src", iconUrl);

    //Load Temps
    $(card)
      .children()
      .eq(2)
      .text("H " + Math.round(cardData.temp.max) + "°");
    $(card)
      .children()
      .eq(3)
      .text("L " + Math.round(cardData.temp.min) + "°");
  }
  //Make 6 Cards
  //Add Date
  //data.daily[0].dt
  //Add Icon
  //data.daily[0].weather[0].icon
  //Add High Temp
  //data.daily[0].temp.max
  //Add Low Temp
  //data.daily[0].temp.min
}
