---
title: The Earth is Round
draft: true
---
# The Earth is Round


My son is taking an archery class and a couple of the other kids in the class appear to be flat-earthers. At a recent class, they were challenging the other kids on why they believed the Earth was round and what evidence they had for this belief. My son proffered that he has seen photos of the earth from space, but they were quick to dismiss these as being fake.  This made my son upset, but led to what I think are some deep conversations about evidence, belief and experience.

In particular, I had to admit that most people who believe the earth is round probably don't have any direct experience or evidence for this fact, they largely belief it because they were told it is true by others.  This got me thinking about how I might be able to give my sons some direct experience of the Earth being round.

We recently took a trip to Buffalo NY to visit family and try to view the total solar eclipse.

```js
import { unit, multiply, divide, subtract } from 'npm:mathjs';
```


```js
const gnomen = unit(8.5, 'cm')  // error of 0.1 cm
const buffalo = unit(6.1, 'cm')  // error of 0.1 cm
// const kissimmee = unit(3.8, 'cm') 
const kissimmee = unit(1+7/32, 'inch')   // error of 1/32
const dist = unit(1014, 'mile')  // from flight  should add an error of ~50 miles
// const dist = unit(1018, 'mile')  // direct
// const dist = unit(69 * (42.8864 - 29.2956), 'mile') // from latitudes
const trueRadius = unit(6378.1370, 'km') // km
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
let thetaBuffalo = Math.atan2(gnomen.toNumber('m'), buffalo.toNumber('m'))
let thetaKissimmee = Math.atan2(gnomen.toNumber('m'), kissimmee.toNumber('m'))
let radiusEarth = divide(dist, subtract(thetaKissimmee, thetaBuffalo))
```

Our estimate is: ${radiusEarth.toNumber('km').toLocaleString(undefined, {maximumSignificantDigits: 3})} km.   This is an error of ${divide(subtract(radiusEarth, trueRadius), trueRadius).toLocaleString(undefined, {maximumSignificantDigits: 2, style: "percent"})} percent.
