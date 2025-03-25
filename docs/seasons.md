---
title: The Seasons
draft: false
toc: false
---
# The Seasons

I'm embarrased to admit that I realized the other day I don't really, truly understand how the seasons work.  I broadly knew it had to do
with the tilt of the Earth's axis, but have to admit I never really it out.  In the northern hemisphere, summers are warmer than winters.
Why is that?  The other ady I was talking with my wife and we disagreed on the primary effect.  I felt as thought it had to do with the 
incidence angle of sunlight, the sun's light is more direct in summer, while she said it had to do with the increased days.

Let's see if we can settle this, and figure out which is the dominating effect.


```js echo
// Our units will all be in hours
const siderealDay = 23 + 56/60 + 4/60/60;
const year = 365.2422 * 24;
```



```js echo
// The earth's tilt
const theta0 = 23.5 * Math.PI / 180;
// Our latitude relative to the north pole.
const theta = (latitude + 90) / 180 * Math.PI;
// Our angle in orbit around the sun
const psi = day * 24 / year * 2 * Math.PI;
```

```js echo
function f(theta, phi, psi, theta0) {
    return (Math.cos(psi) * Math.cos(phi) * Math.sin(theta) + 
            Math.sin(psi) * Math.sin(phi) * Math.sin(theta) * Math.cos(theta0) - 
            Math.sin(psi) * Math.cos(theta) * Math.sin(theta0));
}

function relu(x) {
    return x > 0 ? x : 0;
}
```

```js echo
let ts = d3.range(0, 24, 1/60);
let data = ts.map(x => ({x: x, y: relu(f(theta, (day * 24 + x)/siderealDay * 2 * Math.PI + Math.PI, psi, theta0))}));
```

```js
const latitude = view(
  Inputs.range([-90, 90],
    {label: "latitude (deg)", value: 43}
  )
);


const day = view(
  Inputs.range([0, 365],
    {step: 1, label: "day"}
  )
);
```


```js
Plot.plot({
    width: 1080,
    y: {domain: [0, 1]},
    marks: [
    Plot.areaY(data, {x: "x", y: "y"})
    ]
})
```


```js
let total = data.reduce(([prevx, acc], {x, y}, i) => [x, acc + (x - prevx) * y], [0, -(data[1].x - data[0].x) * (data[0].y + data[data.length - 1].y)])[1]
```

The total irradiance is ${total.toPrecision(3)}.

Let's try to do the full year next.

```js
let yearTs = d3.range(0, year, 1/60);
let yearData = yearTs.map(x => ({x: x, y: relu(f(theta, x/siderealDay * 2 * Math.PI + Math.PI, x / year * 2 * Math.PI, theta0))}));
let yearTotal = yearData.reduce(([prevx, acc], {x, y}, i) => [x, acc + (x - prevx) * y], [0, -(yearData[1].x - yearData[0].x) * (yearData[0].y + yearData[yearData.length - 1].y)])[1]
```

The total irradiance is ${yearTotal.toPrecision(5)}.




```js
function yearlyFlux(latitude) {
    let theta = (latitude + 90) / 180 * Math.PI;
    let yearTs = d3.range(0, year, 1);
    let yearData = yearTs.map(x => ({x: x, y: relu(f(theta, x/siderealDay * 2 * Math.PI + Math.PI, x / year * 2 * Math.PI, theta0))}));
    let yearTotal = yearData.reduce(([prevx, acc], {x, y}, i) => [x, acc + (x - prevx) * y], [0, -(yearData[1].x - yearData[0].x) * (yearData[0].y + yearData[yearData.length - 1].y)])[1]
    return yearTotal;
}

let latitudes = d3.range(-90, 90, 1);
let fluxAtLatitude = latitudes.map(yearlyFlux)
```

```js
fluxAtLatitude
```

```js
Plot.plot({
    width: 1080,
    y: {domain: [0, 2700]},
    marks: [
    Plot.areaY(fluxAtLatitude)
    ]
})
```
