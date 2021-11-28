export const colorUvi = (uvi) => {
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
};

// translates unixData to standard format
export const parseDate = (unixDate) =>
  moment.unix(unixDate).format("MM/DD/YYYY");

export const onecallUrl = (latitude, longitude) => {
  return `onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly`;
};
