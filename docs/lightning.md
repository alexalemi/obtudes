---
title: Lightning Strikes
draft: true
---

# Lightning Strikes

Let's try to use D3 to map out all of the recent lightning strikes.

```js
import * as d3 from "npm:d3";
import * as topojson from "npm:topojson-client";
```



```js
const lightningData = FileAttachment("./data/lightning.json").json();
const us = FileAttachment("./data/counties-10m.json").json();
```
```js
const nation = topojson.feature(us, us.objects.nation);
```


I can get a bit array of the recent ones. 

```js
// ts, lat, lon, type, magnitude
display(lightningData);
```

Here is a map of the recent strikes: 
```js
const statemap = new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]));
const countymap = new Map(topojson.feature(us, us.objects.counties).features.map(d => [d.id, d]));
const statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
```

```js
display(
Plot.plot({
  width: 975,
  r: { transform: (d) => Math.pow(10, (d+30)/100) },
  projection: "albers-usa",
  marks: [
    Plot.geo(nation, { fill: "#ddd" }),
    Plot.geo(statemesh, { stroke: "white" }),
    Plot.dot(lightningData, 
        {x: "longitude",
         y: "latitude",
         r: "magnitude",
         fill: "type",
         fillOpacity: 0.2,
         }),
  ]
})
);
```


