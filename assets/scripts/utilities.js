let alertTimer = null;

/**
 * Displays an alert message with specified text, type, and duration.
 *
 * @param {string} text - The text message to display in the alert.
 * @param {string} type - The type of alert (e.g., "success" or "info").
 * @param {number} duration - The duration in milliseconds for the alert to remain visible.
 */
function PopAlert(text, type, duration) {
  let alert = $("#Alert");
  alert.removeClass("alert-info");
  alert.removeClass("alert-success");

  switch (type) {
    case "success":
      alert.addClass("alert-success");
      break;
    case "info":
      alert.addClass("alert-info");
      break;
  }

  alert.attr(
    "style",
    "position: absolute; top: 0; width: 100%; visibility: visible;"
  );
  alert.text(text);

  clearInterval(alertTimer);

  alertTimer = setInterval(function () {
    $("#Alert").attr(
      "style",
      "position: absolute; top: 0; width: 100%; visibility: hidden;"
    );
    clearInterval(alertTimer);
  }, duration);
}

/**
 * Fetches data from a specified API endpoint with customizable options and returns it as a JSON object.
 *
 * @param {string} requestUrl - The URL of the API endpoint to fetch data from.
 * @param {Object} options - Customizable options for the fetch request (e.g., headers, method).
 * @returns {Promise<any>} A Promise that resolves with the fetched JSON data or rejects with an error message.
 */
async function GetApiJson(requestUrl, options) {
  try {
    const response = await fetch(requestUrl, options);

    if (!response.ok) {
      throw new Error(
        `Error Getting API: ${response.status + response.statusText}`
      );
    }

    console.log(`Successfully fetched api at ${requestUrl}`);
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

function StateToAbbr(state) {
  for (let element of states) {
    if (state === element[0]) {
      return element[1];
    }
  }
  return "";
}

let states = [
  ["Arizona", "AZ"],
  ["Alabama", "AL"],
  ["Alaska", "AK"],
  ["Arkansas", "AR"],
  ["California", "CA"],
  ["Colorado", "CO"],
  ["Connecticut", "CT"],
  ["Delaware", "DE"],
  ["Florida", "FL"],
  ["Georgia", "GA"],
  ["Hawaii", "HI"],
  ["Idaho", "ID"],
  ["Illinois", "IL"],
  ["Indiana", "IN"],
  ["Iowa", "IA"],
  ["Kansas", "KS"],
  ["Kentucky", "KY"],
  ["Louisiana", "LA"],
  ["Maine", "ME"],
  ["Maryland", "MD"],
  ["Massachusetts", "MA"],
  ["Michigan", "MI"],
  ["Minnesota", "MN"],
  ["Mississippi", "MS"],
  ["Missouri", "MO"],
  ["Montana", "MT"],
  ["Nebraska", "NE"],
  ["Nevada", "NV"],
  ["New Hampshire", "NH"],
  ["New Jersey", "NJ"],
  ["New Mexico", "NM"],
  ["New York", "NY"],
  ["North Carolina", "NC"],
  ["North Dakota", "ND"],
  ["Ohio", "OH"],
  ["Oklahoma", "OK"],
  ["Oregon", "OR"],
  ["Pennsylvania", "PA"],
  ["Rhode Island", "RI"],
  ["South Carolina", "SC"],
  ["South Dakota", "SD"],
  ["Tennessee", "TN"],
  ["Texas", "TX"],
  ["Utah", "UT"],
  ["Vermont", "VT"],
  ["Virginia", "VA"],
  ["Washington", "WA"],
  ["West Virginia", "WV"],
  ["Wisconsin", "WI"],
  ["Wyoming", "WY"],
];

function UnixToDate(unix) {
  return new Date(unix * 1000);
}

function CapitalizeStringWords(string) {
  let words = string.split(" ");

  let capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(" ");
}

function GetData(item) {
  let data = localStorage.getItem(item);
  console.log("Data Retrieved from Local Storage");
  return JSON.parse(data);
}

function SetData(item, data) {
  let jsonData = JSON.stringify(data);
  localStorage.setItem(item, jsonData);
  console.log("Data Saved to Local Storage");
}
