---
title: The Earth is Round
draft: true
---
# The Earth is Round

We recently took a trip to Buffalo NY to visit family and try to view the total solar eclipse.


```js
const gnomen = 8.5  // cm
const buffalo = 6.1 // cm
const kissimmee = 3.8 // cm
const dist = 1014 * 1.60934 // km
const trueRadius = 6378.1370 // km
```

We can try to estimate the size of the Earth with this information.  We have that the distance between
the two cities should be the radius of the earth times the angle between them.

```tex
d = R \Delta \theta
```

And we can try to figure out the angle between them by using the Sun's shadow length:
```tex
\tan \theta = \frac{\ell_{\text{shadow}}}{\ell_{\text{gnomen}}} 
```

```js
let thetaBuffalo = Math.atan2(gnomen, buffalo)
let thetaKissimmee = Math.atan2(gnomen, kissimmee)
let radiusEarth = dist / (thetaKissimmee - thetaBuffalo)
```

Our estimate is: ${radiusEarth} km.   This is an error of ${(radiusEarth - trueRadius)/trueRadius * 100} percent.
