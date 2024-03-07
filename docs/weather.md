---
theme: dashboard
toc: false
---

# Weather Report

Let's see if I can get a good weather report going.


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

```js
display(
Plot.plot({ 
    x: {type: "utc", ticks: "day", label: null},
    marks: [
        Plot.frame(),
        Plot.lineY(forecast, {x: "validTimeLocal", y: "wbgt" })
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
 * Build out the warnings for the WBGT, UV Index, Heat Index, Lightning Strikes and Alerts.
 * Make some graphs for a forecast
 * Try to get some hyperlocal forecast stuff
