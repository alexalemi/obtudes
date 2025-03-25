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
    Plot.lineY(data, {x: "x", y: "y"})
    ]
})
```

