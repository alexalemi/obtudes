---
theme: dashboard
toc: false
title: Weather Report
---

# Weather Report


Let's see if I can get a good weather report going.

```js
const readings_arr = data[0].record.readings
let readings = Object.fromEntries(readings_arr.map((x) => [x.sensor_type, x]));
display(readings)
```

```js
const temperature = readings.Thermometer.value;
const wbgt = readings["Wet Bulb Globe Temperature"].value;
const heatIndex = readings["Heat Index"].value;
const uvIndex = readings["UV Radiation Sensor"].value;

function timeToBurn(uvi) {
    // Use *4 for type III skin, *3 for type II (Mal) or *5 for type IV.
    return (200 * 4) / (3 * uvi);
}

const ttb = timeToBurn(uvIndex);

function formatMsg(level, msg) {
    const colors = ["muted", "blue", "green", "yellow", "red", "red"];
    return html`<span class="${colors[level]}">${msg}</span>`
}

function wbgtMessage(x) {
    if (x < 80) {
        return formatMsg(0, "No issue.");
    } else if (x < 85) {
        return formatMsg(1, "Low, Body stressed after 45 minutes.");
    } else if (x < 88) {
        return formatMsg(2, "Moderate, body stressed after 30 minutes, heat cramps likely.");
    } else if (x < 90) {
        return formatMsg(3, "High, body stressed after 20 minutes. Heat exhaustion likely.");
    } else if (x < 95) {
        return formatMsg(4, "Extreme, body stressed after 15 minutes. Heat stroke likely.");
    } else {
        return formatMsg(5, "DANGER. Limit of survivability at 6 hours.");
    }
}

function heatIndexMessage(x) {
    if (x < 80) {
        return formatMsg(0, "No issue.");
    } else if (x < 90) {
        return formatMsg(1, "Caution. Fatigue possible with prolonged exposure and/or physical activity.");
    } else if (x < 103) {
        return formatMsg(2, "Extreme Caution. Heat stroke, heat crams or heat exhaustion possible with prolonged exposure and/or physical activity.");
    } else if (x < 125) {
        return formatMsg(3, "Danger. Heat cramps or heat exhaustion likely, and heat stroke possible with prolonged exposure and/or physical activity.");
    } else {
        return formatMsg(4, "Extreme Danger! Heat stroke highly likely.");
    }
}

function uvIndexMessage(x) {
    if (x < 2.5) {
        return formatMsg(0, "Low, you can safely enjoy being outside.");
    } else if (x < 5.5) {
        return formatMsg(1, "Moderate. Take precautions.");
    } else if (x < 7.5) {
        return formatMsg(2, "High. Protection against sun damage is needed. Wear a heat, sunglasses, sunscreen and a long sleeved shirt.");
    } else if (x < 10.5) {
        return formatMsg(3, "Very High. Protection against sun damage is needed.");
    } else {
        return formatMsg(4, "Extreme!");
    }
}

```

## Short Report and Dangers

It is currently ${temperature} &deg;F.

The WBGT is ${wbgt} &deg;F.  Which indicates: ${wbgtMessage(wbgt)}.

The Heat Index is ${heatIndex} &deg;F. Which indicates: ${heatIndexMessage(heatIndex)}.

The UV Index is ${uvIndex}. Which is a time to burn of ${ttb.toFixed(0)} minutes. Which indicates: ${uvIndexMessage(uvIndex)}.

There are currently ${alerts.length} alerts.

${accuweather.Summary.Phrase}

# Data Sources

## WeatherStem API V1

The data from the v1 api is:
```js
const data = FileAttachment("./data/weatherstem.json").json();
```


```js
display(data)
```

## WeatherStem Alerts

The alerts data is:
```js
const alerts = FileAttachment("./data/alerts.json").json();
```


```js
display(alerts)
```

## Full Lightning Data

The full lightning data is:

```js
const lightningData = FileAttachment("./data/lightning.json").json();
```

```js
display(lightningData)
```

## WeatherStem V2 API Forecast

The forecast data is:

```js
const forecast = FileAttachment("./data/weatherstem_forecast.json").json();
```
```js
display(forecast)
```

WBGT (purple) and Feels Like (red) plot:
```js
display(
Plot.plot({ 
    x: {type: "utc", ticks: "day", label: null},
    marks: [
        Plot.frame(),
        Plot.lineY(forecast, {x: "validTimeLocal", y: "wbgt", stroke: "purple" }),
        Plot.lineY(forecast, {x: "validTimeLocal", y: "temperatureFeelsLike", stroke: "red"}),
        ]})
);
```

Rain Forecast
```js
display(
Plot.plot({ 
    x: {type: "utc", ticks: "day", label: null},
    y: {domain: [0, 100]},
    marks: [
        Plot.frame(),
        Plot.lineY(forecast, {x: "validTimeLocal", y: "precipChance" })
        ]})
);
```

## NWS Forecast

```js
const nws = FileAttachment("./data/forecast.json").json();
```
```js
display(nws)
```


## Accuweather

```js
const accuweather = FileAttachment("./data/accuweather.json").json();
```
```js
display(accuweather)
```


## TODO

 * Get some historical readings from the station
 * Make a one day forecast graph
 * Make some graphs for a forecast
 * Figure out how to process alerts
 * Figure out how to process lightning
