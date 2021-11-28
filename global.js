export const colorUvi = (uvi) => {
  if (uvi < 3) {
    document.querySelector(".uvi-color").style.backgroundColor = "green";
  } else if (uvi >= 3 && uvi < 8) {
    document.querySelector(".uvi-color").style.backgroundColor = "yellow";
    document.querySelector(".uvi-color").style.color = "black";
  } else {
    document.querySelector(".uvi-color").style.backgroundColor = "red";
  }
};

// translates unixData to standard format
export const parseDate = (unixDate) =>
  moment.unix(unixDate).format("MM/DD/YYYY");

export const onecallUrl = (latitude, longitude) => {
  return `onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly`;
};
