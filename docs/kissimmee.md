---
title: Kissimmee
draft: true
theme: dashboard
toc: false
---
# Kissimmee

Let's try to take a look at tax data for Osceola County and in particular Kissimmee, FL.  In particular, we are interested in building up to a value per acre type analysis.

We downloaded the tax data from the [Osceola Tax Collector](https://www.dropbox.com/scl/fo/ncotvgzpoii7j445mcewp/AI3y73wJ-kmBXBbgbp5ypNA?rlkey=2rheyqbskjeveytacszf3gnbo&e=2&dl=0) as some Zipped GIS data.

We can load that here, though it takes a minute

```js
import * as shapefile from "npm:shapefile";
const osceola = shapefile.read(
  ...(await Promise.all([
      FileAttachment("./data/OsceolaTaxParcels/OsceolaTaxParcels.shp").stream(),
      FileAttachment("./data/OsceolaTaxParcels/OsceolaTaxParcels.dbf").stream()
      ]))
);
```

This is a large geoJSON object with every parcel in Osceola county.

```js
osceola
```

We can filter out just kissimmee:

```js
import * as geo from "npm:geotoolbox";
const kissimmee = geo.filter(osceola, d => (d.DistGroup == "200"));
const downtown = geo.filter(osceola, d => (d.DistGroup == "200") && (d.CRA == "KISSIMMEE CRA"))
const vinest = geo.filter(osceola, d => (d.DistGroup == "200") && (d.CRA == "VINE STREET CRA"))
```


```js
kissimmee
```


Here is the plot.

```js
function valuePerAcre(d) {
    if (d.properties.TotalAcres > 0) {
        return d.properties.EstimatedT / d.properties.TotalAcres;
        // return d.properties.CurrJust / d.properties.TotalAcres;
        // return d.properties.CurrentLand / d.properties.TotalAcres;
    } else {
        return 0.0;
    }
}
```

```js
Plot.plot({
  projection: {type: "reflect-y", domain: kissimmee},
  width: 5200,
  height: 5200,
  /* color: {
      type: "quantile",
      n: 9,
      scheme: "blues",
      label: "Value Per Acre",
      legend: true
  }, */
  color: {
      type: "threshold",
      scheme: "turbo",
      domain: [1, 40_000, 80_000, 150_000, 300_000, 400_000, 650_000, 1_000_000, 2_000_000, 3_500_000, 7_000_000, 10_000_000],
      legend: true,
  },
  /*
  color: {
      type: "linear",
      scheme: "inferno",
      legend: true,
      domain: [1, 10_000_000],
      type: "sqrt"
      // type: "linear"
  },
  */
  marks: [
    Plot.geo(kissimmee, {
        strokeOpacity: 0.1,
        fill: valuePerAcre,
        // fill: (d) => d.properties.AssessedVa / d.properties.TotalAcres,
        title: (d) => `${d.properties.PARCELID}\n${(valuePerAcre(d)).toLocaleString("en-US", {style: "currency", currency: "USD"})}\n${d.properties.YearBuilt}\n${d.properties.SubName}\n${d.properties.Owner1}\n${d.properties.StreetNumb} ${d.properties.StreetName} ${d.properties.StreetSfx}, ${d.properties.LocZip}`
        }),
  ]
})
```

Let's try to find the highest valued properties.


```js
let mySorted = kissimmee.features.toSorted((a, b) => valuePerAcre(b) - valuePerAcre(a));
```

```js
mySorted.map(
    (d) => [d.properties.PARCELID, valuePerAcre(d), d.properties.EstimatedT, d.properties.TotalAcres, 
    `${d.properties.StreetNumb} ${d.properties.StreetName} ${d.properties.StreetSfx}, ${d.properties.CondoUnit ?? ""} ${d.properties.CondoComplex ?? ""}, ${d.properties.LocZip}`,
    d])
```

### Downtown CRA

Let's try to figure out the relative productivity of our Downtown area, first let's figure out the average for Kissimmee as a whole.

```js
// const kissimmeeArea = kissimmee.features.reduce((acc, val) => acc + (val.properties.EstimatedT > 0 ? val.properties.TotalAcres : 0.0), 0.0);
const kissimmeeArea = kissimmee.features.reduce((acc, val) => acc + val.properties.TotalAcres, 0.0);
const kissimmeeTax = kissimmee.features.reduce((acc, val) => acc + val.properties.EstimatedT, 0.0);
const kissimmeePerAcre = kissimmeeTax / kissimmeeArea;
```
So the average city wide is ${kissimmeePerAcre.toLocaleString("en-US", {style: "currency", currency: "USD"})}.

Now let's do the Downtown CRA.

```js
const downtownArea = downtown.features.reduce((acc, val) => acc + val.properties.TotalAcres, 0.0);
const downtownTax = downtown.features.reduce((acc, val) => acc + val.properties.EstimatedT, 0.0);
const downtownPerAcre = downtownTax / downtownArea;
```

So the average in the downtown area is ${downtownPerAcre.toLocaleString("en-US", {style: "currency", currency: "USD"})} which is a ratio of ${(downtownPerAcre / kissimmeePerAcre).toLocaleString(undefined, {maximumSignificantDigits: 4})}.

### Vine Street CRA

```js
const vinestArea = vinest.features.reduce((acc, val) => acc + val.properties.TotalAcres, 0.0);
const vinestTax = vinest.features.reduce((acc, val) => acc + val.properties.EstimatedT, 0.0);
const vinestPerAcre = vinestTax / vinestArea;
```

So the average in the Vine Street CRA area is ${vinestPerAcre.toLocaleString("en-US", {style: "currency", currency: "USD"})} which is a ratio of ${(vinestPerAcre / kissimmeePerAcre).toLocaleString(undefined, {maximumSignificantDigits: 3})}.



## By Subdivision

Let's try to aggregate all of the properties into their subdivisions.

```js
let bySub = {};

function merge({SubName: SubName, TotalAcres: TotalAcresA, EstimatedT: EstimatedTA, numProperties}, {TotalAcres: TotalAcresB, EstimatedT: EstimatedTB}) {
    return {
        SubName: SubName,
        TotalAcres: (TotalAcresA ?? 0.0) + (TotalAcresB ?? 0.0),
        EstimatedT: (EstimatedTA ?? 0.0) + (EstimatedTB ?? 0.0),
        numProperties: numProperties + 1
    }
}

kissimmee.features.forEach(
    (d) => {
        let sub = d.properties.Sub;
        bySub[d.properties.Sub] = merge(bySub[d.properties.Sub] ?? {SubName: d.properties.SubName, TotalAcres: 0.0, EstimatedT: 0.0, numProperties: 0}, d.properties)
    });

```

```js
function sorting(x) {
    return x.EstimatedT / x.TotalAcres
}
```

```js
Array.from(Object.values(bySub)).toSorted((a, b) => sorting(b) - sorting(a)).map(x => ({...x, perAcre: (x.EstimatedT / x.TotalAcres).toLocaleString("en-US", {style: "currency", currency: "USD"})}))
```

Things to do:

 * Try to clean up the data, expand some of the condo type properties with a useful merge.
 * Clean up the notebook with more explanatory sections.
 * Build a data loader to try to speed things up.
 * Separate out CRAs
 * Make interactive
 * 3D


## Scratch

```js
kissimmee.features.filter(x => x.properties.PARCELID == "202529236000170010")[0]
```


## Taxable Property

Let's look at taxable versus not taxable property.

```js
Plot.plot({
  projection: {type: "reflect-y", domain: kissimmee},
  width: 5200,
  height: 5200,
  color: {
      type: "categorical",
      scheme: "category10",
      legend: true,
  },
  marks: [
    Plot.geo(kissimmee, {
        strokeOpacity: 0.1,
        fill: (d) => (d.properties.EstimatedT > 0),
        title: (d) => `${d.properties.PARCELID}\n${(valuePerAcre(d)).toLocaleString("en-US", {style: "currency", currency: "USD"})}\n${d.properties.YearBuilt}\n${d.properties.SubName}\n${d.properties.Owner1}\n${d.properties.StreetNumb} ${d.properties.StreetName} ${d.properties.StreetSfx}, ${d.properties.LocZip}`
        }),
  ]
})
```

For just the downtown:

```js
Plot.plot({
  projection: {type: "reflect-y", domain: downtown},
  width: 5200,
  height: 5200,
  color: {
      type: "categorical",
      scheme: "category10",
      legend: true,
  },
  marks: [
    Plot.geo(downtown, {
        strokeOpacity: 0.1,
        fill: (d) => (d.properties.EstimatedT > 0),
        title: (d) => `${d.properties.PARCELID}\n${(valuePerAcre(d)).toLocaleString("en-US", {style: "currency", currency: "USD"})}\n${d.properties.YearBuilt}\n${d.properties.SubName}\n${d.properties.Owner1}\n${d.properties.StreetNumb} ${d.properties.StreetName} ${d.properties.StreetSfx}, ${d.properties.LocZip}`
        }),
  ]
})
```

And the Vine Street CRA

```js
Plot.plot({
  projection: {type: "reflect-y", domain: vinest},
  width: 5200,
  height: 5200,
  color: {
      type: "categorical",
      scheme: "category10",
      legend: true,
  },
  marks: [
    Plot.geo(vinest, {
        strokeOpacity: 0.1,
        fill: (d) => (d.properties.EstimatedT > 0),
        title: (d) => `${d.properties.PARCELID}\n${(valuePerAcre(d)).toLocaleString("en-US", {style: "currency", currency: "USD"})}\n${d.properties.YearBuilt}\n${d.properties.SubName}\n${d.properties.Owner1}\n${d.properties.StreetNumb} ${d.properties.StreetName} ${d.properties.StreetSfx}, ${d.properties.LocZip}`
        }),
  ]
})
```

# Scratch

Looks like `sec` is a useful sort of block level clustering of the city.

`Range` splits the city into three parts, west to east.

`Sub` is a smaller division.

`Census` is honestly probably a good way to split up the city into different regions.

```js

function selector(d) {
    return (d.properties.SubName ?? "").slice(0, 8);
}
```

```js
function aggToValuePerAcre(d) {
    let x = byCensus[selector(d)]; 
    return x.EstimatedT / x.TotalAcres
}
```

```js
Plot.plot({
  projection: {type: "reflect-y", domain: kissimmee},
  width: 5200,
  height: 5200,
  color: {
      type: "categorical",
      scheme: "category10",
      legend: true,
  },
  marks: [
    Plot.geo(kissimmee, {
        strokeOpacity: 0.1,
        fill: selector,
        title: (d) => `${d.properties.PARCELID}\n${aggToValuePerAcre(d).toLocaleString("en-US", {style: "currency", currency: "USD"})}\n${d.properties.YearBuilt}\n${d.properties.SubName}\n${d.properties.Owner1}\n${d.properties.StreetNumb} ${d.properties.StreetName} ${d.properties.StreetSfx}, ${d.properties.LocZip}`
        }),
  ]
})
```

## By Census Block

Let's try to aggregate all of the properties into their census block.

```js
let byCensus = {};

function merge({Census, TotalAcres: TotalAcresA, EstimatedT: EstimatedTA, numProperties}, {TotalAcres: TotalAcresB, EstimatedT: EstimatedTB}) {
    return {
        Census: Census,
        TotalAcres: (TotalAcresA ?? 0.0) + (TotalAcresB ?? 0.0),
        EstimatedT: (EstimatedTA ?? 0.0) + (EstimatedTB ?? 0.0),
        numProperties: numProperties + 1
    }
}

kissimmee.features.forEach(
    (d) => {
        let census = selector(d);
        byCensus[census] = merge(byCensus[census] ?? {Census: census, TotalAcres: 0.0, EstimatedT: 0.0, numProperties: 0}, d.properties)
    });

```

```js
Array.from(Object.values(byCensus)).toSorted((a, b) => sorting(b) - sorting(a)).map(x => ({...x, perAcre: (x.EstimatedT / x.TotalAcres).toLocaleString("en-US", {style: "currency", currency: "USD"})}))
```

```js
Plot.plot({
  projection: {type: "reflect-y", domain: kissimmee},
  width: 5200,
  height: 5200,
  color: {
      type: "threshold",
      scheme: "turbo",
      domain: [1, 40_000, 80_000, 150_000, 300_000, 400_000, 650_000, 1_000_000, 2_000_000, 3_500_000, 7_000_000, 10_000_000],
      legend: true,
  },
  marks: [
    Plot.geo(kissimmee, {
        strokeOpacity: 0.1,
        fill: aggToValuePerAcre,
        title: (d) => `${d.properties.PARCELID}\n${aggToValuePerAcre(d).toLocaleString("en-US", {style: "currency", currency: "USD"})}\n${d.properties.YearBuilt}\n${d.properties.SubName}\n${d.properties.Owner1}\n${d.properties.StreetNumb} ${d.properties.StreetName} ${d.properties.StreetSfx}, ${d.properties.LocZip}`
        }),
  ]
})
```


## Building Code


```js
Plot.plot({
  projection: {type: "reflect-y", domain: kissimmee},
  width: 5200,
  height: 5200,
  color: {
      type: "categorical",
      scheme: "category10",
      legend: true,
  },
  marks: [
    Plot.geo(kissimmee, {
        strokeOpacity: 0.1,
        fill: (d) => d.properties.Exemptio_1,
        title: (d) => `${d.properties.PARCELID}\n${d.properties.Exemptio_1}\n${d.properties.BuildType}\n${aggToValuePerAcre(d).toLocaleString("en-US", {style: "currency", currency: "USD"})}\n${d.properties.YearBuilt}\n${d.properties.SubName}\n${d.properties.Owner1}\n${d.properties.StreetNumb} ${d.properties.StreetName} ${d.properties.StreetSfx}, ${d.properties.LocZip}`
        }),
  ]
})
```
