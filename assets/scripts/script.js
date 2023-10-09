$(document).ready(function () {
  // Test jQuery
  PopAlert('Document Loaded Successfully!', 'success', 2000);
  SearchCity('atlanta');
  searchButtons = $('#Search-Buttons').children('button');
  UpdateSearchButtons();
  //Clear Local Storage with Ctrl - C
  $(document).keydown(function (event) {
    if (event.ctrlKey && event.key === 'c') {
      localStorage.removeItem('weatherHistory');
    }
  });
  $('#Input-Button').on('click', Submit);

  $(searchButtons).on('click', SearchButton);
});

let geoData;
let searchButtons;

function Submit(event) {
  event.preventDefault();
  let city = $('#Input-City').val();
  AddHistory(city);
  SearchCity(city);
  UpdateSearchButtons();
}

function SearchButton(event) {
  SearchCity($(this).text());
}

function SearchCity(city) {
  let key = `5ceff8d977d5d19c7bead1274202f97a`;
  let url_Geo = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}`;
  let ourOptions = {
    method: 'GET',
    cache: 'reload',
  };

  GetApiJson(url_Geo, ourOptions).then((jsonData) => {
    if (jsonData) {
      if (jsonData.length == 0) {
        console.log('Unknown City');
      } else {
        console.log(jsonData); // Print the JSON data to the console
        let geoData = jsonData[0];
        let lat = jsonData[0].lat;
        let lon = jsonData[0].lon;
        let url_weather = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

        GetApiJson(url_weather, ourOptions).then((jsonData) => {
          if (jsonData) {
            if (jsonData.length == 0) {
              console.log('Unknown City');
            } else {
              console.log(jsonData); // Print the JSON data to the console
              PopAlert(`Loaded ${city} Successfully!`, 'success', 2000);
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
  let formattedDate = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  $(`#Feels-Like`).text(
    `Feels Like : ${Math.round(data.current.feels_like) + '°'}`
  );
  $(`#Humidity`).text(`Humidity : ${Math.round(data.current.humidity)}%`);
  $(`#Wind`).text(`Wind Speed : ${Math.round(data.current.wind_speed)} mph`);
  $(`#Current-Status`).text(
    `${CapitalizeStringWords(
      data.current.weather[0].description
    )} - ${formattedDate}`
  );

  let iconUrl = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;
  $(`#Weather-Icon`).attr('src', iconUrl);
  LoadCards(data);
}

function LoadCards(data) {
  let weeklyForecast = $('#Forecast').children('div');
  for (let i = 0; i < 6; i++) {
    let cardData = data.daily[i + 1];
    //Load Date
    let card = weeklyForecast[i];
    let date = UnixToDate(cardData.dt);
    let formattedDate = date.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
    });
    $(card).children().eq(0).text(formattedDate);

    //Load Icon
    let iconUrl = `https://openweathermap.org/img/w/${cardData.weather[0].icon}.png`;
    $(card).children().eq(1).attr('src', iconUrl);
    console.log(cardData);

    //Load Temps
    $(card)
      .children()
      .eq(2)
      .text('Temp ' + Math.round(cardData.temp.day) + '°');
    $(card)
      .children()
      .eq(3)
      .text('Humid ' + Math.round(cardData.humidity) + '%');
    $(card)
      .children()
      .eq(4)
      .text('Wind  ' + Math.round(cardData.wind_speed) + 'mph');
  }
}

function AddHistory(city) {
  city = city.toLowerCase();
  let history = GetData('weatherHistory');

  if (!history) {
    history = [];
  }

  let uniqueCities = [];

  for (const item of history) {
    if (item !== city) {
      uniqueCities.push(item);
    }
  }

  uniqueCities.unshift(city);

  SetData('weatherHistory', uniqueCities);
}

function UpdateSearchButtons(city) {
  let history = GetData('weatherHistory');
  if (!history) {
    history = [];
  }
  for (let i = 0; i < searchButtons.length; i++) {
    if (history[i]) {
      $(searchButtons[i]).text(CapitalizeStringWords(history[i]));
      $(searchButtons[i]).attr('style', 'visibility: visible');
    } else {
      $(searchButtons[i]).text('.');
      $(searchButtons[i]).attr('style', 'visibility: hidden');
    }
  }
}
