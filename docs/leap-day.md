# Leap Day


The local newspaper ran a short article highlighting a "Leapling" born on Leap Day in a local hospital, and said that such an event was rare, occuring with a rate of only 1 in 1461.  Naturally they got this number from:

```tex
\frac{1}{3 \cdot 365 + 366} = \frac{1}{1461}
```

But of course, this isn't how leap days work in practice.  We switched from the Julian calendar to the Gregorian calendar to try to correct for the mismatch between the length of a year and the number of days in our calendar.

We'll load some data from [here](https://raw.githubusercontent.com/fivethirtyeight/data/master/births/US_births_2000-2014_SSA.csv).

```js
const data = FileAttachment("./data/US_births_2000-2014_SSA.csv").csv({typed: true});
```

```js
display(data)
```

```js
const totalBirths = data.reduce((acc, val) => acc + val.births, 0)

function leapDay(x) {
	return (x.date_of_month == 29) & (x.month == 2)
}

function sumBirths(acc, val) {
	return acc + val.births
}

const leaplings = data.filter(leapDay).reduce(sumBirths, 0);
const totalDays = data.length;
const leapDays = data.filter(leapDay).length;
```


There were ${totalBirths} in the dataset and only ${leaplings} leaplings for a raw odds of ${(totalBirths / leaplings).toFixed(2)}.

Compared to the days themselves which are ${(totalDays / leapDays).toFixed(2)}.  There were ${leapDays} leap days out of ${totalDays} days.

So, let's try to correct the ratio.  We have ${((totalBirths - leaplings) / (totalDays - leapDays) * 1461 / (leaplings / leapDays)).toFixed(2)}.

If we did the full calendar, we would have ${((400 * 365 + 100 - 4 + 1)/(100 - 4 + 1)).toFixed(2)}.


I'm interested in trying to work out the odds that someone is a leapling, and in particular I'm sorta suspicious that because of the [Gelman Analysis](https://statmodeling.stat.columbia.edu/2016/05/18/birthday-analysis-friday-the-13th-update/) we might be able to exclude that statement.

![relative births, day of year effect](https://statmodeling.stat.columbia.edu/wp-content/uploads/2016/05/bialik-fridaythe13th-1-1024x846.png)

## Simple Form

Let's try to simplify things a bit and take an equal period out of the data.

```js
const filteredData = data.filter((x) => (x.year < 2012));
const filteredTotalBirths = filteredData.reduce(sumBirths, 0);
const filteredLeaplings = filteredData.filter(leapDay).reduce(sumBirths, 0);
```

We get ${filteredTotalBirths} of which ${filteredLeaplings} are leaplings, so ${filteredTotalBirths - filteredLeaplings} non leaplings.

```js
import jstat from "npm:jstat";

function linspace(start, stop, nsteps) {
	const delta = (stop - start) / nsteps;
	return d3.range(nsteps).map((i) => start + i * delta)
}

function normalize(xs) {
	const total = xs.reduce((acc, val) => acc + val, 0)
	return xs.map((x) => x / total);
}

const odds = linspace(1450, 1700, 300);
const ps = normalize(odds.map((y, i) => -1/(odds[i]*odds[i]) * jstat.beta.pdf(1/y, filteredLeaplings, filteredTotalBirths - filteredLeaplings)));

display(
	Plot.plot({
		marks: [
			Plot.lineY(ps, {x: odds}),
			Plot.ruleX([1461], {stroke: "red"}),
			Plot.ruleX([(400 * 365 + 100 - 4 + 1)/(100 - 4 + 1)], {stroke: "blue"}),
			]})
)
```
