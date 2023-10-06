$(document).ready(function () {
  // Test jQuery
  PopAlert("Document Loaded Successfully!", "success", 2000);
  $("#Input-Button").on("click", SearchCity);
});
let geoData;

function SearchCity(event) {
  event.preventDefault();

  let key = `5ceff8d977d5d19c7bead1274202f97a`;
  let city = $("#Input-City").val();
  let url_Geo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}`;
  let ourOptions = {
    method: "GET",
    cache: "reload",
  };

  getApiJson(url_Geo, ourOptions).then((jsonData) => {
    if (jsonData) {
      if (jsonData.length == 0) {
        console.log("Unknown City");
      } else {
        console.log(jsonData); // Print the JSON data to the console
        let geoData = jsonData[0];
        let lat = jsonData[0].lat;
        let lon = jsonData[0].lon;
        let url_weather = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

        getApiJson(url_weather, ourOptions).then((jsonData) => {
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
  $(`#Current-Temp`).html(`${Math.round(data.current.temp)}`);
  let date = UnixToDate(data.current.dt);
  console.log(date.toDateString);
  console.log(
    `${date.getHours().toString()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`
  );
  $(`#Percipitation`).text(`Precipitation`);
  $(`#Humidity`).text(`Precipitation`);
  $(`#Wind`).text(`Precipitation`);
}
